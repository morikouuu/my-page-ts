import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";

type ContactFormData = {
	name: string;
	email: string;
	message: string;
};

const Contact = () => {
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
		try {
			await new Promise<void>((resolve, reject) => {
				const isSuccess = Math.random() < 0.5;
				if (isSuccess) {
					console.log("Success");
					resolve();
				} else {
					console.log("Error");
					reject(new Error("Failed to submit"));
				}
			});

			alert("送信成功");
			handleReset();
			console.log(data);
		} catch (error) {
			console.error("Error", error);
			// 送信失敗時のアラート
			alert("送信に失敗しました。再度お試しください。");
		}
	};

	const handleReset = () => {
		reset();
	};

	return (
		<div>
			<h1>Contact</h1>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Controller
					name="name"
					rules={{ required: "名前は必須です" }}
					control={control}
					render={({ field, fieldState }) => (
						<div className="form-group">
							<label htmlFor="name">名前</label>
							<div className="form-input">
								<input id="name" type="text" {...field} />
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
					rules={{ required: "メールアドレスは必須です" }}
					control={control}
					render={({ field, fieldState }) => (
						<div className="form-group">
							<label htmlFor="email">メールアドレス</label>
							<div className="form-input">
								<input id="email" type="email" {...field} />
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
							<label htmlFor="message">メッセージ </label>
							<div className="form-input">
								<textarea id="message" {...field} />
								{fieldState.error && (
									<span className="error-message">
										{fieldState.error.message}
									</span>
								)}
							</div>
						</div>
					)}
				/>
				<button type="submit" disabled={!isValid || !isDirty}>
					送信
				</button>
				<button type="button" onClick={handleReset}>
					リセット
				</button>
			</form>
		</div>
	);
};

export default Contact;
