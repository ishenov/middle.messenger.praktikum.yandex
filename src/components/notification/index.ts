import Handlebars from 'handlebars';
import Component, { Props } from '../../services/Component';
import template from './Notification.hbs?raw';

interface NotificationProps extends Props {
  message: string;
  type: 'success' | 'error' | 'info';
}

export default class Notification extends Component<NotificationProps> {
  constructor(props: NotificationProps) {
    super('div', props);
  }

  render(): string {
    const compiled = Handlebars.compile(template);
    return compiled(this.props);
  }
}
