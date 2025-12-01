// src/hooks/useBlog.ts
import { useState, useEffect } from "react";
import { getBlogById, convertToBlogData } from "../services/blogService";
import type { BlogData } from "../types/type";

export const useBlog = (blogId: string | undefined) => {
	const [blog, setBlog] = useState<BlogData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!blogId) {
			setError("ブログIDが指定されていません");
			setLoading(false);
			return;
		}

		const loadBlog = async () => {
			try {
				const blogData = await getBlogById(blogId);
				if (!blogData) {
					setError("ブログが見つかりません");
					return;
				}

				const convertedBlog: BlogData = convertToBlogData(blogData);
				setBlog(convertedBlog);
			} catch (err) {
				const errorMessage =
					err instanceof Error
						? err.message
						: "ブログの取得に失敗しました";
				setError(errorMessage);
				console.error("ブログの取得に失敗しました:", err);
			} finally {
				setLoading(false);
			}
		};

		loadBlog();
	}, [blogId]);

	return { blog, loading, error };
};

