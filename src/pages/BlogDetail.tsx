import { useParams, Link } from "react-router-dom";
import { useBlog } from "../hooks/useBlog";
import "./BlogDetail.css";

const BlogDetail = () => {
	const { id } = useParams<{ id: string }>();
	const { blog, loading, error } = useBlog(id);

	if (loading) {
		return (
			<div className="blog-detail-container">
				<div className="blog-detail-loading">読み込み中...</div>
			</div>
		);
	}

	if (error || !blog) {
		return (
			<div className="blog-detail-container">
				<div className="blog-detail-error">
					<p>{error || "ブログが見つかりません"}</p>
					<Link to="/blog" className="back-link">
						← ブログ一覧に戻る
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="blog-detail-container">
			<div className="blog-detail-header">
				<Link to="/blog" className="back-link">
					← ブログ一覧に戻る
				</Link>
			</div>

			<article className="blog-detail-content">
				<div className="blog-detail-meta">
					<div className="blog-detail-date">{blog.date}</div>
				</div>
				<h1 className="blog-detail-title">{blog.title}</h1>
				<div
					className="blog-detail-body"
					dangerouslySetInnerHTML={{
						__html: blog.content
							.split("\n")
							.map((line) => `<p>${line}</p>`)
							.join(""),
					}}
				/>
			</article>
		</div>
	);
};

export default BlogDetail;
