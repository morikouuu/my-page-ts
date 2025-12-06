// src/hooks/useBlogs.ts
import { useState, useEffect } from "react";
import { getAllBlogs, convertToBlogData } from "../services/blogService";
import type { BlogData } from "../types/type";

export const useBlogs = () => {
	const [blogs, setBlogs] = useState<BlogData[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadBlogs = async () => {
			try {
				setIsLoading(true);
				const blogList = await getAllBlogs();
				// FirestoreBlogDataをBlogDataに変換
				const convertedBlogs: BlogData[] = blogList.map(convertToBlogData);
				setBlogs(convertedBlogs);
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "ブログの取得に失敗しました";
				setError(errorMessage);
				console.error("ブログの取得に失敗しました:", err);
			} finally {
				setIsLoading(false);
			}
		};

		loadBlogs();
	}, []);

	return { blogs, isLoading, error };
};
