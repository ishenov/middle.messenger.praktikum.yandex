import Handlebars from 'handlebars';
import Component from "../../services/Component";
import template from './ChatWindow.hbs?raw';
import { Button } from '../button/Button';
import ValidatedInput from '../validated-input/ValidatedInput';

export class ChatWindow extends Component {
  constructor(props: Record<string, unknown> = {}) {
    const messageInput = new ValidatedInput({ id: 'message', type: 'text', placeholder: 'Сообщение', fieldName: 'message' });
    const sendButton = new Button({ id: 'send-button', text: '➤', class: 'send-button', type: 'button' });

    super("div", {
      ...props,
      messageInput,
      sendButton,
    });
  }

  render(): string {
    const compiled = Handlebars.compile(template);
    return compiled({
      ...this.props,
      messageInput: (this.props.messageInput as ValidatedInput).render(),
      sendButton: (this.props.sendButton as Button).render(),
    });
  }
}
