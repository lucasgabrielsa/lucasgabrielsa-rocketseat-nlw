import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import "./styles.css";
import { FiUpload } from "react-icons/fi";

interface DropZoneProps {
  onFileUploaded: (file: File) => void;
}

const Dropzone: React.FC<DropZoneProps> = ({ onFileUploaded }) => {
  const [selectedFileUrl, setSelectedFileUrl] = useState("");

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const fileUrl = URL.createObjectURL(file);
      setSelectedFileUrl(fileUrl);
      onFileUploaded(file);
    },
    [onFileUploaded]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />

      {selectedFileUrl ? (
        <img src={selectedFileUrl} alt="Point thumbnail" />
      ) : (
        <p>
          <FiUpload />
          Coloque a imagem do estabelecimento.
        </p>
      )}
    </div>
  );
};

export default Dropzone;
