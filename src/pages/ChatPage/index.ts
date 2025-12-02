import Handlebars from 'handlebars';
import Component, { Props } from "../../services/Component";
import template from './Chat.hbs?raw';
import HTTPTransport, { HTTPTransportResponse } from "../../services/HTTPTransport";
import { Button } from '../../components/button/Button';
import Input from '../../components/input/Input';
import Router from '../../services/Router';
import { ChatWindow } from '../../components/ChatWindow';
import WSService from '../../services/WSService';
import ChatAPI from '../../api/ChatAPI';

interface Chat {
  id: number;
  title: string;
  avatar: string | null;
  unread_count: number;
  last_message: {
    user: {
      first_name: string;
      second_name: string;
      avatar: string;
      email: string;
      login: string;
      phone: string;
    };
    time: string;
    content: string;
  } | null;
}

interface Message {
  id: number;
  user_id: number;
  chat_id: number;
  type: 'message' | 'file' | 'sticker';
  time: string;
  content: string;
  is_read: boolean;
  file: {
    id: number;
    user_id: number;
    path: string;
    filename: string;
    content_type: string;
    content_size: number;
    upload_date: string;
  } | null;
}

interface User {
    id: number;
    first_name: string;
    second_name: string;
    display_name: string | null;
    login: string;
    avatar: string | null;
}

interface ChatPageProps extends Props {
  user?: unknown;
  chats?: Chat[];
  searchInput?: Input;
  profileLinkButton?: Button;
  addChatButton?: Button;
  chatWindow?: ChatWindow;
}

export default class ChatPage extends Component<ChatPageProps> {
  private api: HTTPTransport;
  private chatApi: ChatAPI;
  private searchValue: string = '';
  private currentChatId: number | null = null;
  private sockets: Map<number, WSService> = new Map();
  private chatMessages: Map<number, Message[]> = new Map();

  constructor(props: ChatPageProps = {}) {
    const searchInput = new Input({
      id: 'search',
      type: 'text',
      placeholder: 'Введите название нового чата',
      class: 'search',
    });
    const profileLinkButton = new Button({ id: 'profile-link', text: 'Профиль >', class: 'profile-link', type: 'button' });
    const addChatButton = new Button({ id: 'add-chat', text: 'Создать', class: 'add-chat', type: 'button' });

    const chatWindow = new ChatWindow({
      user: props.user,
      onCloseAddUserModal: () => {
        this.eventBus().emit(Component.EVENTS.FLOW_RENDER);
      }
    });

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

          if (target.closest('#add-user-button')) {
            if (!this.currentChatId) {
              console.error('No chat selected');
              return;
            }
            this.api.get<User[]>(`/chats/${this.currentChatId}/users`)
              .then((response: HTTPTransportResponse<User[]>) => {
                const users = response.data;
                const chatWindowComponent = (this.props.chatWindow as ChatWindow);
                chatWindowComponent.addUserModal.setProps({ currentChatUsers: users, searchResults: [] });
                chatWindowComponent.addUserModal.open();
                this.eventBus().emit(Component.EVENTS.FLOW_RENDER);
              })
              .catch(error => console.error('Failed to fetch chat users:', error));
          }

          if (target.closest('#close-add-user-modal')) {
            e.preventDefault();
            const chatWindowComponent = (this.props.chatWindow as ChatWindow);
            chatWindowComponent.addUserModal.setProps({ currentChatUsers: [], searchResults: [] });
            chatWindowComponent.addUserModal.close();
            this.eventBus().emit(Component.EVENTS.FLOW_RENDER);
          }

          if (target.closest('#user-search-button')) {
            e.preventDefault();
            const input = this.element?.querySelector('#user-search-login') as HTMLInputElement;
            if (input && input.value) {
              this.handleUserSearch(input.value);
            }
          }

          if (target.closest('.add-user-to-chat-button')) {
            const {userId} = (target as HTMLElement).dataset;
            if (userId) {
              this.handleAddUserToChat(parseInt(userId, 10));
            }
          }

          if (target.closest('.remove-user-from-chat-button')) {
            const {userId} = (target as HTMLElement).dataset;
            if (userId) {
              this.handleRemoveUserFromChat(parseInt(userId, 10));
            }
          }

          const chatItem = target.closest('.chat-item');
          if (chatItem && !target.closest('.delete-chat-button')) {
            this.handleChatItemClick(chatItem as HTMLElement);
          }

          if (target.closest('.delete-chat-button')) {
            const {chatId} = target.dataset;
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
        },
        submit: (e: Event) => {
          const target = e.target as HTMLFormElement;
          e.preventDefault();

          if (target.id === 'message-form') {
            const formData = new FormData(target);
            const data = Object.fromEntries(formData.entries());

            if (data.message) {
              this.handleSendMessage(data.message as string);
              target.focus();
            }
          }
        },
        keydown: (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (e.key === 'Enter' && target.matches('#user-search-login')) {
                e.preventDefault();
                const input = target as HTMLInputElement;
                if (input.value) {
                    this.handleUserSearch(input.value);
                }
            }
        }
      },
    });

    this.api = new HTTPTransport();
    this.chatApi = new ChatAPI();
  }

  private handleRemoveUserFromChat(userId: number) {
    if (!this.currentChatId) {
      console.error('No chat selected to remove a user from.');
      return;
    }
    this.api.delete('/chats/users', { users: [userId], chatId: this.currentChatId })
      .then(() => {
        // After successful removal, re-fetch the list of users to update the modal
        return this.api.get<User[]>(`/chats/${this.currentChatId}/users`);
      })
      .then((response: HTTPTransportResponse<User[]>) => {
        const users = response.data;
        const chatWindow = this.props.chatWindow as ChatWindow;
        chatWindow.addUserModal.setProps({ currentChatUsers: users });
        this.eventBus().emit(Component.EVENTS.FLOW_RENDER);
      })
      .catch(error => {
        console.error('Error removing user from chat:', error);
      });
  }

  private handleAddUserToChat(userId: number) {
    if (!this.currentChatId) {
      console.error('No chat selected to add a user to.');
      return;
    }
    this.api.put('/chats/users', { users: [userId], chatId: this.currentChatId })
      .then(() => {
        const chatWindow = this.props.chatWindow as ChatWindow;
        chatWindow.addUserModal.close();
        this.eventBus().emit(Component.EVENTS.FLOW_RENDER);
      })
      .catch(error => {
        console.error('Error adding user to chat:', error);
      });
  }

  private handleUserSearch(login: string) {
    this.api.post<User[]>('/user/search', { login })
      .then((response: HTTPTransportResponse<User[]>) => {
        const users = response.data;
        const chatWindow = this.props.chatWindow as ChatWindow;
        chatWindow.addUserModal.setProps({ searchResults: users });
        this.eventBus().emit(Component.EVENTS.FLOW_RENDER);
      })
      .catch(error => {
        console.error('Error searching users:', error);
        const chatWindow = this.props.chatWindow as ChatWindow;
        chatWindow.addUserModal.setProps({ searchResults: [] });
        this.eventBus().emit(Component.EVENTS.FLOW_RENDER);
      });
  }

  handleChatItemClick(chatItem: HTMLElement) {
    this.currentChatId = parseInt(chatItem.dataset.chatId!);
    const messages = this.chatMessages.get(this.currentChatId) || [];
    const selectedChat = (this.props.chats as Chat[]).find(c => c.id === this.currentChatId);

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

  handleSocketMessage(chatId: number, data: unknown) {
    const existingMessages = this.chatMessages.get(chatId) || [];
    let newMessages: Message[] = [];

    if (Array.isArray(data)) {
      newMessages = data.reverse() as Message[];
    } else if (typeof data === 'object' && data !== null && 'type' in data && data.type === 'message') {
      newMessages = [...existingMessages, data as Message];
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
    this.api.get<Chat[]>('/chats').then(response => {
      this.setProps({
        chats: response.data,
      })
      this.openChatSockets(response.data)
    })
  }

  openChatSockets(chats: unknown) {
    const userId = (this.props.user as { id: number })?.id;
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    if (Array.isArray(chats)) {
        (chats as Chat[]).forEach(chat => {
            this.api.post<{ token: string }>(`/chats/token/${chat.id}`).then((response: HTTPTransportResponse<{ token: string }>) => {
                const {token} = response.data;
                const url = `wss://ya-praktikum.tech/ws/chats/${userId}/${chat.id}/${token}`;
                const socket = new WSService(url, (data) => this.handleSocketMessage(chat.id, data));
                this.sockets.set(chat.id, socket);
            });
        });
    }
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
