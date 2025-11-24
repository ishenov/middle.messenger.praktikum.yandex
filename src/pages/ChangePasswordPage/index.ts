import Handlebars from 'handlebars';
import Component from "../../services/Component";
import template from './ChangePassword.hbs?raw';
import { Button } from '../../components/button/Button';
import ValidatedInput from '../../components/validated-input/ValidatedInput';
import Router from '../../services/Router';

export default class ChangePasswordPage extends Component {
  constructor(props: Record<string, unknown> = {}) {
    const oldPasswordInput = new ValidatedInput({ id: "oldPassword", type: "password", value: "", fieldName: "password" });
    const newPasswordInput = new ValidatedInput({ id: "newPassword", type: "password", value: "", fieldName: "password" });

    const saveButton = new Button({ text: "Сохранить", class: "edit-link secondary", type: "submit" });

    super("div", {
      ...props,
      firstName: 'Иван',
      oldPasswordInput,
      newPasswordInput,
      saveButton,
      events: {
        click: (e: Event) => {
          const target = e.target as HTMLElement;
          if (target.id === 'back-button') this.handleBack();
        },
        submit: (e: Event) => {
            e.preventDefault();
            this.handleSave();
        }
      },
    });
  }

  handleBack() {
    const router = new Router('#app');
    router.back();
  }

  handleSave() {
    // Тут будет логика сохранения пароля
    console.log('Password saved');
    this.handleBack();
  }

  render(): string {
    const compiled = Handlebars.compile(template);
    const props = {
      ...this.props,
      oldPasswordInput: this.props.oldPasswordInput.getContent()?.outerHTML,
      newPasswordInput: this.props.newPasswordInput.getContent()?.outerHTML,
      saveButton: this.props.saveButton.getContent()?.outerHTML,
    };
    return compiled(props);
  }
}
