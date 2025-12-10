import { Link } from "react-router-dom";
import "./style.css";
import { useState, useRef, useMemo } from "react";
import { useBlogs } from "../../hooks/useBlogs";
import useEmblaCarousel from "embla-carousel-react";

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
	const { blogs: rawBlogs, isLoading: blogsLoading } = useBlogs();
	const [emblaRef, emblaApi] = useEmblaCarousel({
		loop: true,
	});

	const handleNext = () => {
		if (!emblaApi) return;
		console.log("next");
		emblaApi.scrollNext();
	};

	const handlePrev = () => {
		if (!emblaApi) return;
		console.log("prev");
		emblaApi.scrollPrev();
	};

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

	// ブログデータの取得

	// 最新3件のブログ

	const blogBubbles = useMemo(() => {
		const bubbles: Array<{
			id: string | number;
			title: string;
			link: string;
			x: number;
			y: number;
		}> = [];

		const latest3 = rawBlogs.slice(0, 3);

		if (latest3[0]) {
			bubbles.push({
				id: latest3[0].id,
				title: latest3[0].title || "",
				link: latest3[0].link || `/blog/${latest3[0].id}`,
				x: 25,
				y: 40,
			});
		}
		if (latest3[1]) {
			bubbles.push({
				id: latest3[1].id,
				title: latest3[1].title || "",
				link: latest3[1].link || `/blog/${latest3[1].id}`,
				x: 50,
				y: 60,
			});
		}
		if (latest3[2]) {
			bubbles.push({
				id: latest3[2].id,
				title: latest3[2].title || "",
				link: latest3[2].link || `/blog/${latest3[2].id}`,
				x: 75,
				y: 30,
			});
		}

		return bubbles;
	}, [rawBlogs]);
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
			{/* ブログセクション */}
			<section id="blog" className="blog-section">
				<div className="section-content">
					<h2 className="section-title">Blog</h2>
					{blogsLoading ? (
						<div className="blog-loading">読み込み中...</div>
					) : (
						<div className="embla embla-blog">
							<div className="embla__viewport" ref={emblaRef}>
								<div className="embla__container">
									{rawBlogs.slice(0, 5).map((blog) => (
										<div className="embla__slide" key={blog.id}>
											<Link
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
										</div>
									))}
								</div>
							</div>

							{/* ボタンを左下に横並び配置 */}
							<div className="embla-blog-controls">
								<button
									className="embla__button embla__button--prev"
									onClick={() => handlePrev()}
								>
									◀
								</button>

								<button
									className="embla__button embla__button--next"
									onClick={() => handleNext()}
								>
									▶
								</button>
							</div>
						</div>
					)}
				</div>
			</section>

			{/* お問い合わせセクション */}
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
