import Handlebars from 'handlebars';
import Component from "../../services/Component";
import template from './ChatWindow.hbs?raw';
import { Button } from '../button/Button';
import ValidatedInput from '../validated-input/ValidatedInput';
import { AddUserModal } from '../AddUserModal';

export class ChatWindow extends Component {
  addUserModal: AddUserModal;

  constructor(props: Record<string, unknown> = {}) {
    const messageInput = new ValidatedInput({ id: 'message', type: 'text', placeholder: 'Сообщение', fieldName: 'message' });
    const sendButton = new Button({ id: 'send-button', text: '➤', class: 'send-button', type: 'button' });

    const addUserModal = new AddUserModal({
      isOpen: false,
      onSearch: async (login: string) => {
        try {
          const response = await fetch('https://ya-praktikum.tech/api/v2/user/search', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login }),
          });
          if (response.ok) {
            const users = await response.json();
            this.addUserModal.setProps({ searchResults: users });
          } else {
            console.error('Failed to search users:', response.statusText);
            this.addUserModal.setProps({ searchResults: [] });
          }
        } catch (error) {
          console.error('Error searching users:', error);
          this.addUserModal.setProps({ searchResults: [] });
        }
      },
      onAddUserToChat: (userId: number) => {
        console.log(`Adding user ${userId} to chat ${this.props.selectedChat?.id}`);
        this.addUserModal.close();
      }
    });

    const addUserButton = new Button({
      id: 'add-user-button',
      text: 'Добавить пользователя в чат',
      class: 'add-user-button',
      type: 'button',
    });

    super("div", {
      ...props,
      messageInput,
      sendButton,
      addUserButton,
      addUserModal,
    });

    this.addUserModal = addUserModal;
  }

  render(): string {
    const compiled = Handlebars.compile(template);
    return compiled({
      ...this.props,
      messageInput: (this.props.messageInput as ValidatedInput).render(),
      sendButton: (this.props.sendButton as Button).render(),
      addUserButton: (this.props.addUserButton as Button).render(),
      addUserModal: (this.props.addUserModal as AddUserModal).render(),
    });
  }
}
