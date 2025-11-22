// Blog関連の型
export type BlogData = {
	id: number;
	label: string;
	date: string;
	link: string;
	excerpt?: string;
	content?: string;
	slug?: string;
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
	published: boolean;
};
