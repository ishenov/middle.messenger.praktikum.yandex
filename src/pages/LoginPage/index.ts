import Handlebars from 'handlebars';
import Component, { Props } from '../../services/Component';
import template from './Login.hbs?raw';
import { Button } from '../../components/button/Button';
import ValidatedInput from '../../components/validated-input/ValidatedInput';
import Router from '../../services/Router';

interface LoginPageProps extends Props {
  loginInput?: ValidatedInput;
  passwordInput?: ValidatedInput;
  signinButton?: Button;
  signupButton?: Button;
}

export default class LoginPage extends Component<LoginPageProps> {
  constructor(props: LoginPageProps = {}) {
    const loginInput = new ValidatedInput({ id: 'login', type: 'text', placeholder: 'Логин', fieldName: 'login' });
    const passwordInput = new ValidatedInput({ id: 'password', type: 'password', placeholder: 'Пароль', fieldName: 'password' });
    const signinButton = new Button({ id: 'signin', text: 'Авторизоваться', type: 'submit' });
    const signupButton = new Button({ id: 'signup', text: 'Зарегистрироваться', class: 'secondary', type: 'button' });

    super("div", {
      ...props,
      loginInput,
      passwordInput,
      signinButton,
      signupButton,
      events: {
        click: (e: Event) => {
          const target = e.target as HTMLElement;
          if (target.closest('#signup')) {
            this.handleRegistrationClick();
          }
        },
        submit: (e: Event) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          if (form.id === 'login-form') {
            this.handleLogin(form);
          }
        }
      },
    });
  }

  handleLogin(form: HTMLFormElement) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    console.log('Login attempt:', data);
  }

  handleRegistrationClick() {
    const router = new Router('#app');
    router.go('/sign-up');
  }

  render(): string {
    const compiled = Handlebars.compile(template);
    return compiled({
      loginInput: (this.props.loginInput as ValidatedInput).getContent()?.outerHTML,
      passwordInput: (this.props.passwordInput as ValidatedInput).getContent()?.outerHTML,
      signinButton: (this.props.signinButton as Button).getContent()?.outerHTML,
      signupButton: (this.props.signupButton as Button).getContent()?.outerHTML,
    });
  }
}
