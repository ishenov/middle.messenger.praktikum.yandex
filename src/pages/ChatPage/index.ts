import Handlebars from 'handlebars';
import Component from "../../services/Component";
import template from './Chat.hbs?raw';
import HTTPTransport from "../../services/HTTPTransport";
// import Router from "../../services/Router";

export default class ChatPage extends Component {
  private api: HTTPTransport;
  // private router: Router;

  constructor(props: Record<string, unknown> = {}) {
    super("div", props);
    this.api = new HTTPTransport();

  }

  componentDidMount() {
    this.api.get('/chats').then(response => {
      console.log(response)
    })
  }

  render(): string {
    const compiled = Handlebars.compile(template);
    return compiled(this.props);
  }
}
