import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import "./style.css";

import emailjs from "emailjs-com";

type ContactFormData = {
	name: string;
	email: string;
	message: string;
};

const Contact = () => {
	window.scrollTo({top: 0, behavior: "instant"});
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

		try {
			await emailjs.send(serviceId, templateId, data, publicKey);

			console.log("送信成功");
			handleReset();
		} catch (error) {
			console.log("送信に失敗しました。再度お試しください。", error);
			// 送信失敗時のアラート
			alert("送信に失敗しました。再度お試しください。");
		}
	};

	const handleReset = () => {
		reset();
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

				<form onSubmit={handleSubmit(onSubmit)} className="contact-form">
					<Controller
						name="name"
						rules={{ required: "名前は必須です" }}
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
						rules={{ required: "メッセージは必須です" }}
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

					<div className="form-actions">
						<button
							type="submit"
							className="btn-submit"
							disabled={!isValid || !isDirty}
						>
							送信
						</button>
						<button
							type="button"
							className="btn-reset"
							onClick={handleReset}
							disabled={!isDirty}
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

