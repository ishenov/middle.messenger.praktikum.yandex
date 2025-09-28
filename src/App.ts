import Handlebars from 'handlebars';

import ButtonTemplate from "./components/button/template";
import FooterTemplate from "./components/footer/Footer.template.js";
import InputTemplate from "./components/input/Input.template.js";
import LinkTemplate from "./components/link/Link.template.js";
import ValidatedInputTemplate from "./components/validated-input/ValidatedInput.template.js";
import { LoginPage, RegistrationPage, ChatPage, ProfilePage, ChangePasswordPage, NotFoundPage, ServerErrorPage } from './pages/index.js';
import Component from './services/Component.js';
import { FormValidator } from './services/FormValidator.js';

// Регистрируем компоненты как частичные шаблоны
Handlebars.registerPartial('Button', ButtonTemplate);
Handlebars.registerPartial('Input', InputTemplate);
Handlebars.registerPartial('ValidatedInput', ValidatedInputTemplate);
Handlebars.registerPartial('Link', LinkTemplate);
Handlebars.registerPartial('Footer', FooterTemplate);

interface Chat {
    name: string;
    preview: string;
    unread?: number | null;
    time: string;
    selected?: boolean;
}

interface AppState { currentPage: string; isEdit: boolean; chats: Chat[]; }

export default class App extends Component {
    private state: AppState;
    private formValidators: FormValidator[] = [];

    constructor() {
        const currentPage = window.location.pathname.split('/').pop() ?? '';
        const initialState = {
            currentPage,
            isEdit: true,
            chats: [
                { name: 'Андрей', preview: 'Изображение', unread: 2, time: '10:49' },
                { name: 'Киноклуб', preview: 'Вы: стикер', unread: null, time: '12:00' },
                { name: 'Илья', preview: 'Друзья, у меня для вас особенный выпуск новостей!', unread: 4, time: '15:12' },
                { name: 'Вадим', preview: 'Вы: Круто!', selected: true, time: 'Пт' },
                { name: 'тет-а-теты', preview: 'И Human Interface Guidelines и Material Design рекомендуют…', time: 'Ср' },
                { name: '1, 2, 3', preview: 'Миллионы россиян ежедневно проводят десятки часов своe…', time: 'Пн' },
                { name: 'Design Destroyer', preview: 'В 2008 году художник Jon Rafman начал собирать…', time: 'Пн' },
                { name: 'Day.', preview: 'Так увлёкся работой по курсу, что совсем забыл его анонсир…', time: '1 Мая 2020' },
                { name: 'Стас Рогозин', preview: 'Можно или сегодня или завтра', time: '12 Апр 2020' }
            ],
        };
        super('div', initialState);
        this.state = initialState;
    }

    render(): string {
        // Return empty string since we'll handle mounting in componentDidMount
        return '';
    }

    componentDidMount(): void {
        this.mountCurrentPage();
        this.setupEventListeners();
    }

    private mountCurrentPage(): void {
        // Очищаем старые валидаторы форм
        this.formValidators.forEach(validator => validator.destroy());
        this.formValidators = [];

        let pageComponent: Component;
        switch (this.state.currentPage) {
            case 'login':
                pageComponent = new LoginPage({});
                break;
            case 'registration':
                pageComponent = new RegistrationPage({});
                break;
            case 'profile':
                pageComponent = new ProfilePage({});
                break;
            case 'chat':
                pageComponent = new ChatPage({ chats: this.state.chats });
                break;
            case 'change-password':
                pageComponent = new ChangePasswordPage({ isEdit: true });
                break;
            case '404':
                pageComponent = new NotFoundPage({});
                break;
            case '500':
                pageComponent = new ServerErrorPage({});
                break;
            default:
                pageComponent = new LoginPage({});
                break;
        }

        const appElement = document.getElementById('app');
        if (appElement && pageComponent.element) {
            appElement.innerHTML = '';
            appElement.appendChild(pageComponent.element);
            pageComponent.dispatchComponentDidMount();
        }
    }

    private setupEventListeners(): void {
        // Используем делегирование событий для footer links
        this.delegateEventListener('.footer-link', 'click', (e: Event) => {
            e.preventDefault();
            const target = e.target as HTMLElement;
            this.changePage(target.dataset.page ?? '');
        });

        // Используем делегирование событий для back button
        this.delegateEventListener('#back-button', 'click', (e: Event) => {
            e.preventDefault();
            this.changePage('chat');
        });

        // Инициализация валидации форм
        this.initializeFormValidation();
    }

    private initializeFormValidation(): void {
        // Форма авторизации
        const loginForm = document.querySelector('#login-form') as HTMLFormElement;
        if (loginForm) {
            const validator = new FormValidator(loginForm, this.handleLoginSubmit.bind(this));
            this.formValidators.push(validator);
        }

        // Форма регистрации
        const registrationForm = document.querySelector('#registration-form') as HTMLFormElement;
        if (registrationForm) {
            const validator = new FormValidator(registrationForm, this.handleRegistrationSubmit.bind(this));
            this.formValidators.push(validator);
        }

        // Форма профиля
        const profileForm = document.querySelector('#profile-form') as HTMLFormElement;
        if (profileForm) {
            const validator = new FormValidator(profileForm, this.handleProfileSubmit.bind(this));
            this.formValidators.push(validator);
        }

        // Форма смены пароля
        const changePasswordForm = document.querySelector('#change-password-form') as HTMLFormElement;
        if (changePasswordForm) {
            const validator = new FormValidator(changePasswordForm, this.handleChangePasswordSubmit.bind(this));
            this.formValidators.push(validator);
        }

        // Форма отправки сообщения
        const messageForm = document.querySelector('#message-form') as HTMLFormElement;
        if (messageForm) {
            const validator = new FormValidator(messageForm, this.handleMessageSubmit.bind(this));
            this.formValidators.push(validator);
        }
    }

    private handleLoginSubmit(formData: Record<string, string>): void {
        console.log('Login form submitted:', formData);
        // Здесь будет логика авторизации
        this.changePage('chat');
    }

    private handleRegistrationSubmit(formData: Record<string, string>): void {
        console.log('Registration form submitted:', formData);
        // Здесь будет логика регистрации
        this.changePage('chat');
    }

    private handleProfileSubmit(formData: Record<string, string>): void {
        console.log('Profile form submitted:', formData);
        // Здесь будет логика обновления профиля
    }

    private handleChangePasswordSubmit(formData: Record<string, string>): void {
        console.log('Change password form submitted:', formData);
        // Здесь будет логика смены пароля
    }

    private handleMessageSubmit(formData: Record<string, string>): void {
        console.log('Данные формы:', formData);
    }

    changePage(page: string): void {
        this.state.currentPage = page;
        this.removeAllEventListeners(); // Очищаем старые события
        this.mountCurrentPage();
        this.setupEventListeners(); // Устанавливаем события для новой страницы
    }

    destroy(): void {
        // Очищаем все валидаторы форм
        this.formValidators.forEach(validator => validator.destroy());
        this.formValidators = [];
        // Вызываем родительский destroy для очистки событий
        super.destroy();
    }
}
