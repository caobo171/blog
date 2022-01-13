import { useLocation } from "react-router-dom";
import Post from "../post/Post";
import {Link} from 'react-router-dom';
import "./posts.css";

export default function Posts({ posts }) {


	return (
		<div className="posts">
			{posts.map((p) => (
				<Post key={p._id} post={p} />
			))}
		</div>
	);
}
