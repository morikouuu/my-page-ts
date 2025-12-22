import {
	collection,
	doc,
	getDocs,
	query,
	orderBy,
	getDoc,
	addDoc,
	updateDoc,
	deleteDoc,
	Timestamp,
} from "firebase/firestore";

import { db } from "./firebase";
import type { BlogData } from "../types/type";

export type FirestoreBlogData = {
	id?: string;
	createdAt?: Timestamp;
	title: string;
	content: string;
	date: string;
	authorId?: string;
};

/**
 * FirestoreBlogDataをBlogDataに変換
 */
export const convertToBlogData = (
	firestoreBlog: FirestoreBlogData
): BlogData => {
	return {
		id: firestoreBlog.id || "",
		title: firestoreBlog.title,
		date:
			firestoreBlog.date ||
			firestoreBlog.createdAt?.toDate().toISOString().split("T")[0] ||
			"",
		content: firestoreBlog.content || "",
		createdAt: firestoreBlog.createdAt?.toDate().toISOString(),
		link: `/blog/${firestoreBlog.id}`,
	};
};

export const getAllBlogs = async (): Promise<FirestoreBlogData[]> => {
	try {
		const blogsRef = collection(db, "blogs");
		const q = query(blogsRef, orderBy("createdAt", "desc"));
		const snapshot = await getDocs(q);
		return snapshot.docs.map((doc) => {
			const data: FirestoreBlogData = doc.data() as FirestoreBlogData;
			return {
				id: doc.id,
				createdAt: data.createdAt,
				title: data.title || "",
				content: data.content || "",
				date: data.date || "",
				authorId: data.authorId || "",
			};
		});
	} catch (error) {
		console.error("ブログの取得に失敗しました:", error);
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
			authorId: data.authorId || "",
		};
	} catch (error) {
		console.error("ブログの取得に失敗しました:", error);
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
