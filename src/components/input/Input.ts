import Component from "../../services/Component";

interface InputProps extends Record<string, unknown> {
    id?: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
    placeholder?: string;
    value?: string;
    class?: string;
    name?: string;
    required?: boolean;
    disabled?: boolean;
}

const template = `<input id="{{id}}" type="{{type}}" placeholder="{{placeholder}}" value="{{value}}" class="input {{class}}" name="{{name}}" {{#if required}}required{{/if}} {{#if disabled}}disabled{{/if}}>`;

export default class Input extends Component<InputProps> {
    constructor(props: InputProps) {
        super("input", props);
    }

    render() {
        return template;
    }
}
