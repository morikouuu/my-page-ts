import "./style.css";
import { Github, Twitter } from "lucide-react";

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="footer">
			<div className="footer-content">
				<p className="footer-copyright">
					© {currentYear} morikouuu. All rights reserved.
				</p>
				<div className="footer-links">
					<a href="https://github.com/morikouuu">
						<Github size={24} />
					</a>
					<a href="https://x.com/ilike_lamb?t=Lmu7FrE60JIyM9wmEbS1fA&s=09">
						<Twitter size={24} />
					</a>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
