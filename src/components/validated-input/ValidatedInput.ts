import Component from "../../services/Component";

interface ValidatedInputProps extends Record<string, unknown> {
    id?: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
    placeholder?: string;
    value?: string;
    class?: string;
    fieldName: string;
    required?: boolean;
    disabled?: boolean;
    errorMessage?: string;
}

const template = `<div class="input-wrapper">
  <input 
    id="{{id}}" 
    type="{{type}}" 
    placeholder="{{placeholder}}" 
    value="{{value}}" 
    class="input {{class}}"
    data-field="{{fieldName}}"
    {{#if required}}required{{/if}}
    {{#if disabled}}disabled{{/if}}
  >
  <div class="input-error" style="display: none;">{{errorMessage}}</div>
</div>`;

export default class ValidatedInput extends Component<ValidatedInputProps> {
    constructor(props: ValidatedInputProps) {
        super("div", props);
    }

    render() {
        return template;
    }
}
