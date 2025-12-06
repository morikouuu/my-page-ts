// src/pages/Admin/Create.tsx
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { createBlog } from "../../services/blogService";
import { useAuth } from "../../hooks/useAuth";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./Create.css";

type BlogFormData = {
	title: string;
	content: string;
	date: string;
};

const CreateBlog = () => {
	const navigate = useNavigate();
	const { isAdmin, loading: authLoading } = useAuth();
	const {
		control,
		handleSubmit,
		formState: { isValid },
	} = useForm<BlogFormData>({
		defaultValues: {
			title: "",
			content: "",
			date: new Date().toISOString().split("T")[0],
		},
		mode: "onChange",
	});

	// 認証チェック
	if (!authLoading && !isAdmin) {
		navigate("/login");
		return null;
	}

	const onSubmit: SubmitHandler<BlogFormData> = async (data: BlogFormData) => {
		try {
			await createBlog({
				title: data.title,
				content: data.content,
				date: data.date,
			});
			alert("ブログを投稿しました");
			navigate("/admin/index");
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "投稿に失敗しました";
			alert(`投稿に失敗しました: ${errorMessage}`);
		}
	};

	if (authLoading) {
		return <div className="create-loading">読み込み中...</div>;
	}

	return (
		<div className="create-blog-container">
			<div className="create-header">
				<h1>新規ブログ投稿</h1>
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
							<label htmlFor="content">本文</label>
							<div className="form-input">
								<textarea id="content" {...field} rows={20} />
								{fieldState.error && (
									<span className="error-message">
										{fieldState.error.message}
									</span>
								)}
							</div>
							<div className="markdown-preview">
								<label htmlFor="markdown-preview">プレビュー</label>
								<div className="markdown-preview-content">
									<ReactMarkdown remarkPlugins={[remarkGfm]}>
										{field.value}
									</ReactMarkdown>
								</div>
							</div>
						</div>
					)}
				/>

				<div className="form-actions">
					<button type="submit" disabled={!isValid}>
						投稿
					</button>
					<button type="button" onClick={() => navigate("/admin/index")}>
						キャンセル
					</button>
				</div>
			</form>
		</div>
	);
};

export default CreateBlog;
