import { useLoaderData } from 'remix';
import type { LinksFunction, MetaFunction } from 'remix';
import { getPosts } from '~/api/post';
import type { Post } from '~/api/post';
import stylesUrl from '~/styles/posts/index.css';
import PostList from '~/components/PostList';
import PostFeatured from '~/components/PostFeatured';

export let links: LinksFunction = () => {
    return [{ rel: 'stylesheet', href: stylesUrl }];
};

export const loader = () => {
    return getPosts();
};

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
    return {
        title: 'The Alex P. Andrade blog',
        description:
            'I write about the things I learn on my day to day as a Frontend Engineer. I write about React, HTML, CSS, GraphQL, testing, and more.',
    };
};

export default function Posts() {
    const posts = useLoaderData<Post[]>();
    const featured = posts.find((post) => post.featured);

    const filteredPosts = posts.filter(
        (post) => !post.featured && post.slug !== 'about'
    );

    return (
        <div className="posts">
            {featured && <PostFeatured post={featured} from="posts" />}
            <PostList posts={filteredPosts} />
        </div>
    );
}
