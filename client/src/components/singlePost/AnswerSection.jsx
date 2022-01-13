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
                            <i className="writeIcon fas fa-plus"></i>
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
                    props.answers.map(answer => (
                        <React.Fragment>
                            <div className="singleAnswer">
                                <div className="singleAnswerInfo">
                                    <span className="singlePostAuthor">
                                        <Avatar src={answer.user_avatar}/>
                                        <Link to={`/?user=${answer.username}`} className="link">
                                            <b> {answer.username}</b>
                                        </Link>
                                        &nbsp;
                                        trả lời lúc {`${new Date(answer.createdAt).getHours()}:${new Date(answer.createdAt).getMinutes()} ${new Date(answer.createdAt).getDate()}/${new Date(answer.createdAt).getMonth()}/${new Date(answer.createdAt).getFullYear()}`}
                                    </span>
                                </div>
                                {answer.photo && (
                                    <img src={PF + answer.photo} alt="" className="singleAnswerImg" />

                                )}
                                <p className="singleAnswerDesc">{answer.desc}</p>
                            </div>
                        </React.Fragment>
                    ))
                }
            </div>
        </>
    );
}
