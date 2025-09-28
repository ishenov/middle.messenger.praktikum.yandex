import './styles/main.pcss';
import './styles/chat.pcss';
import './styles/profile.pcss';
import App from './App';

document.addEventListener('DOMContentLoaded', (): void => {
    const app = new App();
    const appElement = document.getElementById('app');
    if (appElement && app.element) {
        appElement.appendChild(app.element);
        app.dispatchComponentDidMount();
    }

    // Очистка при выгрузке страницы
    window.addEventListener('beforeunload', () => {
        app.destroy();
    });
});
