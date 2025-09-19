import Component from "../../services/Component";

import template from "./template";

export default class Button extends Component {
    constructor(props: any) {
        // Создаём враппер DOM-элемент button
        super("button", props);
    }

    render() {
        return template;
    }
}
