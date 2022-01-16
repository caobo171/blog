import { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";
import "./topbar.css";

export default function TopBar() {

	const { user, dispatch } = useContext(Context);
	const PF = "http://localhost:5000/images/"

	const handleLogout = () => {
		dispatch({ type: "LOGOUT" });
	};

	return (
		<div className="top">
			<div className="topLeft">
				<ul className="topList">
					<li className="topListItem">
						<Link className="link" to="/">
							HOME
						</Link>
					</li>
					<li className="topListItem">
						<Link className="link" to="/ask">
							HỎI
						</Link>
					</li>
					{user && user.role && parseInt(user.role) && <li className="topListItem">
						<Link className="link admin-item" to="/admin">
							Admin
						</Link>
					</li>}
					<li className="topListItem" onClick={handleLogout}>
						{user && "LOGOUT"}
					</li>
				</ul>
			</div>
			<div className="topCenter">

			</div>
			<div className="topRight">
				{user ? (
					<ul className="topList">
						<Link className='topListItem' to="/settings">
							<img className="topImg" src={PF + user.profilePic} alt="" />
						</Link>
						<Link to={`/user/${user.username}`} className="link topName">
							{user.username}
						</Link>
					</ul>
				) : (
					<ul className="topList">
						<li className="topListItem">
							<Link className="link" to="/login">
								LOGIN
							</Link>
						</li>
						<li className="topListItem">
							<Link className="link" to="/register">
								REGISTER
							</Link>
						</li>
					</ul>
				)}
			</div>
		</div>
	);
}
