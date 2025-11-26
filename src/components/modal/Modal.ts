import Handlebars from 'handlebars';
import Component from '../../services/Component';
import template from './Modal.hbs?raw';
import UserAPI from '../../api/UserAPI';
import { UserDTO } from '../../api/type';

interface AddUserModalProps {
  chatId: number;
}

export default class AddUserModal extends Component {
  private userApi: UserAPI;

  constructor(props: AddUserModalProps) {
    super('div', {
      ...props,
      users: [],
      events: {
        'input #user-search-input': (e: Event) => this.searchUsers((e.target as HTMLInputElement).value),
        'click #close-modal-button': () => this.hide(),
        'click #user-search-results li': (e: Event) => this.addUserToChat(Number((e.currentTarget as HTMLLIElement).dataset.userId))
      }
    });
    this.userApi = new UserAPI();
    this.element?.classList.add('modal-overlay');
  }

  show() {
    this.element?.classList.add('visible');
  }

  hide() {
    this.element?.classList.remove('visible');
  }

  async searchUsers(login: string) {
    if (login.length > 2) {
      try {
        const response = await this.userApi.searchUser({ login });
        this.setProps({ users: response.data });
      } catch (error) {
        console.error('Error searching users:', error);
      }
    }
  }

  addUserToChat(userId: number) {
    this.eventBus().emit('addUserToChat', { userId, chatId: this.props.chatId });
    this.hide();
  }

  render(): string {
    const compiled = Handlebars.compile(template);
    const props = {
      ...this.props,
      users: (this.props.users as UserDTO[]).map(user => `
        <li data-user-id="${user.id}">${user.login}</li>
      `).join('')
    };
    return compiled(props);
  }
}
