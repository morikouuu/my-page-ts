import {
	collection,
	doc,
	getDocs,
	getDoc,
	addDoc,
	updateDoc,
	deleteDoc,
	Timestamp,
} from "firebase/firestore";

import { db } from "./firebase";

export type FirestoreBlogData = {
	id?: string;
	createdAt?: Timestamp;
	title: string;
	content: string;
	date: string;
	published?: boolean;
	authorId?: string;
};

export const getAllBlogs = async (): Promise<FirestoreBlogData[]> => {
	try {
		const blogsRef = collection(db, "blogs");
		const snapshot = await getDocs(blogsRef);
		return snapshot.docs.map((doc) => {
			const data = doc.data();
			return {
				id: doc.id,
				createdAt: data.createdAt,
				title: data.title || "",
				content: data.content || "",
				date: data.date || "",
				published: data.published ?? true,
				authorId: data.authorId || "",
			};
		});
	} catch (error) {
		console.error("Error fetching blogs:", error);
		throw error;
	}
};

// 公開済みブログのみを取得（一般ユーザー向け）
export const getPublishedBlogs = async (): Promise<FirestoreBlogData[]> => {
	try {
		const blogsRef = collection(db, "blogs");
		const snapshot = await getDocs(blogsRef);
		return snapshot.docs
			.map((doc) => {
				const data = doc.data();
				return {
					id: doc.id,
					createdAt: data.createdAt,
					title: data.title || "",
					content: data.content || "",
					date: data.date || "",
					published: data.published ?? true,
					authorId: data.authorId || "",
				};
			})
			.filter((blog) => blog.published !== false);
	} catch (error) {
		console.error("Error fetching published blogs:", error);
		throw error;
	}
};

export const getBlogById = async (
	blogId: string
): Promise<FirestoreBlogData | null> => {
	try {
		const blogRef = doc(db, "blogs", blogId);
		const blogSnap = await getDoc(blogRef);

		if (!blogSnap.exists()) {
			return null;
		}

		const data = blogSnap.data();
		return {
			id: blogSnap.id,
			createdAt: data.createdAt,
			title: data.title || "",
			content: data.content || "",
			date: data.date || "",
			published: data.published ?? true,
			authorId: data.authorId || "",
		};
	} catch (error) {
		console.error("Error fetching blog:", error);
		throw error;
	}
};

export const createBlog = async (
	blogData: Omit<FirestoreBlogData, "id" | "createdAt">
): Promise<string> => {
	try {
		const { auth } = await import("./firebase");
		const currentUser = auth.currentUser;

		if (!currentUser) {
			throw new Error("認証が必要です");
		}

		const blogDoc = {
			...blogData,
			authorId: currentUser.uid,
			createdAt: Timestamp.now(),
			published: blogData.published ?? true,
		};

		const docRef = await addDoc(collection(db, "blogs"), blogDoc);
		return docRef.id;
	} catch (error) {
		console.error("Error creating blog:", error);
		throw error;
	}
};

export const updateBlog = async (
	blogId: string,
	blogData: Partial<Omit<FirestoreBlogData, "id" | "createdAt">>
): Promise<void> => {
	try {
		const blogRef = doc(db, "blogs", blogId);
		await updateDoc(blogRef, {
			...blogData,
		});
	} catch (error) {
		console.error("Error updating blog:", error);
		throw error;
	}
};
export const deleteBlog = async (blogId: string): Promise<void> => {
	try {
		const blogRef = doc(db, "blogs", blogId);
		await deleteDoc(blogRef);
	} catch (error) {
		console.error("Error deleting blog:", error);
		throw error;
	}
};
