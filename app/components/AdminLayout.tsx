const AdminLayout: React.FC = ({ children }) => (
    <div className="admin">
        <nav>
            <ul>
                <li>
                    <a href="/admin/posts">Posts</a>
                </li>
                <li>
                    <a href="/admin/profile">Profile</a>
                </li>
            </ul>
            <ul>
                <li>
                    <form action="/admin/logout" method="post">
                        <button
                            type="submit"
                            className="logout-link"
                            role="link"
                        >
                            Logout
                        </button>
                    </form>
                </li>
            </ul>
        </nav>
        <main>{children}</main>
    </div>
);

export default AdminLayout;
