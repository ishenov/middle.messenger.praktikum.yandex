import Component from "../../services/Component";

import template from "./template";
import Handlebars from "handlebars";

interface ButtonProps extends Record<string, unknown> {
  id?: string;
  class?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  text: string;
  events: {
    click(e: Event): void;
  }
}

export default class Button extends Component<ButtonProps> {
  constructor(props: ButtonProps) {
    super("button", {
      ...props,
      events: {
        click: (e: Event) => {
            e.preventDefault()
            e.stopPropagation()
          console.log(props.onClick)
          if (props.onClick) {
            props.events.click(e);
          }
        },
      },
    });
  }

  render() {
    const compiled = Handlebars.compile(template);
    return compiled(this.props);
  }
}
