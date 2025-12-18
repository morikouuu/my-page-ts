import { Link } from "react-router-dom";
import "./style.css";

const Profile = () => {
	window.scrollTo({ top: 0, behavior: "instant" });

	return (
		<div className="profile-container">
			<div className="profile-header">
				<h1 className="profile-title">Profile</h1>
				<Link to="/" className="back-link">
					← ホームに戻る
				</Link>
			</div>
			<div className="profile-content">
				<div className="profile-image-container">
					<img
						src="/images/profile.png"
						alt="profile画像"
						className="profile-image"
					/>
				</div>
				<div className="profile-text-wrapper">
					<p className="profile-text">
						初めまして。私は「作ったものが形になること」が楽しくてコーディングを始めました。
						<br />
						まだまだ作品は少ないのですが、少しずつ自分らしいポートフォリオに育てていけたらと思っています。
					</p>
					<p className="profile-text">
						現在は <strong>React</strong> を中心に学習中で、
						<strong>モバイルアプリの開発</strong>にも挑戦しています。
						将来はフロントエンドエンジニアとして働くことが目標です。
					</p>
					<p className="profile-text">
						「ずっと真夜中でいいのに。」が好きで、このページもずとまよのHPを一部参考にして作成しました。
					</p>
				</div>
			</div>
		</div>
	);
};

export default Profile;
