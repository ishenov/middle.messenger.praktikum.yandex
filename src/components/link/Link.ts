import Component from "../../services/Component";

interface LinkProps extends Record<string, unknown> {
    href: string;
    class?: string;
    'data-page'?: string;
    text: string;
    target?: '_blank' | '_self' | '_parent' | '_top';
    rel?: string;
}

const template = `<a href="{{href}}" class="{{class}}" data-page="{{data-page}}" {{#if target}}target="{{target}}"{{/if}} {{#if rel}}rel="{{rel}}"{{/if}}>{{text}}</a>`;

export default class Link extends Component {
    constructor(props: LinkProps) {
        super("div", props);
    }

    render() {
        return template;
    }
}
