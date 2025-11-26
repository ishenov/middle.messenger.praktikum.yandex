import { LoginPage, RegistrationPage, ChatPage, ProfilePage, ChangePasswordPage, NotFoundPage, ServerErrorPage } from './pages/index.js';
import Component from './services/Component.js';
import { FormValidator } from './services/FormValidator.js';
import Router from "./services/Router";
import HTTPTransport from "./services/HTTPTransport";
import { registerHelpers } from './services/helpers.js';

export default class App extends Component {
    private state: any;
    private formValidators: FormValidator[] = [];
    private api: HTTPTransport;
    private router: Router;
    public user: unknown;

    constructor() {
        const currentPage = window.location.pathname.split('/').pop() ?? '';
        const initialState = {
            currentPage
        };
        super('div', initialState);
        this.state = initialState;

      this.router = new Router("#app");
      this.api = new HTTPTransport();

      registerHelpers(); // Register Handlebars helpers
    }

    render(): string {
        return '';
    }

    async componentDidMount() {
      try {
        const response = await this.api.get('/auth/user');
        this.user = response.data;
      } catch (error) {
        // User is not authenticated, redirect to login
        this.router.go('/sign-in');
        return;
      }


      this.router
        .use("/", () => new ChatPage({ user: this.user }))
        .use("/sign-in", LoginPage)
        .use("/sign-up", RegistrationPage)
        .use("/settings", () => new ProfilePage({ user: this.user }))
        .use("/messenger", () => new ChatPage({ user: this.user }))
        .use("/change-password", ChangePasswordPage)
        .use("/404", NotFoundPage)
        .use("/500", ServerErrorPage)
        .start();

      this.initializeFormValidation();
    }

    private initializeFormValidation(): void {
        const loginForm = document.querySelector('#login-form') as HTMLFormElement;
        if (loginForm) {
            const validator = new FormValidator(loginForm, this.handleLoginSubmit.bind(this));
            this.formValidators.push(validator);
        }

        const registrationForm = document.querySelector('#registration-form') as HTMLFormElement;
        if (registrationForm) {
            const validator = new FormValidator(registrationForm, this.handleRegistrationSubmit.bind(this));
            this.formValidators.push(validator);
        }

        const profileForm = document.querySelector('#profile-form') as HTMLFormElement;
        if (profileForm) {
            const validator = new FormValidator(profileForm, this.handleProfileSubmit.bind(this));
            this.formValidators.push(validator);
        }

        const changePasswordForm = document.querySelector('#change-password-form') as HTMLFormElement;
        if (changePasswordForm) {
            const validator = new FormValidator(changePasswordForm, this.handleChangePasswordSubmit.bind(this));
            this.formValidators.push(validator);
        }

        const messageForm = document.querySelector('#message-form') as HTMLFormElement;
        if (messageForm) {
            const validator = new FormValidator(messageForm, this.handleMessageSubmit.bind(this));
            this.formValidators.push(validator);
        }
    }

    private async handleLoginSubmit(formData: Record<string, string>) {
      console.log('Login form submitted:', formData);
      const response = await this.api.post('/auth/signin', formData);

      if (response.status === 200) {
        window.location.href = '/messenger';
      }
    }

    private async handleRegistrationSubmit(formData: Record<string, string>) {
      console.log('Registration form submitted:', formData);
      const response = await this.api.post('/auth/signup', formData);

      if (response.status === 200) {
        this.router.go('/messenger');
      }
    }

    private handleProfileSubmit(formData: Record<string, string>): void {
        console.log('Profile form submitted:', formData);
    }

    private handleChangePasswordSubmit(formData: Record<string, string>): void {
        console.log('Change password form submitted:', formData);
    }

    private handleMessageSubmit(formData: Record<string, string>): void {
        console.log('Данные формы:', formData);
    }

    changePage(page: string): void {
        this.state.currentPage = page;
        this.removeAllEventListeners();
    }

    destroy(): void {
        this.formValidators.forEach(validator => validator.destroy());
        this.formValidators = [];
        super.destroy();
    }
}
