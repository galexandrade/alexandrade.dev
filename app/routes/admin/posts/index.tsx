import {
    LinksFunction,
    MetaFunction,
    ActionFunction,
    useLoaderData,
} from 'remix';
import { useActionData, json } from 'remix';
import stylesUrl from '~/styles/admin/posts.css';
import stylesPostsUrl from '~/styles/posts/index.css';
import { getPosts, Post } from '~/api/post';
import { authenticateFirebaseFromSession } from '~/api/auth';
import { logout } from '~/api/session';
import AdminLayout from '~/components/AdminLayout';
import PostList from '~/components/PostList';

export let links: LinksFunction = () => {
    return [
        { rel: 'stylesheet', href: stylesUrl },
        { rel: 'stylesheet', href: stylesPostsUrl },
    ];
};

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
    return {
        title: 'Alex P. Andrade blog posts',
        description:
            'I write about the things I learn on my day to day as a Frontend Engineer. I write about React, HTML, CSS, GraphQL, testing, and more.',
    };
};

export const loader = () => {
    return getPosts('all');
};

export default function Posts() {
    const posts = useLoaderData<Post[]>();
    return (
        <AdminLayout>
            <h1>
                Manage posts <a href="/admin/posts/new">+ Add post</a>
            </h1>
            <div className="posts">
                <PostList posts={posts} />
            </div>
        </AdminLayout>
    );
}
