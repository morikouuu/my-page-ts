import { Link } from "react-router-dom";
import "./Home.css";
import { useState, useRef, useMemo } from "react";
import { useBlogs } from "../hooks/useBlogs";

const Home = () => {
	const [bubblePositions, setBubblePositions] = useState<{
		[key: string]: { top: number; left: number };
	}>({});
	const [dragging, setDragging] = useState<string | null>(null);
	const dragState = useRef<{
		bubbleId: string;
		startX: number;
		startY: number;
		element: HTMLElement;
	} | null>(null);

	// ブログデータの取得
	const { blogs: rawBlogs, loading: blogsLoading } = useBlogs();

	// 日付でソートしたブログリスト
	const blogs = useMemo(() => {
		return [...rawBlogs].sort((a, b) => {
			const dateA = new Date(a.date || a.createdAt || "").getTime();
			const dateB = new Date(b.date || b.createdAt || "").getTime();
			return dateB - dateA;
		});
	}, [rawBlogs]);

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
		{ id: 1, x: 60, y: 30, label: "coming soon", link: null },
		{ id: 2, x: 90, y: 20, label: null, link: null },
		{ id: 3, x: 45, y: 70, label: null, link: null },
	];

	// 最新3件のブログ
	const latestBlogs = useMemo(() => blogs.slice(0, 3), [blogs]);

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

	// ドラッグ処理
	const handleMouseDown = (e: React.MouseEvent, bubbleId: string) => {
		e.preventDefault();
		e.stopPropagation();

		const bubbleSection = document.getElementById("bubble-area");
		if (!bubbleSection) return;

		let hasMoved = false;

		dragState.current = {
			bubbleId,
			startX: e.clientX,
			startY: e.clientY,
			element: e.currentTarget as HTMLElement,
		};

		setDragging(bubbleId);

		const onMouseMove = (e: MouseEvent) => {
			if (!dragState.current || !bubbleSection) return;

			const sectionRect = bubbleSection.getBoundingClientRect();
			const moveX = e.clientX - dragState.current.startX;
			const moveY = e.clientY - dragState.current.startY;
			const moved = Math.abs(moveX) > 5 || Math.abs(moveY) > 5;

			if (moved) {
				hasMoved = true;
				const currentBubbleId = dragState.current.bubbleId;
				const newLeft = Math.max(
					0,
					Math.min(
						100,
						((e.clientX - sectionRect.left) / sectionRect.width) * 100
					)
				);
				const newTop = Math.max(
					0,
					Math.min(
						100,
						((e.clientY - sectionRect.top) / sectionRect.height) * 100
					)
				);

				setBubblePositions((prev) => ({
					...prev,
					[currentBubbleId]: { top: newTop, left: newLeft },
				}));
			}
		};

		const onMouseUp = () => {
			if (dragState.current && !hasMoved) {
				const el = dragState.current.element;
				if (el instanceof HTMLAnchorElement) {
					if (el.target === "_blank") {
						window.open(el.href, "_blank", "noopener,noreferrer");
					} else {
						el.click();
					}
				}
			}

			setDragging(null);
			dragState.current = null;
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseup", onMouseUp);
		};

		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseup", onMouseUp);
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
							onMouseDown={(e) => handleMouseDown(e, bubbleId)}
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
										to={product.link || ""}
										className={`bubble bubble-product ${
											isDragging ? "dragging" : ""
										}`}
										style={{
											top: `${position.top}%`,
											left: `${position.left}%`,
										}}
										onMouseDown={(e) => handleMouseDown(e, bubbleId)}
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
							onMouseDown={(e) => handleMouseDown(e, bubbleId)}
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
							<img
								src="/images/profile.png"
								alt="profile画像"
								className="profile-image"
							/>
						</div>
						<div className="profile-info">
							<h3 className="profile-name">morikouuu</h3>
							<p className="profile-bio">
								このページを見ていただきありがとうございます。
								ここでは私の日々の気づきや技術メモをブログで書き留めています。
								また、今は少ないですが制作物もここに残していきたいと思っています。
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
									to={product.link || ""}
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
				</div>
			</section>
			<section id="contact" className="contact-section">
				<div className="section-content">
					<h2 className="section-title">Contact</h2>
					<div className="contact-card">
						<p className="contact-description">
							お問い合わせやご質問がございましたら、お気軽にご連絡ください。
						</p>
						<Link to="/contact" className="contact-link">
							お問い合わせフォームへ →
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Home;
