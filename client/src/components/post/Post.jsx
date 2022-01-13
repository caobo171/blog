import "./post.css";
import { Link } from "react-router-dom";
import { PF } from '../../Constants';
import Avatar from '../ui/Avatar'

export default function Post({ post }) {

	return (
		<Link to={`/post/${post._id}`} className="post" >

			{post.photo ? <img className="postImg" src={PF + post.photo} alt="" /> :

				<img className="postImg" src={`/images/questions-and-answers.webp`} alt="" />
			}
			<div className="postInfo">
				<div className="postCats">
					{post.categories.map((c) => (
						<span className="postCat">{c.name}</span>
					))}
				</div>
				<div>
					<span className="postTitle">{post.title}</span>
				</div>
				<p className="postDesc">{post.desc}</p>
				<div className="postDate">
					<Avatar src={post.user_avatar}/> <b>{post.username}</b> đã hỏi vào lúc &nbsp;{`${new Date(post.createdAt).getHours()}:${new Date(post.createdAt).getMinutes()} ${new Date(post.createdAt).getDate()}/${new Date(post.createdAt).getMonth()}/${new Date(post.createdAt).getFullYear()}`}
				</div>
			</div>

		</Link>
	);
}
