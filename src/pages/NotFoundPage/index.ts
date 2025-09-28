import Handlebars from 'handlebars';
import Component from "../../services/Component";
import template from './NotFound.hbs?raw';

export default class NotFoundPage extends Component {
  constructor(props: Record<string, unknown> = {}) {
    super("div", props);
  }

  render(): string {
    const compiled = Handlebars.compile(template);
    return compiled(this.props);
  }
}
