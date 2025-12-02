import Component, {Props} from "../../services/Component";
import Handlebars from "handlebars";
import template from "./AddUserModal.hbs?raw";
import ValidatedInput from "../validated-input/ValidatedInput";
import {Button} from "../button/Button";

interface User {
    id: number;
    first_name: string;
    second_name: string;
    display_name: string | null;
    login: string;
    avatar: string | null;
}

interface AddUserModalProps extends Props {
    isOpen?: boolean;
    searchResults?: User[]; // To store search results
    currentChatUsers?: User[]; // To store users already in the chat
    onSearch?: (login: string) => void;
    onClose?: () => void;
    onAddUserToChat?: (userId: number) => void;
    searchInput?: ValidatedInput;
    searchButton?: Button;
    closeButton?: Button;
}

export class AddUserModal extends Component<AddUserModalProps> {
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
            currentChatUsers: props.currentChatUsers || [], // Initialize new prop
            searchInput,
            searchButton,
            closeButton,
        });
    }

    public open() {
        // Clear search results when opening, but keep current chat users
        this.setProps({ isOpen: true, searchResults: [] });
    }

    public close() {
        // Clear both when closing
        this.setProps({ isOpen: false, searchResults: [], currentChatUsers: [] });
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
