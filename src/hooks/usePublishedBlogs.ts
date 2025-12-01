import { useState, useEffect } from "react";
import { getPublishedBlogs, convertToBlogData } from "../services/blogService";
import type { BlogData } from "../types/type";

export const usePublishedBlogs = () => {
	const [blogs, setBlogs] = useState<BlogData[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadBlogs = async () => {
			try {
				const blogList = await getPublishedBlogs();
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
		};

		loadBlogs();
	}, []);

	return { blogs, loading, error };
};
