// src/services/authService.ts
import {
	signInWithEmailAndPassword,
	signOut as firebaseSignOut,
	onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import type { User } from "firebase/auth";

// ログイン
export const signIn = async (email: string, password: string) => {
	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = userCredential.user;

		// 管理者権限をチェック
		const isAdmin = await checkIsAdmin(user.uid);
		if (!isAdmin) {
			await firebaseSignOut(auth);
			throw new Error("管理者権限がありません");
		}

		return { user, error: null };
	} catch (error: unknown) {
		const errorMessage =
			error instanceof Error ? error.message : "ログインに失敗しました";
		return { user: null, error: errorMessage };
	}
};

// ログアウト
export const signOut = async () => {
	try {
		await firebaseSignOut(auth);
		return { error: null };
	} catch (error: unknown) {
		const errorMessage =
			error instanceof Error ? error.message : "ログアウトに失敗しました";
		return { error: errorMessage };
	}
};

// 管理者権限をチェック
export const checkIsAdmin = async (uid: string): Promise<boolean> => {
	try {
		const userDoc = await getDoc(doc(db, "users", uid));
		if (!userDoc.exists()) {
			console.warn("ユーザードキュメントが存在しません:", uid);
			return false;
		}

		const userData = userDoc.data();
		return userData.role === "admin";
	} catch (error: unknown) {
		const errorMessage =
			error instanceof Error ? error.message : "権限チェックに失敗しました";
		console.error("管理者権限チェックエラー:", errorMessage, error);
		return false;
	}
};

// 現在のユーザーを取得
export const getCurrentUser = (): User | null => {
	return auth.currentUser;
};

// 認証状態の変更を監視
export const onAuthChange = (callback: (user: User | null) => void) => {
	return onAuthStateChanged(auth, callback);
};
