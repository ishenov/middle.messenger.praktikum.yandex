import Handlebars from 'handlebars';
import Component, { Props } from '../../services/Component';
import template from './Avatar.hbs?raw';

interface AvatarProps extends Props {
  avatarUrl?: string;
}

export default class Avatar extends Component<AvatarProps> {
  constructor(props: AvatarProps) {
    super('div', props);
    this.element?.classList.add('avatar-container');
  }

  render(): string {
    const compiled = Handlebars.compile(template);
    return compiled(this.props);
  }
}
