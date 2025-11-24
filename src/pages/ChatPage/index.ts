import Handlebars from 'handlebars';
import Component from "../../services/Component";
import template from './Chat.hbs?raw';
import HTTPTransport from "../../services/HTTPTransport";
import { Button } from '../../components/button/Button';
import ValidatedInput from '../../components/validated-input/ValidatedInput';
import Input from '../../components/input/Input';
import Router from '../../services/Router';

export default class ChatPage extends Component {
  private api: HTTPTransport;

  constructor(props: Record<string, unknown> = {}) {
    const searchInput = new Input({ id: 'search', type: 'text', placeholder: 'Поиск', class: 'search' });
    const profileLinkButton = new Button({ id: 'profile-link', text: 'Профиль >', class: 'profile-link', type: 'button' });
    const fileButton = new Button({ id: 'file-button', text: '📎', class: 'file-button', type: 'button' });
    const messageInput = new ValidatedInput({ id: 'message', type: 'text', placeholder: 'Сообщение', fieldName: 'message' });
    const sendButton = new Button({ id: 'send-button', text: '➤', class: 'send-button', type: 'submit' });

    super("div", {
      ...props,
      searchInput,
      profileLinkButton,
      fileButton,
      messageInput,
      sendButton,
      events: {
        click: (e: Event) => {
          const target = e.target as HTMLElement;
          if (target.closest('#profile-link')) this.handleProfileLinkClick();
          if (target.closest('#file-button')) this.handleFileButtonClick();
        },
        submit: (e: Event) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          if (form.id === 'message-form') {
            this.handleSendMessage(form);
          }
        }
      },
    });

    this.api = new HTTPTransport();
  }

  handleProfileLinkClick() {
    const router = new Router('#app');
    router.go('/profile');
  }

  handleFileButtonClick() {
    console.log('File button clicked');
  }

  handleSendMessage(form: HTMLFormElement) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    console.log('Sending message:', data);
    form.reset(); // Очищаем форму
  }

  componentDidMount() {
    this.api.get('/chats').then(response => {
      this.setProps({
        chats: response.data,
      })
    })
  }

  render(): string {
    const compiled = Handlebars.compile(template);
    return compiled({
      ...this.props,
      searchInput: (this.props.searchInput as Input).getContent()?.outerHTML,
      profileLinkButton: (this.props.profileLinkButton as Button).getContent()?.outerHTML,
      fileButton: (this.props.fileButton as Button).getContent()?.outerHTML,
      messageInput: (this.props.messageInput as ValidatedInput).getContent()?.outerHTML,
      sendButton: (this.props.sendButton as Button).getContent()?.outerHTML,
    });
  }
}
