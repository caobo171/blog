import { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import Posts from "../../components/posts/Posts";
import Sidebar from "../../components/sidebar/Sidebar";
import "./home.css";
import axios from "axios";
import { useLocation } from "react-router";
import LoadingOverlay from 'react-loading-overlay';

export default function Home() {
	const [posts, setPosts] = useState([]);
	const { search } = useLocation();

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		const fetchPosts = async () => {
			const res = await axios.get("/posts" + search);
			setPosts(res.data);
			setLoading(false);
		};
		fetchPosts();

	}, [search]);


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
			<Header />

			<div className="home">
				<Posts posts={posts} />
			</div>
		</>
	);
}
