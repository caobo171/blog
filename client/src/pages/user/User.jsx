import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";
import { PF } from '../../Constants';
import { toast } from 'react-toastify';
import Avatar from '../../components/ui/Avatar';
import LoadingOverlay from 'react-loading-overlay';
import Posts from '../../components/posts/Posts';
import "./userProfile.css";

export default function SinglePost() {

    const location = useLocation();
    const path = location.pathname.split("/")[2];
    const [user, setUser] = useState();
    const [posts, setPosts] = useState([]);

    const [loading, setLoading] = useState(true);

    const getPost = async () => {
        const res = await axios.get("/users/profile/" + path);

        setUser(res.data.user);
        setPosts(res.data.posts);
        setLoading(false);
    };

    useEffect(() => {
        getPost();
    }, [path]);



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

            {!loading && (
                <div className='user-profile'>
                    <div className='user-header'>

                        <img className='user-avatar' src={PF + user.user_avatar}></img>
                        <div className='user-info'>
                            <div className='username'>
                                <b>{user.username}</b>
                            </div>
                            <div className='date'>
                                Tham gia ngày {` ${new Date(user.createdAt).getDate()}/${new Date(user.createdAt).getMonth()}/${new Date(user.createdAt).getFullYear()}`}
                            </div>
                        </div>
                    </div>
                    <div className="header">
                        <div className="headerTitles">
                            <span className="headerTitleLg">Câu hỏi</span>
                        </div>
                    </div>
                    {
                        !posts.length && <img style={{
                            width: 400,
                            margin: 'auto'
                        }} src='/images/empty.png' />
                    }

                    <Posts posts={posts} />
                </div>
            )}


        </>
    );
}
