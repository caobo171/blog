import { useContext, useState } from "react";
import "./answer.css";
import axios from "axios";
import { Context } from "../../context/Context";

export default function AnswerSection() {

    const [desc, setDesc] = useState("");
    const [file, setFile] = useState(null);
    const { user } = useContext(Context);

    const handleSubmit = async (e) => {

        e.preventDefault();
        const answer = {
            username: user.username,
            desc,
        };
        if (file) {
            const data = new FormData();
            const filename = Date.now() + file.name;
            data.append("name", filename);
            data.append("file", file);
            answer.photo = filename;
            try {
                await axios.post("/answers.upload", data);
            } catch (err) { }
        }
        try {
            const res = await axios.post("/answers", answer);
        } catch (err) { }
    };

    return (
        <>

            <div className="answer">
                <h3 style={{marginBottom: 20}}>Trả lời</h3>
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
                            className="writeInput writeText"
                            onChange={e => setDesc(e.target.value)}
                        ></textarea>
                    </div>
                    <button className="writeSubmit" type="submit">
                        Trả lời
                    </button>
                </form>
            </div>
        </>
    );
}
