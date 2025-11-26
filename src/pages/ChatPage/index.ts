import Handlebars from 'handlebars';
import Component from "../../services/Component";
import template from './Chat.hbs?raw';
import HTTPTransport from "../../services/HTTPTransport";
import { Button } from '../../components/button/Button';
import Input from '../../components/input/Input';
import Router from '../../services/Router';
import { ChatWindow } from '../../components/ChatWindow';
import WSService from '../../services/WSService';
import ChatAPI from '../../api/ChatAPI';

export default class ChatPage extends Component {
  private api: HTTPTransport;
  private chatApi: ChatAPI;
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
          if (chatItem && !target.closest('.delete-chat-button')) {
            this.handleChatItemClick(chatItem as HTMLElement);
          }

          if (target.closest('.delete-chat-button')) {
            const chatId = target.dataset.chatId;
            if (chatId) {
              this.handleDeleteChat(parseInt(chatId, 10));
            }
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
    this.chatApi = new ChatAPI();
  }

  handleChatItemClick(chatItem: HTMLElement) {
    this.currentChatId = parseInt(chatItem.dataset.chatId!);
    const messages = this.chatMessages.get(this.currentChatId) || [];
    const selectedChat = (this.props.chats as any[]).find(c => c.id === this.currentChatId);

    (this.props.chatWindow as ChatWindow).setProps({
      messages,
      selectedChat,
      user: this.props.user
    });

    this.eventBus().emit(Component.EVENTS.FLOW_RENDER);
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

  handleDeleteChat(chatId: number) {
    this.chatApi.deleteChat(chatId).then(() => {
      this.getChatsList();
      if (this.currentChatId === chatId) {
        this.currentChatId = null;
        (this.props.chatWindow as ChatWindow).setProps({ selectedChat: null, messages: [] });
      }
    }).catch(error => {
      console.error('Error deleting chat:', error);
    });
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
      newMessages = data.reverse();
    } else if (typeof data === 'object' && data !== null && data.type === 'message') {
      newMessages = [...existingMessages, data];
    } else {
      newMessages = existingMessages;
    }

    if (newMessages.length > 0) {
      this.chatMessages.set(chatId, newMessages);

      if (this.currentChatId === chatId) {
        (this.props.chatWindow as ChatWindow).setProps({ messages: newMessages, user: this.props.user });
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

    (chats as any[]).forEach(chat => {
      this.api.post(`/chats/token/${chat.id}`).then((response: any) => {
        const token = response.data.token;
        const url = `wss://ya-praktikum.tech/ws/chats/${userId}/${chat.id}/${token}`;
        const socket = new WSService(url, (data) => this.handleSocketMessage(chat.id, data));
        this.sockets.set(chat.id, socket);
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
