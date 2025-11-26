import Handlebars from 'handlebars';
import Component from '../../services/Component';
import template from './Avatar.hbs?raw';

interface AvatarProps {
  avatarUrl?: string;
}

export default class Avatar extends Component {
  constructor(props: AvatarProps) {
    super('div', props);
    this.element?.classList.add('avatar-container');
  }

  render(): string {
    const compiled = Handlebars.compile(template);
    return compiled(this.props);
  }
}
