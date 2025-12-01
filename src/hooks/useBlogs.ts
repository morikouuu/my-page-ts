// src/hooks/useBlogs.ts
import { useState, useCallback } from "react";
import { getAllBlogs, convertToBlogData } from "../services/blogService";
import type { BlogData } from "../types/type";

export const useBlogs = () => {
	const [blogs, setBlogs] = useState<BlogData[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadBlogs = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
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
			setLoading(false);
		}
	}, []);

	return { blogs, loading, error, loadBlogs };
};
