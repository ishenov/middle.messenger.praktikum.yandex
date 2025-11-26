import Notification from '../components/notification';

class NotificationService {
  private container: HTMLElement | null = null;

  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'notification-container';
    document.body.appendChild(this.container);
  }

  show(message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 3000) {
    const notification = new Notification({ message, type });
    const notificationElement = notification.getContent();

    if (notificationElement) {
      this.container?.appendChild(notificationElement);

      setTimeout(() => {
        notificationElement.remove();
      }, duration);
    }
  }
}

export default new NotificationService();
