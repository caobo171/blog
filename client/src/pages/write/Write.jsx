import { useContext, useState } from "react";
import "./write.css";
import axios from "axios";
import { Context } from "../../context/Context";
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';

export default function Write() {
	const [title, setTitle] = useState("");
	const [desc, setDesc] = useState("");
	const [file, setFile] = useState(null);
	const { user } = useContext(Context);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		setLoading(true);
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
			toast.success('Tạo câu hỏi thành công')
			window.location.replace("/post/" + res.data._id);
		} catch (err) { }

		setLoading(false);
	};
	return (
		<div className="write">
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
			{file && (
				<img className="writeImg" src={URL.createObjectURL(file)} alt="" />
			)}
			<form className="writeForm" onSubmit={handleSubmit}>
				<div className="writeFormGroup">
					<label htmlFor="fileInput" title='Đăng ảnh'>
						<i className="writeIcon fas fa-image"></i>
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
