import './styles/main.pcss';
import './styles/chat.pcss';
import './styles/profile.pcss';
import App from './App';

document.addEventListener('DOMContentLoaded', (): void => {
    const app = new App();
    app.render();
});
