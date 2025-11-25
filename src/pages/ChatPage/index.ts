import Handlebars from 'handlebars';
import Component from "../../services/Component";
import template from './Chat.hbs?raw';
import HTTPTransport from "../../services/HTTPTransport";
import { Button } from '../../components/button/Button';
import Input from '../../components/input/Input';
import Router from '../../services/Router';
import { ChatWindow } from '../../components/ChatWindow';
import ValidatedInput from '../../components/validated-input/ValidatedInput';
import WSService from '../../services/WSService';

export default class ChatPage extends Component {
  private api: HTTPTransport;
  private searchValue: string = '';
  private currentChatId: number | null = null;
  private sockets: Map<number, WSService> = new Map();

  constructor(props: Record<string, unknown> = {}) {
    const searchInput = new Input({
      id: 'search',
      type: 'text',
      placeholder: 'Поиск',
      class: 'search',
    });
    const profileLinkButton = new Button({ id: 'profile-link', text: 'Профиль >', class: 'profile-link', type: 'button' });
    const addChatButton = new Button({ id: 'add-chat', text: '+', class: 'add-chat', type: 'button' });
    const chatWindow = new ChatWindow();
    const fileButton = new Button({ id: 'file-button', text: '📎', class: 'file-button', type: 'button' });
    const messageInput = new ValidatedInput({ id: 'message', type: 'text', placeholder: 'Сообщение', fieldName: 'message' });
    const sendButton = new Button({ id: 'send-button', text: '➤', class: 'send-button', type: 'submit' });

    super("div", {
      ...props,
      searchInput,
      profileLinkButton,
      addChatButton,
      chatWindow,
      fileButton,
      messageInput,
      sendButton,
      events: {
        click: (e: Event) => {
          const target = e.target as HTMLElement;
          if (target.closest('#profile-link')) this.handleProfileLinkClick();
          if (target.closest('#file-button')) this.handleFileButtonClick();
          if (target.closest('#add-chat')) this.createChat();

          const chatItem = target.closest('.chat-item');
          if (chatItem) {
            this.handleChatItemClick(chatItem as HTMLElement);
          }
        },
        submit: (e: Event) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          if (form.id === 'message-form') {
            this.handleSendMessage(form);
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
      this.currentChatId = parseInt(chatId, 10);
      console.log('currentChatId:', this.currentChatId);
    }
  }

  handleProfileLinkClick() {
    const router = new Router('#app');
    router.go('/settings');
  }

  handleFileButtonClick() {
    console.log('File button clicked');
  }

  createChat() {
    this.api.post('/chats', {
      title: this.searchValue,
    }).then(() => {
      this.getChatsList()
    })
  }

  handleSendMessage(form: HTMLFormElement) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    console.log('Sending message:', data);
    form.reset(); // Очищаем форму
  }

  getChatsList() {
    this.api.get('/chats').then(response => {
      this.setProps({
        chats: response.data,
      });
      this.openChatSockets(response.data);
    })
  }

  openChatSockets(chats: unknown) {
    const userId = (this.props.user as any)?.id;
    console.log(userId)
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    // @ts-ignore
    chats.forEach((chat: { id: number; }) => {
      this.api.post(`/chats/token/${chat.id}`).then((response: any) => {
        const token = response.data.token;
        const url = `wss://ya-praktikum.tech/ws/chats/${userId}/${chat.id}/${token}`;
        const socket = new WSService(url);
        this.sockets.set(chat.id, socket);
      });
    });
  }

  componentDidMount() {
    // I'll assume the user is already in the props. If not, you'll need to fetch it first.
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
      fileButton: (this.props.fileButton as Button).render(),
      addChatButton: (this.props.addChatButton as Button).render(),
      messageInput: (this.props.messageInput as ValidatedInput).render(),
      sendButton: (this.props.sendButton as Button).render(),
    });
  }
}
