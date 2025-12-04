// src/pages/BlogList.tsx
import { Link } from "react-router-dom";
import { useBlogs } from "../hooks/useBlogs";
import "./BlogList.css";

const BlogList = () => {
	window.scrollTo({ top: 0, behavior: "instant" });
	const { blogs, loading } = useBlogs();

	if (loading) {
		return (
			<div className="blog-list-container">
				<div className="blog-list-loading">読み込み中...</div>
			</div>
		);
	}

	return (
		<div className="blog-list-container">
			<div className="blog-list-header">
				<h1>Blog</h1>
				<Link to="/" className="back-link">
					← ホームに戻る
				</Link>
			</div>

			{blogs.length === 0 ? (
				<div className="blog-list-empty">
					<p>ブログがありません</p>
				</div>
			) : (
				<div className="blog-list-grid">
					{blogs.map((blog) => (
						<Link
							key={blog.id}
							to={blog.link || `/blog/${blog.id}`}
							className="blog-list-card"
						>
							<div className="blog-list-date">{blog.date}</div>
							<h2 className="blog-list-title">{blog.title}</h2>
							<p className="blog-list-excerpt">
								{blog.content?.substring(0, 150) ||
									"ブログの内容がここに表示されます..."}
								{blog.content && blog.content.length > 150 && "..."}
							</p>
						</Link>
					))}
				</div>
			)}
		</div>
	);
};

export default BlogList;
