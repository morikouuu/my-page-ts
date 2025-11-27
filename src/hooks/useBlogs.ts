// src/hooks/useBlogs.ts
import { useState, useCallback } from "react";
import { getAllBlogs } from "../services/blogService";
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
			const convertedBlogs: BlogData[] = blogList.map((blog) => ({
				id: blog.id || "",
				title: blog.title,
				date: blog.date || (blog.createdAt?.toDate().toISOString().split("T")[0] || ""),
				content: blog.content || "",
				published: blog.published ?? true,
				createdAt: blog.createdAt?.toDate().toISOString(),
				link: `/blog/${blog.id}`,
			}));
			setBlogs(convertedBlogs);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "ブログの取得に失敗しました";
			setError(errorMessage);
			alert(errorMessage);
		} finally {
			setLoading(false);
		}
	}, []);

	return { blogs, loading, error, loadBlogs };
};

