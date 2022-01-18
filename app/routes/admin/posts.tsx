import type { LinksFunction, MetaFunction, ActionFunction } from 'remix';
import { useActionData, json } from 'remix';
import stylesUrl from '~/styles/admin/index.css';
import { createPost } from '~/api/post';
import { authenticateFirebaseFromSession } from '~/api/auth';
import { logout } from '~/api/session';

export let links: LinksFunction = () => {
    return [{ rel: 'stylesheet', href: stylesUrl }];
};

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
    return {
        title: 'About Alex P. Andrade',
        description: 'About Alex P. Andrade',
    };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
    try {
        await authenticateFirebaseFromSession(request);
    } catch (error) {
        return logout(request);
    }

    createPost();
    return badRequest({
        formError: `Form not submitted correctly.`,
    });
};
type ActionData = {
    formError?: string;
};

export default function Posts() {
    useActionData<ActionData>();
    return (
        <div className="admin">
            This will be the admin
            <form method="post">
                <button type="submit">Create post</button>
            </form>
            <form action="/admin/logout" method="post">
                <button type="submit" className="button">
                    Logout
                </button>
            </form>
        </div>
    );
}
