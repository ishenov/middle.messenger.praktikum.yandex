import Handlebars from 'handlebars';
import Component, { Props } from "../../services/Component";
import template from './Profile.hbs?raw';
import { Button } from '../../components/button/Button';
import ValidatedInput from '../../components/validated-input/ValidatedInput';
import Input from '../../components/input/Input';
import Router from '../../services/Router';
import UserAPI from '../../api/UserAPI';
import Avatar from '../../components/Avatar';
import AuthApi from '../../api/auth';
import NotificationService from '../../services/NotificationService';

export type ProfileData = {
  first_name: string,
  second_name: string,
  display_name: string,
  login: string,
  email: string,
  phone: string,
  avatar?: string
}

interface ProfilePageProps extends Props {
  user?: ProfileData;
  isEdit?: boolean;
  emailInput?: ValidatedInput;
  loginInput?: ValidatedInput;
  firstNameInput?: ValidatedInput;
  secondNameInput?: ValidatedInput;
  displayNameInput?: Input;
  phoneInput?: ValidatedInput;
  saveButton?: Button;
  editDataButton?: Button;
  changePasswordButton?: Button;
  logoutButton?: Button;
  avatarComponent?: Avatar;
}

export default class ProfilePage extends Component<ProfilePageProps> {
  private userApi: UserAPI;
  private authApi: AuthApi;

  constructor(props: ProfilePageProps = {}) {
    const emailInput = new ValidatedInput({ id: "email", class: "profile-input", type: "email", value: props.user?.email, fieldName: "email" });
    const loginInput = new ValidatedInput({ id: "login", class: "profile-input", type: "text", value: props.user?.login, fieldName: "login" });
    const firstNameInput = new ValidatedInput({ id: "first_name", class: "profile-input", type: "text", value: props.user?.first_name, fieldName: "first_name" });
    const secondNameInput = new ValidatedInput({ id: "second_name", class: "profile-input", type: "text", value: props.user?.second_name, fieldName: "second_name" });
    const displayNameInput = new Input({ id: "display_name", class: "profile-input", type: "text", value: props.user?.display_name, name: "display_name" });
    const phoneInput = new ValidatedInput({ id: "phone", class: "profile-input", type: "number", value: props.user?.phone, fieldName: "phone" });
    const saveButton = new Button({ id: "save-button", text: "Сохранить", class: "edit-link secondary", type: "submit" });
    const editDataButton = new Button({ id: "edit-data-button", text: "Изменить данные", class: "edit-link secondary", type: "button" });
    const changePasswordButton = new Button({ id: "change-password-button", text: "Изменить пароль", class: "edit-link secondary", type: "button" });
    const logoutButton = new Button({ id: "logout-button", text: "Выйти", class: "logout-link secondary", type: "button" });
    const avatarComponent = new Avatar({ avatarUrl: props.user?.avatar });

    super("div", {
      ...props,
      isEdit: false,
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
      avatarComponent,
      events: {
        click: (e: Event) => {
          const target = e.target as HTMLElement;
          if (target.closest('.avatar-container')) {
            this.element?.querySelector<HTMLInputElement>('#avatar-input')?.click();
          }
          if (target.closest('#back-button')) this.handleBack();
          if (target.closest('#edit-data-button')) this.toggleEditMode(true);
          if (target.closest('#change-password-button')) this.handleChangePassword();
          if (target.closest('#logout-button')) this.handleLogout();
        },
        change: (e: Event) => {
          const target = e.target as HTMLInputElement;
          if (target.id === 'avatar-input') {
            this.handleAvatarChange(e);
          }
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

    this.userApi = new UserAPI();
    this.authApi = new AuthApi();
  }

  componentDidMount() {
    Object.values(this.props).forEach(prop => {
      if (prop instanceof Component) {
        prop.dispatchComponentDidMount();
      }
    });
  }

  async handleAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('avatar', file);

      try {
        const response = await this.userApi.changeAvatar(formData);
        const avatarComponent = this.props.avatarComponent as Avatar;
        avatarComponent.setProps({ avatarUrl: response.data.avatar });
      } catch (error) {
        console.error('Error uploading avatar:', error);
      }
    }
  }

  async handleSave(form: HTMLFormElement) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries()) as unknown as ProfileData;
    try {
      await this.userApi.saveProfile(data);
      this.toggleEditMode(false);
      const response = await this.authApi.me();
      this.setProps({ user: response.data as ProfileData });

    } catch (error) {
      console.error('Error saving profile data:', error);
    }
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

  async handleLogout() {
    try {
      await this.authApi.logout();
      NotificationService.show('You have been logged out', 'success');
      const router = new Router('#app');
      router.go('/sign-in');
    } catch (error) {
      const errorMessage = (error as Error).message || 'An unknown error occurred';
      NotificationService.show(errorMessage, 'error');
      console.error('Error logging out:', error);
    }
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
      avatarComponent: (this.props.avatarComponent as Avatar).getContent()?.outerHTML,
    };
    return compiled(props);
  }
}
