import { useContext, useState } from "react";
import "./write.css";
import axios from "axios";
import { Context } from "../../context/Context";

export default function Write() {
	const [title, setTitle] = useState("");
	const [desc, setDesc] = useState("");
	const [file, setFile] = useState(null);
	const { user } = useContext(Context);

	console.log('user', user);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const newPost = {
			username: user.username,
			title,
			desc,
		};
		if (file) {
			const data = new FormData();
			const filename = Date.now() + file.name;
			data.append("name", filename);
			data.append("file", file);
			newPost.photo = filename;
			try {
				await axios.post("/upload", data);
			} catch (err) { }
		}
		try {
			const res = await axios.post("/posts", newPost);
			window.location.replace("/post/" + res.data._id);
		} catch (err) { }
	};
	return (
		<div className="write">
			{file && (
				<img className="writeImg" src={URL.createObjectURL(file)} alt="" />
			)}
			<form className="writeForm" onSubmit={handleSubmit}>
				<div className="writeFormGroup">
					<label htmlFor="fileInput" title='Đăng ảnh'>
						<i className="writeIcon fas fa-plus"></i>
					</label>
					<input
						type="file"
						id="fileInput"
						style={{ display: "none" }}
						onChange={(e) => setFile(e.target.files[0])}
					/>
					<input
						type="text"
						placeholder="Tên câu hỏi"
						className="writeInput"
						autoFocus={true}
						onChange={e => setTitle(e.target.value)}
					/>
				</div>
				<div className="writeFormGroup">
					<textarea
						placeholder="Nội dung câu hỏi của bạn..."
						type="text"
						className="writeInput writeText"
						onChange={e => setDesc(e.target.value)}
					></textarea>
				</div>
				<button className="writeSubmit" type="submit">
					Đăng câu hỏi
				</button>
			</form>
		</div>
	);
}
