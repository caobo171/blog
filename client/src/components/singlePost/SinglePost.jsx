import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";
import { PF } from '../../Constants';
import AnswerSection from './AnswerSection';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';
import "./singlePost.css";

export default function SinglePost() {

	const location = useLocation();
	const path = location.pathname.split("/")[2];
	const [post, setPost] = useState({});
	const [answers, setAnswers] = useState([]);
	const { user } = useContext(Context);
	const [title, setTitle] = useState("");
	const [desc, setDesc] = useState("");
	const [updateMode, setUpdateMode] = useState(false);

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getPost = async () => {

			const res = await axios.get("/posts/" + path);
			setPost(res.data.post);
			setTitle(res.data.post.title);
			setDesc(res.data.post.desc);
			setAnswers(res.data.answers);
			setLoading(false);
		};
		getPost();
	}, [path]);

	const handleDelete = async () => {
		try {
			setLoading(true);
			await axios.delete(`/posts/${post._id}`, {
				data: { username: user.username },
			});

			toast.success("Xoá câu hỏi thành công");
			setLoading(false);
			window.location.replace("/");
		} catch (err) { }
	};

	const handleUpdate = async () => {
		try {
			setLoading(true);
			await axios.put(`/posts/${post._id}`, {
				username: user.username,
				title,
				desc,
			});

			toast.success("Cập nhật câu hỏi thành công");
			setUpdateMode(false)
			setLoading(false);
		} catch (err) { }
	};


	return (
		<>
			<LoadingOverlay
				styles={{
					wrapper: {
						position: loading ? 'fixed' : 'relative',
						top: 0,
						left: 0,
						bottom: 0, 
						right: 0,
						zIndex: 100
					}
				}}
				active={loading}
				spinner
				text='Đang xử lý...'
			>
			</LoadingOverlay>
			<div className="singlePost">

				<div className="singlePostWrapper">
					<Link className="singlePostBack" to='/'>
						&larr;
					</Link>
					{updateMode ? (
						<input
							type="text"
							value={title}
							className="singlePostTitleInput"
							autoFocus
							onChange={(e) => setTitle(e.target.value)}
						/>
					) : (
						<h1 className="singlePostTitle">
							{title}
							{post.username === user?.username && (
								<div className="singlePostEdit">
									<i
										className="singlePostIcon far fa-edit"
										onClick={() => setUpdateMode(true)}
									></i>
									<i
										className="singlePostIcon far fa-trash-alt"
										onClick={handleDelete}
									></i>
								</div>
							)}
						</h1>
					)}
					<div className="singlePostInfo">
						<span className="singlePostAuthor">
							Hỏi bởi
							<Link to={`/?user=${post.username}`} className="link">
								<b> {post.username}</b>
							</Link>
							&nbsp;
							vào lúc &nbsp;{`${new Date(post.createdAt).getHours()}:${new Date(post.createdAt).getMinutes()} ${new Date(post.createdAt).getDate()}/${new Date(post.createdAt).getMonth()}/${new Date(post.createdAt).getFullYear()}`}
						</span>
					</div>
					{post.photo && (
						<img src={PF + post.photo} alt="" className="singlePostImg" />
					)}
					{updateMode ? (
						<textarea
							className="singlePostDescInput"
							value={desc}
							onChange={(e) => setDesc(e.target.value)}
						/>
					) : (
						<p className="singlePostDesc">{desc}</p>
					)}
					{updateMode && (
						<button className="singlePostButton" onClick={handleUpdate}>
							Cập nhật
						</button>
					)}


					{!updateMode && post && Object.keys(post).length && <><AnswerSection answers={answers} question={post} /></>}
				</div>
			</div>
		</>
	);
}
