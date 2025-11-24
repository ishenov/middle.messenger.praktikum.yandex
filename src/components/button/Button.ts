import Component, { Props } from "../../services/Component";

export interface ButtonProps extends Props {
  id?: string;
  class?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  text: string;
  // onClick убран, так как он не будет работать с текущим рендер-движком
}

export class Button extends Component {
  constructor(props: ButtonProps) {
    // Просто создаем тег <button> с переданными props.
    // События будут обрабатываться родительским компонентом.
    super('button', props);
  }

  render(): string {
    const { id, class: className, type, text } = this.props as ButtonProps;

    if (id) {
      this.element!.id = id;
    }
    this.element!.className = `button ${className || ''}`.trim();

    if (type) {
      (this.element! as HTMLButtonElement).type = type;
    }

    // Возвращаем только текст кнопки
    return text || '';
  }
}
