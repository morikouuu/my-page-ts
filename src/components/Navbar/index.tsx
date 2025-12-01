import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import "./style.css";

type NavbarProps = {
	isOpen: boolean;
	onToggle: () => void;
	onNavigate: (sectionId: string) => void;
};

const Navbar = ({ isOpen, onToggle, onNavigate }: NavbarProps) => {
	const location = useLocation();
	const isHomePage = location.pathname === "/";

	// Homeページ用のメニュー項目（スムーズスクロール）
	const homeMenuItems = [
		{ id: "bubble-area", label: "Home" },
		{ id: "profile", label: "Profile" },
		{ id: "blog", label: "Blog" },
		{ id: "product", label: "Product" },
		{ id: "contact", label: "Contact" },
	];

	// 通常ページ用のメニュー項目（ページ遷移）
	const pageMenuItems = [
		{ path: "/", label: " Home" },
		{ path: "/profile", label: " Profile" },
		{ path: "/blog", label: "Blog" },
		{ path: "/product", label: "Product" },
		{ path: "/contact", label: "Contact" },
	];

	return (
		<>
			<button onClick={onToggle} className="navbar-btn" aria-label="メニュー">
				{isOpen ? <X size={24} /> : <Menu size={24} />}
			</button>

			{isOpen && (
				<>
					<div className="menu-overlay" onClick={onToggle} />
					<div className="menu-container">
						<nav className="menu-nav">
							{isHomePage
								? homeMenuItems.map((item) => (
										<button
											key={item.id}
											onClick={() => onNavigate(item.id)}
											className="menu-item"
										>
											{item.label}
										</button>
								  ))
								: // 他のページではページ遷移
								  pageMenuItems.map((item) => (
										<Link
											key={item.path}
											to={item.path}
											className="menu-item menu-link"
											onClick={onToggle}
										>
											{item.label}
										</Link>
								  ))}
						</nav>
					</div>
				</>
			)}
		</>
	);
};

export default Navbar;
