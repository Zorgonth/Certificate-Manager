import React, { useState, useRef, JSX } from "react";
import axios from "axios";
import "./Create.css";

const CreateCertificate = ({ onCreate }: { onCreate: () => void }): JSX.Element => {
  const [name, setName] = useState("");
  const [provider, setProvider] = useState("");
  const [issuedAt, setIssuedAt] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
      const maxSize = 2 * 1024 * 1024; 

      if (!allowedTypes.includes(selectedFile.type)) {
        setError("Invalid file type. Only PDF, PNG, or JPEG allowed.");
        setFile(null);
        return;
      }

      if (selectedFile.size > maxSize) {
        setError("File size exceeds 2MB. Please upload a smaller file.");
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const certificateData = {
      name: name.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;"),
      provider: provider.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;"),
      issued_at: issuedAt,
      expires_at: expiresAt,
    };

    const formData = new FormData();
    formData.append("certificateData", JSON.stringify(certificateData));
    if (file) {
      formData.append("file", file);
    }

    try {
      await axios.post('/certificates/create', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      onCreate();
      setName("");
      setProvider("");
      setIssuedAt("");
      setExpiresAt("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = ""; 
      setError("");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || "Network error. Please try again later.");
      } else {
        setError("Unknown error occurred.");
      }
    }
  };

  return (
    <div className="create-certificate-container">
      <div className="create-certificate">
        {error && <div className="error-message">{error}</div>}
        <h3>Upload Your Certificate</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Certificate Name</label>
            <input type="text" id="name" value={name} onChange={(e) : void => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="provider">Provider</label>
            <input type="text" id="provider" value={provider} onChange={(e) : void => setProvider(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="issuedAt">Issue Date</label>
            <input type="date" id="issuedAt" value={issuedAt} onChange={(e) : void => setIssuedAt(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="expiresAt">Expiry Date (optional)</label>
            <input type="date" id="expiresAt" value={expiresAt} onChange={(e) : void => setExpiresAt(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="file">Certificate File (PDF, PNG, JPEG)</label>
            <input type="file" id="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg" required />
          </div>
          <button type="submit">Create Certificate</button>
        </form>
      </div>
    </div>
  );
};

export default CreateCertificate;
