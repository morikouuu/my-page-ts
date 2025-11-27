// src/hooks/useAuth.ts
import { useState, useEffect } from "react";
import type { User } from "firebase/auth";
import { onAuthChange, checkIsAdmin } from "../services/authService";

export const useAuth = () => {
	const [user, setUser] = useState<User | null>(null);
	const [isAdmin, setIsAdmin] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthChange(async (currentUser) => {
			setUser(currentUser);

			if (currentUser) {
				try {
					const admin = await checkIsAdmin(currentUser.uid);
					setIsAdmin(admin);
				} catch (error: unknown) {
					const errorMessage =
						error instanceof Error ? error.message : "権限チェックに失敗しました";
					console.error("認証状態変更時のエラー:", errorMessage, error);
					setIsAdmin(false);
				}
			} else {
				setIsAdmin(false);
			}

			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	return { user, isAdmin, loading };
};

