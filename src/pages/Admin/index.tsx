// src/pages/Admin/index.tsx
import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteBlog } from "../../services/blogService";
import { signOut } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";
import { getAllBlogs, convertToBlogData } from "../../services/blogService";

import type { BlogData } from "../../types/type";
import "./index.css";

const BlogAdmin = () => {
	const navigate = useNavigate();
	const { isAdmin, loading: authLoading } = useAuth();
	const hasLoadedRef = useRef(false);

	const [blogs, setBlogs] = useState<BlogData[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadBlogs = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const blogList = await getAllBlogs();
			// FirestoreBlogDataをBlogDataに変換
			const convertedBlogs: BlogData[] = blogList.map(convertToBlogData);
			setBlogs(convertedBlogs);
		} catch (err) {
			// ← error を err に変更（変数名の衝突を回避）
			const errorMessage =
				err instanceof Error ? err.message : "ブログの取得に失敗しました";
			setError(errorMessage);
			console.error("ブログの取得に失敗しました:", err);
		} finally {
			setLoading(false);
		}
	}, []);

	// 認証チェックとデータ読み込み（初回のみ）
	useEffect(() => {
		if (authLoading) return;

		if (!isAdmin) {
			navigate("/login");
			return;
		}

		// 初回のみデータを読み込む（loadingはuseEffect内で直接参照）
		if (!hasLoadedRef.current) {
			hasLoadedRef.current = true;
			loadBlogs();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authLoading, isAdmin]);

	const handleDelete = async (blogId: string | number, title: string) => {
		if (!confirm(`「${title}」を削除してもよろしいですか？`)) {
			return;
		}

		try {
			await deleteBlog(String(blogId));
			alert("削除しました");
			// 再読み込み（hasLoadedRefはリセットしない）
			loadBlogs();
		} catch (err) {
			// ← error を err に変更
			console.error("削除に失敗しました:", err);
			alert("削除に失敗しました");
		}
	};

	const handleLogout = async () => {
		const { error } = await signOut();
		if (error) {
			alert("ログアウトに失敗しました");
		} else {
			navigate("/login");
		}
	};

	if (authLoading || loading) {
		return <div className="admin-loading">読み込み中...</div>;
	}

	if (!isAdmin) {
		return null; // リダイレクト中
	}

	return (
		<div className="admin-container">
			<div className="admin-header">
				<h1>ブログ管理</h1>
				<div className="admin-actions">
					<Link to="/admin/create" className="btn-create">
						新規投稿
					</Link>
					<button onClick={handleLogout} className="btn-logout">
						ログアウト
					</button>
				</div>
			</div>

			<div className="admin-content">
				{error ? (
					<div className="admin-error">
						<p>エラー: {error}</p>
						<button onClick={loadBlogs} className="btn-retry">
							再試行
						</button>
					</div>
				) : blogs.length === 0 ? (
					<div className="empty-state">
						<p>ブログがありません</p>
						<Link to="/admin/create" className="btn-create">
							最初のブログを投稿する
						</Link>
					</div>
				) : (
					<table className="blog-table">
						<thead>
							<tr>
								<th>タイトル</th>
								<th>日付</th>
								<th>スラッグ</th>
								<th>操作</th>
							</tr>
						</thead>
						<tbody>
							{blogs.map((blog: BlogData) => (
								<tr key={blog.id}>
									<td>{blog.title}</td>
									<td>{blog.date}</td>
									<td>{blog.id}</td>
									<td className="table-actions">
										<Link to={`/admin/edit/${blog.id}`} className="btn-edit">
											編集
										</Link>
										<button
											onClick={() => handleDelete(blog.id, blog.title)}
											className="btn-delete"
										>
											削除
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
};

export default BlogAdmin;
