import Component, { Props } from "../../services/Component";
import Handlebars from "handlebars";

interface InputProps extends Props {
    id?: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
    placeholder?: string;
    value?: string;
    class?: string;
    name?: string;
    required?: boolean;
    disabled?: boolean;
}

const template = `<input
  id="{{id}}"
  type="{{type}}"
  placeholder="{{placeholder}}"
  {{#if value}}value="{{value}}"{{/if}}
  class="input {{class}}"
  name="{{name}}"
  {{#if required}}required{{/if}}
  {{#if disabled}}disabled{{/if}}
>`;

export default class Input extends Component<InputProps> {
    constructor(props: InputProps) {
        // The 'div' tag is a placeholder, as it will be replaced by the template.
        super("div", props);
    }

    render(): string {
        const compiled = Handlebars.compile(template);
        return compiled(this.props);
    }
}
