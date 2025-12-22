import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useState } from "react";
import "./style.css";

import emailjs from "emailjs-com";

type ContactFormData = {
	name: string;
	email: string;
	message: string;
};

const Contact = () => {
	window.scrollTo({ top: 0, behavior: "instant" });
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
		null
	);

	const defaultValues: ContactFormData = {
		name: "",
		email: "",
		message: "",
	};

	const {
		control,
		handleSubmit,
		reset,
		formState: { isDirty, isValid },
	} = useForm<ContactFormData>({
		defaultValues,
		mode: "onChange",
	});

	const onSubmit: SubmitHandler<ContactFormData> = async (
		data: ContactFormData
	) => {
		const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
		const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
		const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

		// 環境変数のチェック
		if (!serviceId || !templateId || !publicKey) {
			alert(
				"メール送信の設定が完了していません。管理者にお問い合わせください。"
			);
			return;
		}

		setIsSubmitting(true);
		setSubmitStatus(null);

		try {
			await emailjs.send(serviceId, templateId, data, publicKey);
			setSubmitStatus("success");
			handleReset();
			console.log("送信成功");
			// 3秒後に成功メッセージを非表示
			setTimeout(() => setSubmitStatus(null), 3000);
		} catch (error) {
			console.error("送信に失敗しました。再度お試しください。", error);
			setSubmitStatus("error");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleReset = () => {
		reset();
		setSubmitStatus(null);
	};

	return (
		<div className="contact-container">
			<div className="contact-header">
				<h1 className="contact-title">Contact</h1>
				<Link to="/" className="back-link">
					← ホームに戻る
				</Link>
			</div>

			<div className="contact-content">
				<p className="contact-description">
					お問い合わせやご質問がございましたら、お気軽にご連絡ください。
				</p>

				{submitStatus === "success" && (
					<div className="submit-success">
						お問い合わせありがとうございます。送信が完了しました。
					</div>
				)}

				{submitStatus === "error" && (
					<div className="submit-error">
						送信に失敗しました。再度お試しください。
					</div>
				)}

				<form onSubmit={handleSubmit(onSubmit)} className="contact-form">
					<Controller
						name="name"
						rules={{
							required: "名前は必須です",
							minLength: {
								value: 2,
								message: "名前は2文字以上で入力してください",
							},
							maxLength: {
								value: 50,
								message: "名前は50文字以内で入力してください",
							},
							pattern: {
								value: /^[^\s<>]+$/,
								message: "名前に使用できない文字が含まれています",
							},
						}}
						control={control}
						render={({ field, fieldState }) => (
							<div className="form-group">
								<label htmlFor="name">名前</label>
								<div className="form-input">
									<input
										id="name"
										type="text"
										{...field}
										placeholder="お名前を入力してください"
										maxLength={50}
									/>
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
						name="email"
						rules={{
							required: "メールアドレスは必須です",
							pattern: {
								value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
								message: "有効なメールアドレスを入力してください",
							},
							maxLength: {
								value: 254,
								message: "メールアドレスは254文字以内で入力してください",
							},
						}}
						control={control}
						render={({ field, fieldState }) => (
							<div className="form-group">
								<label htmlFor="email">メールアドレス</label>
								<div className="form-input">
									<input
										id="email"
										type="email"
										{...field}
										placeholder="example@email.com"
										maxLength={254}
									/>
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
						name="message"
						rules={{
							required: "メッセージは必須です",
							minLength: {
								value: 10,
								message: "メッセージは10文字以上で入力してください",
							},
							maxLength: {
								value: 1000,
								message: "メッセージは1000文字以内で入力してください",
							},
						}}
						control={control}
						render={({ field, fieldState }) => (
							<div className="form-group">
								<label htmlFor="message">メッセージ</label>
								<div className="form-input">
									<textarea
										id="message"
										{...field}
										rows={8}
										placeholder="お問い合わせ内容をご記入ください"
										maxLength={1000}
									/>
									<div className="character-count">
										{field.value.length} / 1000文字
									</div>
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
						<button
							type="submit"
							className="btn-submit"
							disabled={!isValid || !isDirty || isSubmitting}
						>
							{isSubmitting ? "送信中..." : "送信"}
						</button>
						<button
							type="button"
							className="btn-reset"
							onClick={handleReset}
							disabled={!isDirty || isSubmitting}
						>
							リセット
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Contact;
