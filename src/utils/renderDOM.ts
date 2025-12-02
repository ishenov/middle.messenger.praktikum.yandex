import Component, { Props } from "../services/Component";

export function render<P extends Props>(query: string, block: Component<P>) {
    const root = document.querySelector(query);

    const content = block.getContent();
    if (content) {
        root?.appendChild(content);
    }


    block.dispatchComponentDidMount();

    return root;
}
