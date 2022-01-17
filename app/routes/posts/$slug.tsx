import { Link, useLoaderData } from "remix";
import type { LoaderFunction, MetaFunction } from "remix";
import type { LinksFunction } from "remix";
import { getPost } from "~/post";
import invariant from "tiny-invariant";
import stylesUrl from "~/styles/posts/view-post.css";
import PostAuthor from "~/components/PostAuthor";
import IconArrowLeft from "~/components/IconArrowLeft";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, "expected params.slug");
  return getPost(params.slug);
};

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
  return {
    title: "The Alex P. Andrade blog",
    description: "The Alex P. Andrade blog",
  };
};

export default function PostSlug() {
  const post = useLoaderData();
  return (
    <div className="view-post">
      <Link to="/posts">
        <span>
          <IconArrowLeft />
        </span>{" "}
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
      <PostAuthor />
    </div>
  );
}
