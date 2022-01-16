import { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import Posts from "../../components/posts/Posts";
import Sidebar from "../../components/sidebar/Sidebar";
import "./home.css";
import axios from "axios";
import LoadingOverlay from 'react-loading-overlay';
import { Link, useLocation, useHistory } from 'react-router-dom';

export default function Home() {

	const [posts, setPosts] = useState([]);
	const { search } = useLocation();
	const history = useHistory();

	const [loading, setLoading] = useState(true);
	const [search_str, setSearch] = useState('');


	const location = useLocation();

	const search_query = new URLSearchParams(search);
	var page = search_query.get('page');

	if (!page) {
		page = 1;
	}

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
				<div>
					<input placeholder="Tìm kiếm câu hỏi" className="search"
						onChange={(e) => setSearch(e.target.value)}
						onKeyDown={(e) => {
							if (e.key == 'Enter') {
								history.push(`?page=${page}&q=${search_str}`);
							}

						}} />
				</div>
				{
					!posts.length && <img style={{
						width: 400,
						margin: 'auto'
					}} src='/images/empty.png' />
				}

				<Posts posts={posts} />

				<div className='pagination'>
					<Link className="paginate" to={`?page=${Math.max(page - 1, 0)}`}>
						&larr;
					</Link>
					&nbsp;
					Trang {page}
					&nbsp;
					<Link className="paginate" to={`?page=${Number(page) + 1}`}>
						&rarr;
					</Link>
				</div>
			</div>


		</>
	);
}
