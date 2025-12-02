import Handlebars from 'handlebars';
import Component, { Props } from '../../services/Component';
import template from './Registration.hbs?raw';
import { Button } from '../../components/button/Button';
import ValidatedInput from '../../components/validated-input/ValidatedInput';
import Router from '../../services/Router';

interface RegistrationPageProps extends Props {
  emailInput?: ValidatedInput;
  loginInput?: ValidatedInput;
  firstNameInput?: ValidatedInput;
  secondNameInput?: ValidatedInput;
  phoneInput?: ValidatedInput;
  passwordInput?: ValidatedInput;
  password2Input?: ValidatedInput;
  registrationButton?: Button;
  signinButton?: Button;
}

export default class RegistrationPage extends Component<RegistrationPageProps> {
  constructor(props: RegistrationPageProps = {}) {
    const emailInput = new ValidatedInput({ id: 'email', type: 'email', placeholder: 'Почта', fieldName: 'email' });
    const loginInput = new ValidatedInput({ id: 'login', type: 'text', placeholder: 'Логин', fieldName: 'login' });
    const firstNameInput = new ValidatedInput({ id: 'first_name', type: 'text', placeholder: 'Имя', fieldName: 'first_name' });
    const secondNameInput = new ValidatedInput({ id: 'second_name', type: 'text', placeholder: 'Фамилия', fieldName: 'second_name' });
    const phoneInput = new ValidatedInput({ id: 'phone', type: 'tel', placeholder: 'Телефон', fieldName: 'phone' });
    const passwordInput = new ValidatedInput({ id: 'password', type: 'password', placeholder: 'Пароль', fieldName: 'password' });
    const password2Input = new ValidatedInput({ id: 'password2', type: 'password', placeholder: 'Повторите пароль', fieldName: 'password_repeat' });
    const registrationButton = new Button({ id: 'registration', text: 'Зарегистрироваться', type: 'submit' });
    const signinButton = new Button({ id: 'signin', text: 'Войти', class: 'secondary', type: 'button' });

    super("div", {
      ...props,
      emailInput,
      loginInput,
      firstNameInput,
      secondNameInput,
      phoneInput,
      passwordInput,
      password2Input,
      registrationButton,
      signinButton,
      events: {
        click: (e: Event) => {
          const target = e.target as HTMLElement;
          if (target.closest('#signin')) {
            this.handleSignInClick();
          }
        },
        submit: (e: Event) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          if (form.id === 'registration-form') {
            this.handleRegistration(form);
          }
        }
      },
    });
  }

  handleRegistration(form: HTMLFormElement) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    console.log('Registration attempt:', data);
  }

  handleSignInClick() {
    const router = new Router('#app');
    router.go('/sign-in');
  }

  render(): string {
    const compiled = Handlebars.compile(template);
    return compiled({
      emailInput: (this.props.emailInput as ValidatedInput).getContent()?.outerHTML,
      loginInput: (this.props.loginInput as ValidatedInput).getContent()?.outerHTML,
      firstNameInput: (this.props.firstNameInput as ValidatedInput).getContent()?.outerHTML,
      secondNameInput: (this.props.secondNameInput as ValidatedInput).getContent()?.outerHTML,
      phoneInput: (this.props.phoneInput as ValidatedInput).getContent()?.outerHTML,
      passwordInput: (this.props.passwordInput as ValidatedInput).getContent()?.outerHTML,
      password2Input: (this.props.password2Input as ValidatedInput).getContent()?.outerHTML,
      registrationButton: (this.props.registrationButton as Button).getContent()?.outerHTML,
      signinButton: (this.props.signinButton as Button).getContent()?.outerHTML,
    });
  }
}
