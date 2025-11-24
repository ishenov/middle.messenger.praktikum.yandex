import Handlebars from 'handlebars';
import Component, { Props } from '../../services/Component';
import template from './Modal.hbs?raw';
import './modal.css';

interface ModalProps extends Props {
  isOpen?: boolean;
  title?: string;
  content?: string | Component;
  onClose?: () => void;
}

export default class Modal extends Component {
  constructor(props: ModalProps) {
    super('div', {
      ...props,
      events: {
        click: (e: Event) => {
          const target = e.target as HTMLElement;
          if (target.classList.contains('modal-overlay') || target.closest('.modal-close-btn')) {
            this.handleClose();
          }
        },
      },
    });
  }

  handleClose() {
    if (this.props.onClose) {
      (this.props.onClose as () => void)();
    } else {
      this.hide();
    }
  }

  show() {
    this.setProps({ isOpen: true });
    this.element!.style.display = 'flex';
  }

  hide() {
    this.setProps({ isOpen: false });
    this.element!.style.display = 'none';
  }

  render(): string {
    const compiled = Handlebars.compile(template);
    const content = this.props.content instanceof Component
      ? this.props.content.getContent()?.outerHTML
      : this.props.content;

    return compiled({ ...this.props, content });
  }
}
