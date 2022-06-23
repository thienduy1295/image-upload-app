import React, { useCallback, useState } from "react";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "./app/config";
import { useDropzone } from "react-dropzone";
import { Image } from "cloudinary-react";
import "./App.css";
import CopyToClipboard from "react-copy-to-clipboard";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

    acceptedFiles.forEach(async (acceptedFile) => {
      const formData = new FormData();
      formData.append("file", acceptedFile);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      setLoading(true);

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log(data);
      setUploadedFiles((old) => [...old, data]);

      setLoading(false);
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
  });

  return (
    <div>
      <h1>Upload Image</h1>
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "active" : null}`}
      >
        <input {...getInputProps()} />
        Drop Zone
      </div>
      {loading ? (
        <h3>Loading...</h3>
      ) : (
        <ul>
          {uploadedFiles.map((file) => (
            <li key={file.public_id}>
              <Image
                cloudName="duy-cloudinary"
                publicId={file.public_id}
                width="300"
                crop="scale"
              />
              <CopyToClipboard text={file.secure_url}>
                <button>Copy to clipboard</button>
              </CopyToClipboard>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
