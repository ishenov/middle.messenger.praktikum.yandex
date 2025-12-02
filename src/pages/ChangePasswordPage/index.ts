import Handlebars from 'handlebars';
import Component, { Props } from "../../services/Component";
import template from './ChangePassword.hbs?raw';
import { Button } from '../../components/button/Button';
import ValidatedInput from '../../components/validated-input/ValidatedInput';
import Input from '../../components/input/Input';
import Router from '../../services/Router';
import UserAPI from '../../api/UserAPI';
import NotificationService from '../../services/NotificationService';

interface ChangePasswordPageProps extends Props {
  oldPasswordInput?: Input;
  newPasswordInput?: ValidatedInput;
  saveButton?: Button;
}

export default class ChangePasswordPage extends Component<ChangePasswordPageProps> {
  private userApi: UserAPI;

  constructor(props: ChangePasswordPageProps = {}) {
    const oldPasswordInput = new Input({ id: "oldPassword", name: "oldPassword", type: "password", value: "" });
    const newPasswordInput = new ValidatedInput({ id: "newPassword", name: "newPassword", type: "password", value: "", fieldName: "password" });

    const saveButton = new Button({ text: "Сохранить", class: "edit-link secondary", type: "submit" });

    super("form", {
      ...props,
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
            this.handleSave(e.currentTarget as HTMLFormElement);
        }
      },
    });

    this.userApi = new UserAPI();
  }

  handleBack() {
    const router = new Router('#app');
    router.back();
  }

  async handleSave(form: HTMLFormElement) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries()) as Record<string, string>;
    console.log(data)
    try {
      await this.userApi.changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.password
      });
      NotificationService.show('Password changed successfully', 'success');
      this.handleBack();
    } catch (error) {
      const errorMessage = (error as Error).message || 'An unknown error occurred';
      NotificationService.show(errorMessage, 'error');
      console.error('Error changing password:', error);
    }
  }

  render(): string {
    const compiled = Handlebars.compile(template);
    const props = {
      ...this.props,
      oldPasswordInput: (this.props.oldPasswordInput as Input).getContent()?.outerHTML,
      newPasswordInput: (this.props.newPasswordInput as ValidatedInput).getContent()?.outerHTML,
      saveButton: (this.props.saveButton as Button).getContent()?.outerHTML,
    };
    return compiled(props);
  }
}
