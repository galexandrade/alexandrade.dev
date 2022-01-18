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

export const loader: LoaderFunction = async ({ params }) => {
    invariant(params.slug, 'expected params.slug');
    return getRawPost(params.slug);
};

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
    return {
        title: 'The Alex P. Andrade blog',
        description: 'The Alex P. Andrade blog',
    };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request, params }) => {
    try {
        await authenticateFirebaseFromSession(request);
    } catch (error) {
        return logout(request);
    }
    invariant(params.slug, 'expected params.slug');

    const form = await request.formData();
    const title = form.get('title');
    const image = form.get('image');
    const readingtime = form.get('readingtime');
    const date = form.get('date');
    const featured = form.get('featured');
    const draft = form.get('draft');
    const content = form.get('content');

    if (!title || !image || !readingtime || !featured || !date || !content) {
        return badRequest({
            formError: `Form not submitted correctly.`,
        });
    }

    const newPost = {
        title,
        image,
        readingtime,
        date,
        featured: featured === 'yes' ? true : false,
        draft: draft === 'yes' ? true : false,
        content,
    };

    await savePost(params.slug, newPost);

    return redirect('./');
};
type ActionData = {
    formError?: string;
};

export default function PostSlug() {
    const post = useLoaderData();
    const actionData = useActionData<ActionData>();
    return (
        <AdminLayout>
            <h1>Manage post</h1>
            <form method="post">
                <div>
                    <label htmlFor="title-input">Title</label>
                    <input
                        type="text"
                        id="title-input"
                        name="title"
                        defaultValue={post.title}
                    />
                </div>
                <div>
                    <label htmlFor="image-input">Cover image URL</label>
                    <input
                        type="text"
                        id="image-input"
                        name="image"
                        defaultValue={post.image}
                    />
                </div>
                <div>
                    <label htmlFor="readingtime-input">Reading time</label>
                    <input
                        type="text"
                        id="readingtime-input"
                        name="readingtime"
                        defaultValue={post.readingtime}
                    />
                </div>
                <div>
                    <label htmlFor="date-input">Publish date</label>
                    <input
                        type="text"
                        id="date-input"
                        name="date"
                        defaultValue={post.date}
                    />
                </div>
                <div>
                    <label htmlFor="featured-input">Featured</label>
                    <select
                        id="featured-input"
                        name="featured"
                        defaultValue={post.featured ? 'yes' : 'no'}
                    >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="draft-input">Draft</label>
                    <select
                        id="draft-input"
                        name="draft"
                        defaultValue={post.draft ? 'yes' : 'no'}
                    >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="content-input">Content</label>
                    <textarea
                        id="content-input"
                        name="content"
                        defaultValue={post.content}
                        rows={50}
                    />
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
