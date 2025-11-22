import { Link } from "react-router-dom";
import { blogData } from "../data/blogData";
import "./Home.css";
import { useState, useRef } from "react";

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
	const latestBlogs = blogData.slice(0, 3);

	// ブログバブル用のデータ
	const blogBubbles = [
		{
			id: latestBlogs[0].id,
			label: latestBlogs[0].label.replace(" 📃", ""),
			link: latestBlogs[0].link,
			x: 25,
			y: 40,
		},
		{
			id: latestBlogs[1].id,
			label: latestBlogs[1].label.replace(" 📃", ""),
			link: latestBlogs[1].link,
			x: 50,
			y: 60,
		},
		{
			id: latestBlogs[2].id,
			label: latestBlogs[2].label.replace(" 📃", ""),
			link: latestBlogs[2].link,
			x: 75,
			y: 30,
		},
	];
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
							{blog.label}
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
					<div className="blog-grid">
						{latestBlogs.map((blog) => (
							<Link key={blog.id} to={blog.link} className="blog-card">
								<div className="blog-date">{blog.date}</div>
								<h3 className="blog-title">{blog.label}</h3>
								<p className="blog-excerpt">
									{blog.excerpt || "ブログの内容がここに表示されます..."}
								</p>
							</Link>
						))}
					</div>
					<Link to="/blog" className="section-link">
						すべてのブログを見る →
					</Link>
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
		</div>
	);
};

export default Home;
