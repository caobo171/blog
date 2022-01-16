import React, { useContext, useState } from "react";
import "./answer.css";
import axios from "axios";
import { Context } from "../../context/Context";
import { Link } from "react-router-dom";
import { PF } from '../../Constants';
import { toast } from "react-toastify";
import LoadingOverlay from 'react-loading-overlay';
import Avatar from '../../components/ui/Avatar';

export default function AnswerSection(props) {

    const [desc, setDesc] = useState("");
    const [file, setFile] = useState(null);
    const { user } = useContext(Context);
    const [loading, setLoading] = useState(false);


    const onAccept = async (answer_id) => {
        setLoading(true);
        const res = await axios.post("/answers/accept", {
            answer_id: answer_id
        });

        toast.success('Chấp nhận câu trả lời thành công');
        props.getPost();
        setLoading(false);
    }

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        const answer = {
            username: user.username,
            desc,
            question_id: props.question._id
        };
        if (file) {
            const data = new FormData();
            const filename = Date.now() + file.name;
            data.append("name", filename);
            data.append("file", file);
            answer.photo = filename;
            try {
                await axios.post("/upload", data);
            } catch (err) { }
        }
        try {
            const res = await axios.post("/answers", answer);
            toast.success("Trả lời thành công");

            window.location.reload();
        } catch (err) { }

        setLoading(false);
    };

    if (!props.question) {
        return "Trang không tìm thấy"
    }

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
            <div className="answer">
                <h3 className='answerTitle'>Trả lời</h3>
                {file && (
                    <img className="answerImg" src={URL.createObjectURL(file)} alt="" />
                )}
                <form className="writeForm" onSubmit={handleSubmit}>
                    <div className="answerFormGroup">
                        <label htmlFor="fileInput" title='Đăng ảnh'>
                            <i className="writeIcon fas fa-image"></i>
                        </label>
                        <input
                            type="file"
                            id="fileInput"
                            style={{ display: "none" }}
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                        <textarea
                            placeholder="Câu trả lời của bạn..."
                            type="text"
                            className="askInput answerText"
                            onChange={e => setDesc(e.target.value)}
                        ></textarea>
                    </div>
                    <button className="answerSubmit" type="submit">
                        Trả lời
                    </button>
                </form>

                {
                    props.answers.map(answer => {

                        var accepted = props.question.answer_accept && props.question.answer_accept.id == answer._id;
                        return <React.Fragment key={answer._id}>
                            <div className={`singleAnswer ${accepted ? 'accepted' : ''}`}>

                                {user.username == props.question.username || (user.role && parseInt(user.role)) && (
                                    <div className="accept" title='Chấp nhận câu trả lời này'>
                                        <i className="fa fa-check" onClick={() => onAccept(answer._id)}></i>
                                    </div>
                                )}

                                <div className="singleAnswerInfo">
                                    <span className="singlePostAuthor">
                                        <Avatar src={answer.user_avatar} />
                                        <Link to={`/user/${answer.username}`} className="link">
                                            <b> {answer.username}</b>
                                        </Link>
                                        &nbsp;
                                        trả lời lúc {`${new Date(answer.createdAt).getHours()}:${new Date(answer.createdAt).getMinutes()} ${new Date(answer.createdAt).getDate()}/${new Date(answer.createdAt).getMonth()}/${new Date(answer.createdAt).getFullYear()}`}
                                        {
                                            accepted && (
                                                <>&nbsp;&middot;&nbsp;<span className="accept_string">Đã được chấp nhận</span></>
                                            )
                                        }
                                    </span>
                                </div>
                                {answer.photo && (
                                    <img src={PF + answer.photo} alt="" className="singleAnswerImg" />

                                )}
                                <p className="singleAnswerDesc">{answer.desc}</p>
                            </div>
                        </React.Fragment>
                    })
                }
            </div>
        </>
    );
}

