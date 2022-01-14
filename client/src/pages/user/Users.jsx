import { useEffect, useState } from "react";
import Avatar from '../../components/ui/Avatar';

import { PF } from '../../Constants';
import axios from "axios";
import LoadingOverlay from 'react-loading-overlay';
import { Link, useLocation } from 'react-router-dom';
import './users.css'
import { toast } from "react-toastify";

const Users = () => {

    const [users, setUsers] = useState([]);
    const { search } = useLocation();

    const [loading, setLoading] = useState(true);

    const location = useLocation();

    const search_query = new URLSearchParams(search);
    var page = search_query.get('page');

    if (!page) {
        page = 1;
    }

    const fetchUsers = async () => {
        setLoading(true);
        const res = await axios.get("/users" + search);
        setUsers(res.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
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
            <div className="header">
                <div className="headerTitles">
                    <span className="headerTitleLg">Danh sách người dùng</span>
                </div>
            </div>

            <div className="home">

                {
                    !users.length && <img style={{
                        width: 400,
                        margin: 'auto'
                    }} src='/images/empty.png' />
                }

                <div>

                </div>

                <table className='users-table'>
                    <thead>
                        <td>Người dùng</td>
                        <td>Admin</td>
                    </thead>
                    <tbody>
                        {
                            users.map(user => <UserItem key={user._id} user={user} setLoading={setLoading} fetchUsers={fetchUsers}/>)
                        }
                    </tbody>
                </table>


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
    )
}


export default Users;


const UserItem = ({ user, setLoading, fetchUsers }) => {

    const role = user.role ? user.role : 0;

    const onToggleRole = async () => {
        console.log('aaa')
        setLoading(true);
        const res = await axios.post("/users/toggle.role", {
            id: user._id
        });

        await fetchUsers();

        toast.success('Cập nhật thành công')

        setLoading(false);
    }

    return (
        <tr className='user-item'>
            <td>
                <div className='user-info'>
                    <img className='user-avatar' src={PF + user.user_avatar}></img>
                    <div className='user-name'>{user.user_username}</div>
                </div>

            </td>
            <td>
                <div class='user-role'>
                    <input type='checkbox' onChange={onToggleRole} defaultChecked={!!role} />
                </div>

            </td>

        </tr>
    )
}