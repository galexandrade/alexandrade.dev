import type { Post } from '~/post';
import PostCard from './PostCard';

type Props = {
    posts: Post[];
};
export default function PostList({ posts }: Props) {
    return (
        <div className="posts__cards">
            {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
            ))}
        </div>
    );
}
