import Handlebars from 'handlebars';
import * as Pages from './pages';
import './helpers/handlebarsHelper.js';

import Button from "./components/Button.js";
import Input from "./components/Input.js";
import Link from "./components/Link.js";
import Footer from "./components/Footer.js";

Handlebars.registerPartial('Button', Button);
Handlebars.registerPartial('Input', Input);
Handlebars.registerPartial('Link', Link);
Handlebars.registerPartial('Footer', Footer);

export default class App {
    constructor() {
        const currentPage = window.location.pathname.split('/').pop();
        this.state = {
            currentPage: currentPage,
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

    render() {
        let template;
        switch (this.state.currentPage) {
            case 'login':
                template = Handlebars.compile(Pages.LoginPage);
                this.appElement.innerHTML = template();
                break;
            case 'registration':
                template = Handlebars.compile(Pages.RegistrationPage);
                this.appElement.innerHTML = template();
                break;
            case 'profile':
                template = Handlebars.compile(Pages.ProfilePage);
                this.appElement.innerHTML = template();
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
                this.appElement.innerHTML = template();
                break;
            case '500':
                template = Handlebars.compile(Pages.ServerErrorPage);
                this.appElement.innerHTML = template();
                break;
            default:
                template = Handlebars.compile(Pages.LoginPage);
                this.appElement.innerHTML = template();
                break;
        }
        this.attachEventListeners();
    }

    attachEventListeners() {
        const footerLinks = document.querySelectorAll('.footer-link');
        const backBtn = document.getElementById('back-button');
        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.changePage(e.target.dataset.page);
            });
        });
        backBtn && backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.changePage('chat');
        })
    }

    changePage(page) {
        this.state.currentPage = page;
        this.render();
    }
}
