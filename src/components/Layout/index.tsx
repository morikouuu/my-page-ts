import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar/index";
import Footer from "../Footer/index.tsx";
import "./style.css";

const Layout = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const location = useLocation();

	const handleNavigate = (sectionId: string) => {
		// Homeページの場合のみスムーズスクロール
		if (location.pathname === "/") {
			const element = document.getElementById(sectionId);
			element?.scrollIntoView({ behavior: "smooth" });
		}
		setIsMenuOpen(false);
	};

	return (
		<div className="layout-container">
			<Navbar
				isOpen={isMenuOpen}
				onToggle={() => setIsMenuOpen(!isMenuOpen)}
				onNavigate={handleNavigate}
			/>
			<main>
				<Outlet />
			</main>
			<Footer />
		</div>
	);
};

export default Layout;
