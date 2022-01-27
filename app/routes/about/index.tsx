import { useLoaderData } from 'remix';
import type { LoaderFunction } from 'remix';
import type { LinksFunction, MetaFunction } from 'remix';
import stylesUrl from '~/styles/posts/view-post.css';
import { getAboutContent } from '~/api/profile';

export let links: LinksFunction = () => {
    return [{ rel: 'stylesheet', href: stylesUrl }];
};

export const loader: LoaderFunction = async () => {
    return getAboutContent();
};

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
    return {
        title: 'About Alex P. Andrade',
        description:
            'I write about the things I learn on my day to day as a Frontend Engineer. I write about React, HTML, CSS, GraphQL, testing, and more.',
    };
};

export default function About() {
    const about = useLoaderData();
    return (
        <div className="view-post">
            <div
                className="view-post__content"
                dangerouslySetInnerHTML={{ __html: about.html }}
            />
        </div>
    );
}
