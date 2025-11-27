// src/pages/Admin/index.tsx
import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteBlog } from "../../services/blogService";
import { signOut } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";
import { useBlogs } from "../../hooks/useBlogs";
import type { BlogData } from "../../types/type";
import "./index.css";

const BlogAdmin = () => {
	const navigate = useNavigate();
	const { isAdmin, loading: authLoading } = useAuth();
	const { blogs, loading, loadBlogs } = useBlogs();
	const hasLoadedRef = useRef(false);

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
		} catch (error) {
			console.error("削除に失敗しました:", error);
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
				{blogs.length === 0 ? (
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
										<Link
											to={`/blog/${blog.id}`}
											target="_blank"
											className="btn-view"
										>
											表示
										</Link>
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
