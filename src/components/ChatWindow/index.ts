import Handlebars from 'handlebars';
import Component, { Props } from "../../services/Component";
import template from './ChatWindow.hbs?raw';
import { Button } from '../button/Button';
import ValidatedInput from '../validated-input/ValidatedInput';
import { AddUserModal } from '../AddUserModal';

interface ChatWindowProps extends Props {
  messageInput?: ValidatedInput;
  sendButton?: Button;
  addUserButton?: Button;
  addUserModal?: AddUserModal;
}

export class ChatWindow extends Component<ChatWindowProps> {
  addUserModal: AddUserModal;

  constructor(props: ChatWindowProps = {}) {
    const messageInput = new ValidatedInput({ id: 'message', type: 'text', placeholder: 'Сообщение', fieldName: 'message' });
    const sendButton = new Button({ id: 'send-button', text: '➤', class: 'send-button', type: 'button' });

    const addUserModal = new AddUserModal({
      isOpen: false,
    });

    const addUserButton = new Button({
      id: 'add-user-button',
      text: 'Добавить/Удалить пользователя',
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
