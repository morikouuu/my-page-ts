import { Link } from "react-router-dom";
import "./Home.css";
import { useState, useRef, useEffect, useMemo } from "react";
import { getPublishedBlogs } from "../services/blogService";
import type { BlogData } from "../types/type";

const Home = () => {
	const [bubblePositions, setBubblePositions] = useState<{
		[key: string]: { top: number; left: number };
	}>({});
	const [dragging, setDragging] = useState<string | null>(null);
	const dragStart = useRef<{
		x: number;
		y: number;
		bubbleId: string;
		bubbleTop: number;
		bubbleLeft: number;
		element: HTMLElement | null; // リンク要素への参照を追加
	} | null>(null);

	const hasMoved = useRef(false);

	// ブログデータの状態管理
	const [blogs, setBlogs] = useState<BlogData[]>([]);
	const [blogsLoading, setBlogsLoading] = useState(true);

	// Firebaseからブログデータを取得
	useEffect(() => {
		const loadBlogs = async () => {
			try {
				const blogList = await getPublishedBlogs();
				// FirestoreBlogDataをBlogDataに変換
				const convertedBlogs: BlogData[] = blogList.map((blog) => ({
					id: blog.id || "",
					title: blog.title,
					date:
						blog.date ||
						blog.createdAt?.toDate().toISOString().split("T")[0] ||
						"",
					content: blog.content || "",
					published: blog.published ?? true,
					createdAt: blog.createdAt?.toDate().toISOString(),
					link: `/blog/${blog.id}`,
				}));
				// 日付でソート（新しい順）
				convertedBlogs.sort((a, b) => {
					const dateA = new Date(a.date || a.createdAt || "").getTime();
					const dateB = new Date(b.date || b.createdAt || "").getTime();
					return dateB - dateA;
				});
				setBlogs(convertedBlogs);
			} catch (error) {
				console.error("ブログの取得に失敗しました:", error);
				// エラー時は空配列を設定
				setBlogs([]);
			} finally {
				setBlogsLoading(false);
			}
		};

		loadBlogs();
	}, []);

	const snsBubbles = [
		{
			id: 1,
			x: 50,
			y: 80,
			label: "Github",
			link: "https://github.com/morikouuu",
		},
		{
			id: 2,
			x: 25,
			y: 80,
			label: "X",
			link: "https://x.com/ilike_lamb?t=Lmu7FrE60JIyM9wmEbS1fA&s=09",
		},
	];

	const productBubbles = [
		{ id: 1, x: 60, y: 30, label: "coming soon", link: "/product" },
		{ id: 2, x: 90, y: 20, label: null, link: null },
		{ id: 3, x: 45, y: 70, label: null, link: null },
	];

	// 最新3件のブログを表示
	const latestBlogs = useMemo(() => blogs.slice(0, 3), [blogs]);

	// ブログバブル用のデータ（存在するブログのみ）
	const blogBubbles = useMemo(() => {
		const bubbles: Array<{
			id: string | number;
			title: string;
			link: string;
			x: number;
			y: number;
		}> = [];

		if (latestBlogs[0]) {
			bubbles.push({
				id: latestBlogs[0].id,
				title: latestBlogs[0].title || "",
				link: latestBlogs[0].link || `/blog/${latestBlogs[0].id}`,
				x: 25,
				y: 40,
			});
		}
		if (latestBlogs[1]) {
			bubbles.push({
				id: latestBlogs[1].id,
				title: latestBlogs[1].title || "",
				link: latestBlogs[1].link || `/blog/${latestBlogs[1].id}`,
				x: 50,
				y: 60,
			});
		}
		if (latestBlogs[2]) {
			bubbles.push({
				id: latestBlogs[2].id,
				title: latestBlogs[2].title || "",
				link: latestBlogs[2].link || `/blog/${latestBlogs[2].id}`,
				x: 75,
				y: 30,
			});
		}

		return bubbles;
	}, [latestBlogs]);
	// バブルの位置を取得する関数
	const getBubblePosition = (
		bubbleId: string,
		initialX: number,
		initialY: number
	) => {
		if (bubblePositions[bubbleId]) {
			return bubblePositions[bubbleId];
		}
		return { top: initialY, left: initialX };
	};

	// ドラッグ開始判定の処理
	const handleMouseDown = (
		e: React.MouseEvent,
		bubbleId: string,
		currentTop: number,
		currentLeft: number
	) => {
		e.preventDefault();
		e.stopPropagation();

		// ドラッグ開始情報を記録
		dragStart.current = {
			x: e.clientX,
			y: e.clientY,
			bubbleId,
			bubbleTop: currentTop,
			bubbleLeft: currentLeft,
			element: e.currentTarget as HTMLElement, // リンク要素への参照を保存
		};

		hasMoved.current = false;
		setDragging(bubbleId);

		// マウス移動の処理（ネイティブのMouseEventを使用）
		const handleMouseMove = (e: MouseEvent) => {
			if (!dragStart.current) return;

			// 移動距離を計算
			const moveX = Math.abs(e.clientX - dragStart.current.x);
			const moveY = Math.abs(e.clientY - dragStart.current.y);
			const moveDistance = Math.sqrt(moveX * moveX + moveY * moveY);

			// 5px以上移動したらドラッグと判定
			if (moveDistance > 5) {
				hasMoved.current = true;
			}

			// ドラッグ中の場合のみ位置を更新
			if (hasMoved.current && dragStart.current) {
				const bubbleSection = document.getElementById("bubble-area");
				if (!bubbleSection) return;

				const sectionRect = bubbleSection.getBoundingClientRect();

				// マウス位置からパーセンテージを計算
				let newLeft =
					((e.clientX - sectionRect.left) / sectionRect.width) * 100;
				let newTop = ((e.clientY - sectionRect.top) / sectionRect.height) * 100;

				// 範囲制限（0%～100%）
				newLeft = Math.max(0, Math.min(100, newLeft));
				newTop = Math.max(0, Math.min(100, newTop));

				// dragStart.current の値を安全に取得（null チェック済み）
				const currentBubbleId = dragStart.current.bubbleId;
				setBubblePositions((prev) => ({
					...prev,
					[currentBubbleId]: { top: newTop, left: newLeft },
				}));
			}
		};

		// マウスアップの処理（ネイティブのMouseEventを使用）
		const handleMouseUp = () => {
			// クリック判定（移動していない場合）
			if (!hasMoved.current && dragStart.current && dragStart.current.element) {
				// リンク要素をクリックして遷移を実行
				const linkElement = dragStart.current.element;

				// <a> タグの場合
				if (
					linkElement.tagName === "A" &&
					linkElement instanceof HTMLAnchorElement
				) {
					const href = linkElement.getAttribute("href");
					if (href) {
						if (linkElement.getAttribute("target") === "_blank") {
							// 外部リンクの場合
							window.open(href, "_blank", "noopener,noreferrer");
						} else {
							// 内部リンクの場合
							linkElement.click();
						}
					}
				}
			}

			setDragging(null);
			dragStart.current = null;
			hasMoved.current = false;

			// イベントリスナーを削除
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};

		// グローバルイベントリスナーを追加
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	return (
		<div className="home-container">
			{/* バブルエリア - バブル専用 */}
			<section id="bubble-area" className="bubble-section">
				{/* SNSバブル - 小さめに */}
				{snsBubbles.map((sns) => {
					const bubbleId = `sns-${sns.id}`;
					const position = getBubblePosition(bubbleId, sns.x, sns.y);
					const isDragging = dragging === bubbleId;

					return (
						<a
							key={sns.id}
							data-bubble-id={bubbleId}
							href={sns.link}
							target="_blank"
							rel="noopener noreferrer"
							className={`bubble bubble-sns ${isDragging ? "dragging" : ""}`}
							style={{
								top: `${position.top}%`,
								left: `${position.left}%`,
							}}
							onMouseDown={(e) =>
								handleMouseDown(e, bubbleId, position.top, position.left)
							}
						>
							{sns.label}
						</a>
					);
				})}

				{/* プロダクトバブル */}
				{productBubbles.map((product) =>
					product.label
						? (() => {
								const bubbleId = `product-${product.id}`;
								const position = getBubblePosition(
									bubbleId,
									product.x,
									product.y
								);
								const isDragging = dragging === bubbleId;

								return (
									<Link
										key={product.id}
										data-bubble-id={bubbleId}
										to={product.link}
										className={`bubble bubble-product ${
											isDragging ? "dragging" : ""
										}`}
										style={{
											top: `${position.top}%`,
											left: `${position.left}%`,
										}}
										onMouseDown={(e) =>
											handleMouseDown(e, bubbleId, position.top, position.left)
										}
									>
										{product.label}
									</Link>
								);
						  })()
						: null
				)}

				{/* ブログバブル */}
				{blogBubbles.map((blog) => {
					const bubbleId = `blog-${blog.id}`;
					const position = getBubblePosition(bubbleId, blog.x, blog.y);
					const isDragging = dragging === bubbleId;

					return (
						<Link
							key={blog.id}
							data-bubble-id={bubbleId}
							to={blog.link}
							className={`bubble bubble-blog ${isDragging ? "dragging" : ""}`}
							style={{
								top: `${position.top}%`,
								left: `${position.left}%`,
							}}
							onMouseDown={(e) =>
								handleMouseDown(e, bubbleId, position.top, position.left)
							}
						>
							{blog.title}
						</Link>
					);
				})}
			</section>

			{/* プロフィールセクション */}
			<section id="profile" className="profile-section">
				<div className="section-content">
					<h2 className="section-title">Profile</h2>
					<div className="profile-card">
						<div className="profile-avatar">
							<div className="avatar-placeholder">M</div>
						</div>
						<div className="profile-info">
							<h3 className="profile-name">Your Name</h3>
							<p className="profile-bio">
								こんにちは！Web開発者として活動しています。
								フロントエンド開発を中心に、モダンな技術スタックを使って
								ユーザー体験の向上に取り組んでいます。
							</p>
							<Link to="/profile" className="profile-link">
								詳しく見る →
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* ブログセクション */}
			<section id="blog" className="blog-section">
				<div className="section-content">
					<h2 className="section-title">Blog</h2>
					{blogsLoading ? (
						<div style={{ textAlign: "center", padding: "2rem" }}>
							読み込み中...
						</div>
					) : (
						<>
							<div className="blog-grid">
								{latestBlogs.length > 0 ? (
									latestBlogs.map((blog) => (
										<Link
											key={blog.id}
											to={blog.link || `/blog/${blog.id}`}
											className="blog-card"
										>
											<div className="blog-date">{blog.date}</div>
											<h3 className="blog-title">{blog.title}</h3>
											<p className="blog-excerpt">
												{blog.content?.substring(0, 100) ||
													"ブログの内容がここに表示されます..."}
											</p>
										</Link>
									))
								) : (
									<div style={{ textAlign: "center", padding: "2rem" }}>
										ブログがありません
									</div>
								)}
							</div>
							{latestBlogs.length > 0 && (
								<Link to="/blog" className="section-link">
									すべてのブログを見る →
								</Link>
							)}
						</>
					)}
				</div>
			</section>

			{/* プロダクトセクション */}
			<section id="product" className="product-section">
				<div className="section-content">
					<h2 className="section-title">Product</h2>
					<div className="product-grid">
						{productBubbles.map((product) =>
							product.label ? (
								<Link
									key={product.id}
									to={product.link}
									className="product-card"
								>
									<div className="product-placeholder">{product.label}</div>
								</Link>
							) : (
								<div
									key={product.id}
									className="product-card product-card-empty"
								>
									<div className="product-placeholder">Coming Soon</div>
								</div>
							)
						)}
					</div>
					<Link to="/product" className="section-link">
						すべてのプロダクトを見る →
					</Link>
				</div>
			</section>
			{/* お問い合わせセクション */}
			<section id="contact" className="contact-section">
				<div className="section-content">
					<h2 className="section-title">Contact</h2>
					<div className="contact-card">
						<p>お問い合わせはこちらから</p>
						<Link to="/contact" className="section-link">
							お問い合わせフォームへ →
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Home;
