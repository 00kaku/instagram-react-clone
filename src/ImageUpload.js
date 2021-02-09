import React, { useState } from "react";
import { Input, Button } from "@material-ui/core";
import { storage, db } from "./firebase";
import firebase from "firebase";
import "./ImageUpload.css";

function ImageUpload({ username }) {
	const [caption, setCaption] = useState("");
	const [image, setImage] = useState(null);
	const [progress, setProgress] = useState(0);

	const handleChange = (e) => {
		if (e.target.files[0]) {
			setImage(e.target.files[0]);
		}
	};

	const handleUpload = () => {
		if (image == null) {
			alert("Choose an image to Upload");
		} else {
			const ref = storage.ref(`images/${image.name}`);
			const uploadTask = ref.put(image);
			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress = Math.round(
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100
					);
					setProgress(progress);
				},
				(error) => {
					console.log(error);
					alert(error.message);
				},
				() => {
					storage
						.ref("images")
						.child(image.name)
						.getDownloadURL()
						.then((url) => {
							db.collection("post").add({
								timestamp: firebase.firestore.FieldValue.serverTimestamp(),
								caption: caption,
								imageUrl: url,
								username: username,
							});

							setProgress(0);
							setCaption("");
							setImage(null);
						});
				}
			);
		}
	};
	return (
		<div className="imageUpload">
			<progress
				className="imageUpload__progress"
				value={progress}
				max="100"
			/>
			<Input
				type="text"
				placeholder="Enter a caption..."
				onChange={(e) => {
					setCaption(e.target.value);
				}}
				value={caption}
			/>
			<Input type="file" onChange={handleChange} />
			<Button onClick={handleUpload}>Upload</Button>
		</div>
	);
}

export default ImageUpload;
