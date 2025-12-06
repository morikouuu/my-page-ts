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
				<div className="profile-info-container">
					<p className="description">
						初めまして。私は作ったものが形になりることが楽しくてコーディングを始めました。
						まだまだ作品は少ないのですが、少しずつ自分らしいポートフォリオに育てていけたらと思っています。
						今はreactを学んでいます。またmobileアプリの開発もしています。
						将来はフロントエンドエンジニアとして働きたいと思っています。
						「ずっと真夜中でいいのに」が好きでこのページもずとまよのホームページを一部参考にして作りました。
					</p>
				</div>
			</div>
		</div>
	);
};

export default Profile;

