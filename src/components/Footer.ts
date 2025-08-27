export default `<footer class="footer">
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
