import type { BlogData } from "../types/type";

// 🔴 これは仮のモックデータです
// 後でFirebaseに置き換えます
export const blogData: BlogData[] = [
	{
		id: 1,
		label: "Blog 11/5 📃",
		date: "2025-11-05",
		link: "/blog/2025-11-05",
		slug: "2025-11-05",
		excerpt: "ブログの内容がここに表示されます...",
		content: `# Blog 11/5

これは2025年11月5日のブログ記事です。

## セクション1
ここに本文の内容が入ります。

## セクション2
さらに詳しい内容が続きます。`,
	},
	{
		id: 2,
		label: "Blog 11/8 📃",
		date: "2025-11-08",
		link: "/blog/2025-11-08",
		slug: "2025-11-08",
		excerpt: "ブログの内容がここに表示されます...",
		content: `# Blog 11/8

これは2025年11月8日のブログ記事です。`,
	},
	{
		id: 3,
		label: "Blog 11/16 📃",
		date: "2025-11-16",
		link: "/blog/2025-11-16",
		slug: "2025-11-16",
		excerpt: "ブログの内容がここに表示されます...",
		content: `# Blog 11/16

これは2025年11月16日のブログ記事です。`,
	},
	{
		id: 4,
		label: "Blog 11/20 📃",
		date: "2025-11-20",
		link: "/blog/2025-11-20",
		slug: "2025-11-20",
		excerpt: "ブログの内容がここに表示されます...",
		content: `# Blog 11/20

これは2025年11月20日のブログ記事です。`,
	},
	{
		id: 5,
		label: "Blog 11/25 📃",
		date: "2025-11-25",
		link: "/blog/2025-11-25",
		slug: "2025-11-25",
		excerpt: "ブログの内容がここに表示されます...",
		content: `# Blog 11/25

これは2025年11月25日のブログ記事です。`,
	},
];

// slugでブログを取得
export const getBlogBySlug = (slug: string): BlogData | undefined => {
	return blogData.find((blog) => blog.slug === slug);
};

// IDでブログを取得
export const getBlogById = (id: number): BlogData | undefined => {
	return blogData.find((blog) => blog.id === id);
};

// 🔴 将来Firebaseに置き換える際のインターフェース
// src/services/blogService.ts として以下のような関数を実装予定：
// - fetchAllBlogs(): Promise<BlogData[]>
// - fetchBlogBySlug(slug: string): Promise<BlogData | null>
// - createBlog(blog: Omit<BlogData, 'id'>): Promise<BlogData>
// - updateBlog(id: string, blog: Partial<BlogData>): Promise<void>
// - deleteBlog(id: string): Promise<void>
