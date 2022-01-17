import { useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import type { LinksFunction, MetaFunction } from "remix";
import { getPost } from "~/post";
import stylesUrl from "~/styles/posts/view-post.css";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const loader: LoaderFunction = async () => {
  return getPost("about");
};

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
  return {
    title: "About Alex P. Andrade",
    description: "About Alex P. Andrade",
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
