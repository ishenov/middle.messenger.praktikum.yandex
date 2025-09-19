import Handlebars, { HandlebarsTemplateDelegate } from 'handlebars';

import Button from "./components/button/Button";
import Footer from "./components/Footer.js";
import Input from "./components/Input.js";
import Link from "./components/Link.js";
import ValidatedInput from "./components/ValidatedInput.js";
import * as Pages from './pages/index.js';
import { FormValidator } from './services/FormValidator.js';

Handlebars.registerPartial('Button', Button);
Handlebars.registerPartial('Input', Input);
Handlebars.registerPartial('ValidatedInput', ValidatedInput);
Handlebars.registerPartial('Link', Link);
Handlebars.registerPartial('Footer', Footer);

interface Chat {
    name: string;
    preview: string;
    unread?: number | null;
    time: string;
    selected?: boolean;
}

interface AppState {
    currentPage: string;
    isEdit: boolean;
    chats: Chat[];
}

export default class App {
    private state: AppState;
    private appElement: HTMLElement | null;

    constructor() {
        const currentPage = window.location.pathname.split('/').pop() ?? '';
        this.state = {
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
        this.appElement = document.getElementById('app');
    }

    render(): void {
        if (!this.appElement) return;

        let template: HandlebarsTemplateDelegate;
        switch (this.state.currentPage) {
            case 'login':
                template = Handlebars.compile(Pages.LoginPage);
                this.appElement.innerHTML = template({});
                break;
            case 'registration':
                template = Handlebars.compile(Pages.RegistrationPage);
                this.appElement.innerHTML = template({});
                break;
            case 'profile':
                template = Handlebars.compile(Pages.ProfilePage);
                this.appElement.innerHTML = template({});
                break;
            case 'chat':
                template = Handlebars.compile(Pages.ChatPage);
                this.appElement.innerHTML = template({
                    chats: this.state.chats,
                });
                break;
            case 'change-password':
                template = Handlebars.compile(Pages.ChangePasswordPage);
                this.appElement.innerHTML = template({
                    isEdit: true,
                });
                break;
            case '404':
                template = Handlebars.compile(Pages.NotFoundPage);
                this.appElement.innerHTML = template({});
                break;
            case '500':
                template = Handlebars.compile(Pages.ServerErrorPage);
                this.appElement.innerHTML = template({});
                break;
            default:
                template = Handlebars.compile(Pages.LoginPage);
                this.appElement.innerHTML = template({});
                break;
        }
        this.attachEventListeners();
    }

    private attachEventListeners(): void {
        const footerLinks = document.querySelectorAll('.footer-link');
        const backBtn = document.getElementById('back-button');
        
        footerLinks.forEach((link: Element) => {
            link.addEventListener('click', (e: Event) => {
                e.preventDefault();
                const target = e.target as HTMLElement;
                this.changePage(target.dataset.page ?? '');
            });
        });
        
        if (backBtn) {
            backBtn.addEventListener('click', (e: Event) => {
                e.preventDefault();
                this.changePage('chat');
            });
        }

        // Инициализация валидации форм
        this.initializeFormValidation();
    }

    private initializeFormValidation(): void {
        // Форма авторизации
        const loginForm = document.querySelector('#login-form') as HTMLFormElement;
        if (loginForm) {
            new FormValidator(loginForm, this.handleLoginSubmit.bind(this));
        }

        // Форма регистрации
        const registrationForm = document.querySelector('#registration-form') as HTMLFormElement;
        if (registrationForm) {
            new FormValidator(registrationForm, this.handleRegistrationSubmit.bind(this));
        }

        // Форма профиля
        const profileForm = document.querySelector('#profile-form') as HTMLFormElement;
        if (profileForm) {
            new FormValidator(profileForm, this.handleProfileSubmit.bind(this));
        }

        // Форма смены пароля
        const changePasswordForm = document.querySelector('#change-password-form') as HTMLFormElement;
        if (changePasswordForm) {
            new FormValidator(changePasswordForm, this.handleChangePasswordSubmit.bind(this));
        }

        // Форма отправки сообщения
        const messageForm = document.querySelector('#message-form') as HTMLFormElement;
        if (messageForm) {
            new FormValidator(messageForm, this.handleMessageSubmit.bind(this));
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
        this.render();
    }
}
