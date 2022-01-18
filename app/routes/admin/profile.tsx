import type { LinksFunction, MetaFunction, ActionFunction } from 'remix';
import { useActionData, json } from 'remix';
import stylesUrl from '~/styles/admin/posts.css';
import { authenticateFirebaseFromSession } from '~/api/auth';
import { logout } from '~/api/session';
import AdminLayout from '~/components/AdminLayout';

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

    return badRequest({
        formError: `Form not submitted correctly.`,
    });
};
type ActionData = {
    formError?: string;
};

export default function Profile() {
    useActionData<ActionData>();
    return (
        <AdminLayout>
            <h1>Profile</h1>
        </AdminLayout>
    );
}
