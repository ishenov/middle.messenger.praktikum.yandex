import Handlebars from 'handlebars';
import Component from "../../services/Component";
import template from './Chat.hbs?raw';
import HTTPTransport from "../../services/HTTPTransport";
import { Button } from '../../components/button/Button';
import Input from '../../components/input/Input';
import Router from '../../services/Router';
import { ChatWindow } from '../../components/ChatWindow';
import WSService from '../../services/WSService';

export default class ChatPage extends Component {
  private api: HTTPTransport;
  private searchValue: string = '';
  private currentChatId: number | null = null;
  private sockets: Map<number, WSService> = new Map();
  private chatMessages: Map<number, any[]> = new Map();

  constructor(props: Record<string, unknown> = {}) {
    const searchInput = new Input({
      id: 'search',
      type: 'text',
      placeholder: 'Поиск',
      class: 'search',
    });
    const profileLinkButton = new Button({ id: 'profile-link', text: 'Профиль >', class: 'profile-link', type: 'button' });
    const addChatButton = new Button({ id: 'add-chat', text: '+', class: 'add-chat', type: 'button' });
    const chatWindow = new ChatWindow({ user: props.user });

    super("div", {
      ...props,
      searchInput,
      profileLinkButton,
      addChatButton,
      chatWindow,
      events: {
        click: (e: Event) => {
          const target = e.target as HTMLElement;
          if (target.closest('#profile-link')) this.handleProfileLinkClick();
          if (target.closest('#add-chat')) this.createChat();

          const chatItem = target.closest('.chat-item');
          if (chatItem) {
            this.handleChatItemClick(chatItem as HTMLElement);
          }

          if (target.closest('#send-button')) {
            e.preventDefault();
            const form = target.closest('form');
            if (form) {
              const formData = new FormData(form);
              const data = Object.fromEntries(formData.entries());
              if (data.message) {
                this.handleSendMessage(data.message as string);
                form.reset();
              }
            }
          }
        },
        input: (e: Event) => {
            const target = e.target as HTMLInputElement;
            if (target.id === 'search') {
                this.searchValue = target.value;
            }
        }
      },
    });

    this.api = new HTTPTransport();
  }

  handleChatItemClick(chatItem: HTMLElement) {
    const chatId = chatItem.dataset.chatId;
    if (chatId) {
      this.currentChatId = parseInt(chatId);
      const messages = this.chatMessages.get(this.currentChatId) || [];
      const selectedChat = (this.props.chats as any[]).find(c => c.id === this.currentChatId);

      // @ts-ignore
      const chatWindow = this.props.chatWindow as ChatWindow;
      chatWindow.setProps({
        messages,
        selectedChat,
        user: this.props.user
      });

      this.eventBus().emit(Component.EVENTS.FLOW_RENDER);
    }
  }

  handleProfileLinkClick() {
    const router = new Router('#app');
    router.go('/settings');
  }

  createChat() {
    this.api.post('/chats', {
      title: this.searchValue,
    }).then(() => {
      this.getChatsList()
    })
  }

  handleSendMessage(message: string) {
    if (!this.currentChatId) {
      console.error('No active chat.');
      return;
    }

    const socket = this.sockets.get(this.currentChatId);
    if (socket) {
      socket.send({
        content: message,
        type: 'message',
      });
    } else {
      console.error('Socket for chat not found.');
    }
  }

  handleSocketMessage(chatId: number, data: any) {
    const existingMessages = this.chatMessages.get(chatId) || [];
    let newMessages: any[] = [];

    if (Array.isArray(data)) {
      // History is usually sent newest-first. We reverse it to be oldest-first.
      newMessages = data.reverse();
    } else if (typeof data === 'object' && data !== null && data.type === 'message') {
      // A new live message. We append it to the end to maintain chronological order.
      newMessages = [...existingMessages, data];
    } else {
      // If it's not an array or a message, do nothing.
      newMessages = existingMessages;
    }

    if (newMessages.length > 0) {
      this.chatMessages.set(chatId, newMessages);

      if (this.currentChatId === chatId) {
        // @ts-ignore
        const chatWindow = this.props.chatWindow as ChatWindow;
        chatWindow.setProps({ messages: newMessages, user: this.props.user });

        this.eventBus().emit(Component.EVENTS.FLOW_RENDER);
      }
    }
  }

  getChatsList() {
    this.api.get('/chats').then(response => {
      this.setProps({
        chats: response.data,
      })
      this.openChatSockets(response.data)
    })
  }

  openChatSockets(chats: unknown) {
    const userId = (this.props.user as any)?.id;
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    // @ts-ignore
    chats.forEach(chat => {
      this.api.post(`/chats/token/${chat.id}`).then((response: any) => {
        const token = response.data.token;
        const url = `wss://ya-praktikum.tech/ws/chats/${userId}/${chat.id}/${token}`;
        const socket = new WSService(url, (data) => this.handleSocketMessage(chat.id, data));
        this.sockets.set(chat.id, socket);
        // Get old messages
        socket.onOpen(() => {
          socket.send({ content: '0', type: 'get old' });
        });
      });
    });
  }

  componentDidMount() {
    this.getChatsList()
    Object.values(this.props).forEach(prop => {
      if (prop instanceof Component) {
        prop.dispatchComponentDidMount();
      }
    });
  }

  render(): string {
    const compiled = Handlebars.compile(template);
    return compiled({
      ...this.props,
      searchInput: (this.props.searchInput as Input).render(),
      profileLinkButton: (this.props.profileLinkButton as Button).render(),
      chatWindow: (this.props.chatWindow as ChatWindow).render(),
      addChatButton: (this.props.addChatButton as Button).render(),
    });
  }
}
