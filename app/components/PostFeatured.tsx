import { Link } from 'remix';
import type { Post } from '~/post';

type Props = {
    post: Post;
    from: 'index' | 'posts';
};
export default function PostFeatured({ post, from }: Props) {
    let linkTo = from === 'index' ? 'posts/' + post.slug : post.slug;
    return (
        <Link to={linkTo}>
            <div className="posts__featured">
                <div className="posts__featured-info">
                    <h2>Featured article</h2>
                    <h3>{post.title}</h3>
                    <span>
                        {post.date} — {post.readingtime}
                    </span>
                </div>
                <div className="posts__featured-image">
                    <img src={post.image} alt={post.title} />
                </div>
            </div>
        </Link>
    );
}
