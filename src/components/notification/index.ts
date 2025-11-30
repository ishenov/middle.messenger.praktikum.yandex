import Handlebars from 'handlebars';
import Component from '../../services/Component';
import template from './Notification.hbs?raw';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
}

export default class Notification extends Component {
  constructor(props: NotificationProps) {
    super('div', props);
  }

  render(): string {
    const compiled = Handlebars.compile(template);
    return compiled(this.props);
  }
}
