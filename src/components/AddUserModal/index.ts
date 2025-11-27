import Component, {Props} from "../../services/Component";
import Handlebars from "handlebars";
import template from "./AddUserModal.hbs?raw";
import ValidatedInput from "../validated-input/ValidatedInput";
import {Button} from "../button/Button";

interface AddUserModalProps extends Props {
    isOpen?: boolean;
    searchResults?: any[]; // To store search results
    onSearch?: (login: string) => void;
    onClose?: () => void;
    onAddUserToChat?: (userId: number) => void;
}

export class AddUserModal extends Component {
    constructor(props: AddUserModalProps) {
        const searchInput = new ValidatedInput({
            id: 'user-search-login',
            type: 'text',
            placeholder: 'Логин пользователя',
            fieldName: 'login',
        });
        const searchButton = new Button({
            id: 'user-search-button',
            text: 'Найти',
            type: 'submit',
          events: {
            click: event => {
              console.log(event);
            },
          },
        });
        const closeButton = new Button({
            id: 'close-add-user-modal',
            text: 'Закрыть',
            type: 'button',
            class: 'close-modal-button',
        });

        super("div", {
            ...props,
            isOpen: props.isOpen || false,
            searchResults: props.searchResults || [],
            searchInput,
            searchButton,
            closeButton,
        });
    }

    public open() {
        this.setProps({ isOpen: true });
    }

    public close() {
        this.setProps({ isOpen: false, searchResults: [] }); // Clear results on close
        if (this.props.onClose) {
            (this.props.onClose as Function)();
        }
    }

    render(): string {
      const compiled = Handlebars.compile(template);
      return compiled({
          ...this.props,
          searchInput: (this.props.searchInput as ValidatedInput).render(),
          searchButton: (this.props.searchButton as Button).render(),
          closeButton: (this.props.closeButton as Button).render(),
        });
    }
}
