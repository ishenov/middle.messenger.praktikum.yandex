import './styles/main.pcss';
import './styles/chat.pcss';
import App from './App.js';

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.render();
});