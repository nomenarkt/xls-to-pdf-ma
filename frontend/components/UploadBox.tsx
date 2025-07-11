import React, { useState, useCallback, DragEvent } from "react";

export interface UploadBoxProps {
  onUpload: (file: File) => void;
}

export const UploadBox: React.FC<UploadBoxProps> = ({ onUpload }) => {
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files && files[0];
      if (!file) return;
      if (!file.name.endsWith(".xls")) {
        setError("Only .xls files are allowed");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File exceeds 5MB");
        return;
      }
      setError("");
      setFileName(file.name);
      onUpload(file);
    },
    [onUpload],
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div>
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="border-2 border-dashed rounded p-4 text-center cursor-pointer"
      >
        <label className="block">
          <input
            data-testid="file-input"
            type="file"
            accept=".xls"
            className="hidden"
            onChange={onChange}
          />
          <span>Drag & drop or click to upload</span>
        </label>
      </div>
      {fileName && <p className="mt-2">{fileName}</p>}
      {error && (
        <p role="alert" className="mt-2 text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};
