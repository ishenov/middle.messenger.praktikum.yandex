import Component from "../../services/Component";

import template from "./template";

interface ButtonProps extends Record<string, unknown> {
  id?: string;
  class?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  text: string;
  events: {
    click: any
  }

  onClick(e: Event): void;
}

export default class Button extends Component<ButtonProps> {
  constructor(props: ButtonProps) {
    super("button", {
      ...props,
      events: {
        click: (e: Event) => {
          if (props.onClick) {
            props.onClick(e);
          }
        },
      },
    });
    this.props.events = {
      click: this.props.onClick || (() => {}),
    };
  }

  render() {
    return template;
  }
}
