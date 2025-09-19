import Component from "../../services/Component";

import template from "./template";

interface ButtonProps extends Record<string, unknown> {
    id?: string;
    class?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    text: string;
}

export default class Button extends Component<ButtonProps> {
    constructor(props: ButtonProps) {
        // Создаём враппер DOM-элемент button
        super("button", props);
    }

    render() {
        return template;
    }
}
