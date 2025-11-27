// src/pages/Admin/Edit.tsx
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { updateBlog, getBlogById } from "../../services/blogService";
import { useAuth } from "../../hooks/useAuth";
import "./Edit.css";

type BlogFormData = {
	title: string;
	content: string;
	date: string;
};

const EditBlog = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { isAdmin, loading: authLoading } = useAuth();
	const {
		control,
		handleSubmit,
		formState: { isValid },
		reset,
	} = useForm<BlogFormData>({
		defaultValues: {
			title: "",
			content: "",
			date: new Date().toISOString().split("T")[0],
		},
		mode: "onChange",
	});

	// ブログデータの読み込み
	useEffect(() => {
		if (!id || authLoading) return;

		const loadBlog = async () => {
			try {
				const blog = await getBlogById(id);
				if (!blog) {
					alert("ブログが見つかりません");
					navigate("/admin/index");
					return;
				}

				reset({
					title: blog.title,
					content: blog.content,
					date: blog.date || new Date().toISOString().split("T")[0],
				});
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "ブログの読み込みに失敗しました";
				alert(`ブログの読み込みに失敗しました: ${errorMessage}`);
				navigate("/admin/index");
			}
		};

		loadBlog();
	}, [id, authLoading, navigate, reset]);

	// 認証チェック
	if (!authLoading && !isAdmin) {
		navigate("/login");
		return null;
	}

	const onSubmit: SubmitHandler<BlogFormData> = async (data: BlogFormData) => {
		if (!id) {
			alert("ブログIDが不正です");
			return;
		}

		try {
			await updateBlog(id, {
				title: data.title,
				content: data.content,
				date: data.date,
			});
			alert("ブログを更新しました");
			navigate("/admin/index");
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "更新に失敗しました";
			alert(`更新に失敗しました: ${errorMessage}`);
		}
	};

	if (authLoading) {
		return <div className="edit-loading">読み込み中...</div>;
	}

	return (
		<div className="edit-blog-container">
			<div className="edit-header">
				<h1>ブログ編集</h1>
				<button onClick={() => navigate("/admin/index")} className="btn-back">
					戻る
				</button>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="blog-form">
				<Controller
					name="title"
					control={control}
					rules={{ required: "タイトルは必須です" }}
					render={({ field, fieldState }) => (
						<div className="form-group">
							<label htmlFor="title">タイトル</label>
							<div className="form-input">
								<input id="title" type="text" {...field} />
								{fieldState.error && (
									<span className="error-message">
										{fieldState.error.message}
									</span>
								)}
							</div>
						</div>
					)}
				/>

				<Controller
					name="date"
					control={control}
					rules={{ required: "日付は必須です" }}
					render={({ field, fieldState }) => (
						<div className="form-group">
							<label htmlFor="date">日付</label>
							<div className="form-input">
								<input id="date" type="date" {...field} />
								{fieldState.error && (
									<span className="error-message">
										{fieldState.error.message}
									</span>
								)}
							</div>
						</div>
					)}
				/>

				<Controller
					name="content"
					control={control}
					rules={{ required: "本文は必須です" }}
					render={({ field, fieldState }) => (
						<div className="form-group">
							<label htmlFor="content">本文（Markdown対応）</label>
							<div className="form-input">
								<textarea id="content" {...field} rows={20} />
								{fieldState.error && (
									<span className="error-message">
										{fieldState.error.message}
									</span>
								)}
							</div>
						</div>
					)}
				/>

				<div className="form-actions">
					<button type="submit" disabled={!isValid}>
						更新
					</button>
					<button
						type="button"
						onClick={() => navigate("/admin/index")}
					>
						キャンセル
					</button>
				</div>
			</form>
		</div>
	);
};

export default EditBlog;

