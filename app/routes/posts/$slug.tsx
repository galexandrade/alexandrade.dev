import { Link, useLoaderData } from 'remix';
import type { LoaderFunction, MetaFunction } from 'remix';
import type { LinksFunction } from 'remix';
import { getPost } from '~/api/post';
import invariant from 'tiny-invariant';
import stylesUrl from '~/styles/posts/view-post.css';
import PostAuthor from '~/components/PostAuthor';
import IconArrowLeft from '~/components/IconArrowLeft';
import SubscribeForm from '~/components/SubscribeForm';

export let links: LinksFunction = () => {
    return [{ rel: 'stylesheet', href: stylesUrl }];
};

export const loader: LoaderFunction = async ({ params }) => {
    invariant(params.slug, 'expected params.slug');
    return getPost(params.slug);
};

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = ({ data }) => {
    return {
        title: data.title,
        description: data.description,
        image: data.image,
        // Twitter Card
        'twitter:card': 'summary_large_image',
        'twitter:title': data.title,
        'twitter:description': data.description,
        'twitter:url': 'https://alexandrade.dev/posts/' + data.slug,
        'twitter:image:src': data.image,

        // Open Graph
        'og:site_name': "Alex Andrade's Blog",
        'og:title': data.title,
        'og:description': data.description,
        'og:image': data.image,
        'og:url': 'https://alexandrade.dev/posts/' + data.slug,
    };
};

export default function PostSlug() {
    const post = useLoaderData();
    return (
        <div className="view-post">
            <Link to="/posts">
                <span>
                    <IconArrowLeft />
                </span>{' '}
                Back to posts
            </Link>
            <h1>{post.title}</h1>
            <span className="view-post__date">
                {post.date} — {post.readingtime}
            </span>
            <div
                className="view-post__content"
                dangerouslySetInnerHTML={{ __html: post.html }}
            />
            <SubscribeForm />
            <PostAuthor />
        </div>
    );
}
