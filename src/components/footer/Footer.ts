import Component from "../../services/Component";

interface FooterProps extends Record<string, unknown> {
    class?: string;
}

const template = `<footer class="footer {{class}}">
    <nav>
        <ul>
            <li>
                {{> Link href="#" class="footer-link" data-page="login" text="Login"}}
            </li>
            <li>
                {{> Link href="#" class="footer-link" data-page="registration" text="Registration"}}
            </li>
            <li>
                {{> Link href="#" class="footer-link" data-page="chat" text="Chat"}}
            </li>
            <li>
                {{> Link href="#" class="footer-link" data-page="profile" text="Profile"}}
            </li>
            <li>
                {{> Link href="#" class="footer-link" data-page="change-password" text="Change Password"}}
            </li>
        </ul>
    </nav>
</footer>`;

export default class Footer extends Component<FooterProps> {
    constructor(props: FooterProps = {}) {
        super("footer", props);
    }

    render() {
        return template;
    }
}
