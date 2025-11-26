import Component, { Props } from "../../services/Component";
import Handlebars from "handlebars";
import template from "./template";

export interface ButtonProps extends Props {
  id?: string;
  class?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  text: string;
}

export class Button extends Component {
  constructor(props: ButtonProps) {
    super('div', props);
  }

  render(): string {
    const compiled = Handlebars.compile(template);
    return compiled(this.props);
  }
}
