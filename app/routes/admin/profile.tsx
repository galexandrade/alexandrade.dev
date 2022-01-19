import {
    LinksFunction,
    MetaFunction,
    ActionFunction,
    useLoaderData,
    LoaderFunction,
    redirect,
} from 'remix';
import { useActionData, json } from 'remix';
import stylesUrl from '~/styles/admin/posts.css';
import stylesProfileUrl from '~/styles/admin/profile.css';
import { authenticateFirebaseFromSession } from '~/api/auth';
import { logout } from '~/api/session';
import AdminLayout from '~/components/AdminLayout';
import { getAboutContent, saveAbout } from '~/api/profile';

export let links: LinksFunction = () => {
    return [
        { rel: 'stylesheet', href: stylesUrl },
        { rel: 'stylesheet', href: stylesProfileUrl },
    ];
};

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
    return {
        title: 'About Alex P. Andrade',
        description: 'About Alex P. Andrade',
    };
};

export const loader: LoaderFunction = async () => {
    return getAboutContent();
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
    try {
        await authenticateFirebaseFromSession(request);
    } catch (error) {
        return logout(request);
    }

    const form = await request.formData();
    const about = form.get('about');

    if (!about) {
        return badRequest({
            formError: `Form not submitted correctly.`,
        });
    }

    await saveAbout({ content: about });
    return redirect('/admin/profile');
};
type ActionData = {
    formError?: string;
};

export default function Profile() {
    const about = useLoaderData();
    const actionData = useActionData<ActionData>();
    return (
        <AdminLayout>
            <h1>Manage Profile</h1>
            <form method="post">
                <div>
                    <label htmlFor="about-input">About</label>
                    <textarea
                        id="about-input"
                        name="about"
                        defaultValue={about.raw}
                        rows={50}
                    />
                </div>
                <div>
                    <button className="save-button">Save</button>
                    <a href="/admin/posts" className="cancel-button">
                        Cancel
                    </a>
                </div>
            </form>
        </AdminLayout>
    );
}
