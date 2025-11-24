import Handlebars from 'handlebars';
import Component from "../../services/Component";
import template from './Profile.hbs?raw';
import { Button } from '../../components/button/Button';
import ValidatedInput from '../../components/validated-input/ValidatedInput';
import Input from '../../components/input/Input';
import Router from '../../services/Router';

export default class ProfilePage extends Component {
  constructor(props: Record<string, unknown> = {}) {
    const emailInput = new ValidatedInput({ id: "email", class: "profile-input", type: "email", value: "{{email}}", fieldName: "email" });
    const loginInput = new ValidatedInput({ id: "login", class: "profile-input", type: "text", value: "{{login}}", fieldName: "login" });
    const firstNameInput = new ValidatedInput({ id: "first_name", class: "profile-input", type: "text", value: "{{firstName}}", fieldName: "first_name" });
    const secondNameInput = new ValidatedInput({ id: "second_name", class: "profile-input", type: "text", value: "{{secondName}}", fieldName: "second_name" });
    const displayNameInput = new Input({ id: "display_name", class: "profile-input", type: "text", value: "{{displayName}}", name: "display_name" });
    const phoneInput = new ValidatedInput({ id: "phone", class: "profile-input", type: "tel", value: "{{phone}}", fieldName: "phone" });
    const saveButton = new Button({ id: "save-button", text: "Сохранить", class: "edit-link secondary", type: "submit" });
    const editDataButton = new Button({ id: "edit-data-button", text: "Изменить данные", class: "edit-link secondary", type: "button" });
    const changePasswordButton = new Button({ id: "change-password-button", text: "Изменить пароль", class: "edit-link secondary", type: "button" });
    const logoutButton = new Button({ id: "logout-button", text: "Выйти", class: "logout-link secondary", type: "button" });

    super("div", {
      ...props,
      isEdit: false,
      email: 'pochta@yandex.ru',
      login: 'ivanivanov',
      firstName: 'Иван',
      secondName: 'Иванов',
      displayName: 'Иван',
      phone: '+7 (909) 967 30 30',
      emailInput,
      loginInput,
      firstNameInput,
      secondNameInput,
      displayNameInput,
      phoneInput,
      saveButton,
      editDataButton,
      changePasswordButton,
      logoutButton,
      events: {
        click: (e: Event) => {
          const target = e.target as HTMLElement;
          if (target.closest('#back-button')) this.handleBack();
          if (target.closest('#edit-data-button')) this.toggleEditMode(true);
          if (target.closest('#change-password-button')) this.handleChangePassword();
          if (target.closest('#logout-button')) this.handleLogout();
        },
        submit: (e: Event) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            if (form.id === 'profile-form') {
                this.handleSave(form);
            }
        }
      },
    });
  }

  handleSave(form: HTMLFormElement) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    console.log('Saving profile data:', data);
    this.toggleEditMode(false);
  }

  toggleEditMode(isEdit: boolean) {
    this.setProps({ isEdit });
  }

  handleBack() {
    const router = new Router('#app');
    router.back();
  }

  handleChangePassword() {
    const router = new Router('#app');
    router.go('/change-password');
  }

  handleLogout() {
    console.log('Logout clicked');
    const router = new Router('#app');
    router.go('/');
  }

  render(): string {
    const compiled = Handlebars.compile(template);
    const props = {
      ...this.props,
      emailInput: (this.props.emailInput as ValidatedInput).getContent()?.outerHTML,
      loginInput: (this.props.loginInput as ValidatedInput).getContent()?.outerHTML,
      firstNameInput: (this.props.firstNameInput as ValidatedInput).getContent()?.outerHTML,
      secondNameInput: (this.props.secondNameInput as ValidatedInput).getContent()?.outerHTML,
      displayNameInput: (this.props.displayNameInput as Input).getContent()?.outerHTML,
      phoneInput: (this.props.phoneInput as ValidatedInput).getContent()?.outerHTML,
      saveButton: (this.props.saveButton as Button).getContent()?.outerHTML,
      editDataButton: (this.props.editDataButton as Button).getContent()?.outerHTML,
      changePasswordButton: (this.props.changePasswordButton as Button).getContent()?.outerHTML,
      logoutButton: (this.props.logoutButton as Button).getContent()?.outerHTML,
    };
    return compiled(props);
  }
}
