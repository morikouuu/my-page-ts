// src/pages/BlogDetail.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBlogById } from "../services/blogService";
import type { BlogData } from "../types/type";
import "./BlogDetail.css";

const BlogDetail = () => {
	const { id } = useParams<{ id: string }>();
	const [blog, setBlog] = useState<BlogData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!id) {
			setError("ブログIDが指定されていません");
			setLoading(false);
			return;
		}

		const loadBlog = async () => {
			try {
				const blogData = await getBlogById(id);
				if (!blogData) {
					setError("ブログが見つかりません");
					return;
				}

				// 公開されていないブログは一般ユーザーには表示しない
				if (blogData.published === false) {
					setError("このブログは公開されていません");
					return;
				}

				// FirestoreBlogDataをBlogDataに変換
				const convertedBlog: BlogData = {
					id: blogData.id || "",
					title: blogData.title,
					date:
						blogData.date ||
						blogData.createdAt?.toDate().toISOString().split("T")[0] ||
						"",
					content: blogData.content || "",
					published: blogData.published ?? true,
					createdAt: blogData.createdAt?.toDate().toISOString(),
					link: `/blog/${blogData.id}`,
				};

				setBlog(convertedBlog);
			} catch (error) {
				console.error("ブログの取得に失敗しました:", error);
				setError("ブログの取得に失敗しました");
			} finally {
				setLoading(false);
			}
		};

		loadBlog();
	}, [id]);

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

