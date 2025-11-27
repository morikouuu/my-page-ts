// src/pages/Login.tsx
import { useState } from "react";
import type { LoginData } from "../types/type";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { signIn } from "../services/authService";
import type { SubmitHandler } from "react-hook-form";

const Login = () => {
	const defaultValues: LoginData = {
		email: "",
		password: "",
	};
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const {
		control,
		handleSubmit,
		formState: { isValid },
	} = useForm<LoginData>({
		defaultValues,
		mode: "onChange",
	});

	const onSubmit: SubmitHandler<LoginData> = async (data: LoginData) => {
		setError(null);
		setIsLoading(true);

		try {
			// authServiceのsignInを呼び出し
			const { user, error: authError } = await signIn(
				data.email,
				data.password
			);

			if (authError) {
				// エラーがある場合
				setError(authError);
				alert("ログインに失敗しました: " + authError);
			} else if (user) {
				// 成功時
				alert("ログイン成功");
				navigate("/admin/index");
			}
		} catch (error) {
			// 予期しないエラー（通常は発生しないが、念のため）
			const errorMessage =
				error instanceof Error ? error.message : "ログインに失敗しました";
			setError(errorMessage);
			alert("ログインに失敗しました: " + errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="login-container">
			<div className="login-card">
				<h1 className="login-title">ログイン</h1>
				<form onSubmit={handleSubmit(onSubmit)}>
					{error && <div className="error-banner">{error}</div>}

					<Controller
						name="email"
						control={control}
						rules={{
							required: "メールアドレスは必須です",
						}}
						render={({ field, fieldState }) => (
							<div className="form-group">
								<label htmlFor="email">メールアドレス</label>
								<div className="form-input">
									<input
										id="email"
										type="email"
										{...field}
										disabled={isLoading}
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
						name="password"
						control={control}
						rules={{ required: "パスワードは必須です" }}
						render={({ field, fieldState }) => (
							<div className="form-group">
								<label htmlFor="password">パスワード</label>
								<div className="form-input">
									<input
										id="password"
										type="password"
										{...field}
										disabled={isLoading}
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

					<button type="submit" disabled={!isValid || isLoading}>
						{isLoading ? "ログイン中..." : "ログイン"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default Login;
