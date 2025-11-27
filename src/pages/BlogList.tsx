// src/pages/BlogList.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublishedBlogs } from "../services/blogService";
import type { BlogData } from "../types/type";
import "./BlogList.css";

const BlogList = () => {
	const [blogs, setBlogs] = useState<BlogData[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadBlogs = async () => {
			try {
				const blogList = await getPublishedBlogs();
				// FirestoreBlogDataをBlogDataに変換
				const convertedBlogs: BlogData[] = blogList.map((blog) => ({
					id: blog.id || "",
					title: blog.title,
					date:
						blog.date ||
						blog.createdAt?.toDate().toISOString().split("T")[0] ||
						"",
					content: blog.content || "",
					published: blog.published ?? true,
					createdAt: blog.createdAt?.toDate().toISOString(),
					link: `/blog/${blog.id}`,
				}));
				// 日付でソート（新しい順）
				convertedBlogs.sort((a, b) => {
					const dateA = new Date(a.date || a.createdAt || "").getTime();
					const dateB = new Date(b.date || b.createdAt || "").getTime();
					return dateB - dateA;
				});
				setBlogs(convertedBlogs);
			} catch (error) {
				console.error("ブログの取得に失敗しました:", error);
				setBlogs([]);
			} finally {
				setLoading(false);
			}
		};

		loadBlogs();
	}, []);

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

