import { ActionFunction, Link, redirect, useLoaderData } from 'remix';
import type { LoaderFunction, MetaFunction } from 'remix';
import { useActionData, json } from 'remix';
import type { LinksFunction } from 'remix';
import { savePost, getPost, getRawPost } from '~/api/post';
import invariant from 'tiny-invariant';
import AdminLayout from '~/components/AdminLayout';
import stylesUrl from '~/styles/admin/posts.css';
import stylesPostFormUrl from '~/styles/admin/post-form.css';
import { authenticateFirebaseFromSession } from '~/api/auth';
import { logout } from '~/api/session';

export let links: LinksFunction = () => {
    return [
        { rel: 'stylesheet', href: stylesUrl },
        { rel: 'stylesheet', href: stylesPostFormUrl },
    ];
};

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
    return {
        title: 'The Alex P. Andrade blog',
        description: 'The Alex P. Andrade blog',
    };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
    try {
        await authenticateFirebaseFromSession(request);
    } catch (error) {
        return logout(request);
    }

    const form = await request.formData();
    const title = form.get('title');
    const description = form.get('description');
    const path = form.get('path');
    const image = form.get('image');
    const readingtime = form.get('readingtime');
    const date = form.get('date');
    const featured = form.get('featured');
    const content = form.get('content');

    if (
        !path ||
        !title ||
        !description ||
        !image ||
        !readingtime ||
        !featured ||
        !date ||
        !content
    ) {
        return badRequest({
            formError: `Form not submitted correctly.`,
        });
    }

    const newPost = {
        title,
        description,
        image,
        readingtime,
        date,
        featured: featured === 'yes' ? true : false,
        content,
        draft: true,
    };

    // @ts-ignore fdadsa
    await savePost(path, newPost);

    return redirect('./');
};
type ActionData = {
    formError?: string;
};

export default function PostSlug() {
    const actionData = useActionData<ActionData>();
    return (
        <AdminLayout>
            <h1>Manage post</h1>
            <form method="post">
                <div>
                    <label htmlFor="title-input">Title</label>
                    <input type="text" id="title-input" name="title" />
                </div>
                <div>
                    <label htmlFor="description-input">Description</label>
                    <input
                        type="text"
                        id="description-input"
                        name="description"
                    />
                </div>
                <div>
                    <label htmlFor="path-input">Path</label>
                    <input type="text" id="path-input" name="path" />
                </div>
                <div>
                    <label htmlFor="image-input">Cover image URL</label>
                    <input type="text" id="image-input" name="image" />
                </div>
                <div>
                    <label htmlFor="readingtime-input">Reading time</label>
                    <input
                        type="text"
                        id="readingtime-input"
                        name="readingtime"
                    />
                </div>
                <div>
                    <label htmlFor="date-input">Publish date</label>
                    <input type="text" id="date-input" name="date" />
                </div>
                <div>
                    <label htmlFor="featured-input">Featured</label>
                    <select
                        id="featured-input"
                        name="featured"
                        defaultValue={'no'}
                    >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="content-input">Content</label>
                    <textarea id="content-input" name="content" rows={50} />
                </div>
                <div>
                    <button className="save-button">Save</button>
                    <a href="./" className="cancel-button">
                        Cancel
                    </a>
                </div>
            </form>
        </AdminLayout>
    );
}
