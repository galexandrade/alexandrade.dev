import { useLoaderData } from 'remix';
import type { LoaderFunction } from 'remix';
import type { LinksFunction, MetaFunction } from 'remix';
import stylesUrl from '~/styles/posts/view-post.css';
import { getAboutContent } from '~/api/meta';

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
        description: 'About Alex P. Andrade',
    };
};

export default function About() {
    const post = useLoaderData();
    return (
        <div className="view-post">
            <div
                className="view-post__content"
                dangerouslySetInnerHTML={{ __html: post.html }}
            />
        </div>
    );
}
