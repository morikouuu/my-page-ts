// Blog関連の型
export type BlogData = {
	id: string | number; // slugとしても使用
	title: string;
	date: string;
	content: string;
	createdAt?: string; // ISO 8601形式
	link?: string; // 計算可能（/blog/${id}）
};

// Bubble関連の型
export type BubbleData = {
	id: number;
	label: string;
	link: string;
};

export type BubbleType = "blog" | "sns" | "product";

// SNS関連の型
export type SnsData = {
	id: number;
	label: string;
	link: string;
};

// Contact関連の型
export type ContactFormData = {
	name: string;
	email: string;
	message: string;
};

// Firebase用の型（将来使用）
export type FirebaseBlogData = {
	id: string; // Firebaseではstringになる
	title: string;
	date: string;
	slug: string;
	excerpt: string;
	content: string;
	createdAt: Date;
	updatedAt: Date;
};

export type LoginData = {
	email: string;
	password: string;
};
