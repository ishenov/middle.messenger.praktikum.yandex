import Handlebars from 'handlebars';
import Component from "../../services/Component";
import template from './ServerError.hbs?raw';
import { Button } from '../../components/button/Button';
import Router from '../../services/Router';

export default class ServerErrorPage extends Component {
  constructor(props: Record<string, unknown> = {}) {
    const backButton = new Button({
      id: "back-button",
      text: "Вернуться назад",
      class: "secondary",
    });

    super("div", {
      ...props,
      backButton,
      events: {
        click: (e: Event) => {
          const target = e.target as HTMLElement;
          if (target.closest('#back-button')) {
            this.handleBack();
          }
        }
      }
    });
  }

  handleBack() {
    const router = new Router('#app');
    router.back();
  }

  render(): string {
    const compiled = Handlebars.compile(template);
    return compiled({
      ...this.props,
      backButton: (this.props.backButton as Button).getContent()?.outerHTML,
    });
  }
}
