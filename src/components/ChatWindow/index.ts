import Handlebars from 'handlebars';
import Component from "../../services/Component";
import template from './ChatWindow.hbs?raw';

export class ChatWindow extends Component {
  constructor(props: Record<string, unknown> = {}) {
    super("div", {
      ...props,
    });
  }

  componentDidMount() {
    console.log('ChatWindow componentDidMount');
  }

  render(): string {
    const compiled = Handlebars.compile(template);
    return compiled({
      ...this.props,
    });
  }
}
