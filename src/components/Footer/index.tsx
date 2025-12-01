import "./style.css";

const Footer = () => {
	const snsBubbles = [
		{ id: 1, label: "Github", link: "https://github.com/morikouuu" },
		{
			id: 2,
			label: "X",
			link: "https://x.com/ilike_lamb?t=Lmu7FrE60JIyM9wmEbS1fA&s=09",
		},
	];

	const currentYear = new Date().getFullYear();

	return (
		<footer className="footer">
			<div className="footer-content">
				<p className="footer-copyright">
					© {currentYear} morikouuu. All rights reserved.
				</p>
				<div className="footer-links">
					{snsBubbles.map((sns) => (
						<a
							key={sns.id}
							href={sns.link}
							target="_blank"
							rel="noopener noreferrer"
							className="footer-link"
						>
							{sns.label}
						</a>
					))}
				</div>
			</div>
		</footer>
	);
};

export default Footer;
