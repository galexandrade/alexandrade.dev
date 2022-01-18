import { Link } from 'remix';
import { Post } from '~/api/post';

type Props = {
    post: Post;
};
export default function PostCard({ post }: Props) {
    return (
        <div className="posts__card">
            <Link to={`./${post.slug}`}>
                <div className="posts__card-image">
                    <div className="card-status">
                        {post.draft && <span className="draft">Draft</span>}
                        {post.featured && (
                            <span className="featured">Featured</span>
                        )}
                    </div>
                    <img src={post.image} alt="specificity rules" />
                </div>
                <div className="posts__card-info">
                    <span>
                        {post.date} — {post.readingtime}
                    </span>
                    <h3>{post.title}</h3>
                </div>
            </Link>
        </div>
    );
}
