import Handlebars from 'handlebars';
import Component, { Props } from "../../services/Component";
import template from "./ValidatedInput.template";

interface ValidatedInputProps extends Props {
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

export default class ValidatedInput extends Component {
    constructor(props: ValidatedInputProps) {
        super("div", props);
    }

    render() {
        const compiled = Handlebars.compile(template);
        return compiled(this.props);
    }
}
