import React, { useState } from 'react';
import axios from '../api';
import FileListDisplay from '../components/FileListDisplay';
import ResultsTable from '../components/ResultsTable';

export default function UploadMatchPage({ setLoading, uploadSubTab, setUploadSubTab, uploadResults, setUploadResults, loading }) {
  const [uploadFiles, setUploadFiles] = useState(null);
  const [mode, setMode] = useState('text');
  const [jdText, setJdText] = useState('');
  const [jdFile, setJdFile] = useState(null);
  const [topK, setTopK] = useState(5);
  const [message, setMessage] = useState({ type: '', text: '' });

  const MAX_FILE_SIZE_MB = 5;
  const ALLOWED_RESUME_TYPES = ['application/pdf'];
  const ALLOWED_JD_TYPES = ['application/pdf', 'text/plain'];

  const handleTabChange = (tab) => {
    if (loading) return;
    setUploadSubTab(tab);
    setUploadResults(prev => ({ ...prev, [tab]: [] }));
    setMessage({ type: '', text: '' });
  };

  const validateFiles = (files) => {
    const seen = new Set();
    for (let file of files) {
      if (!ALLOWED_RESUME_TYPES.includes(file.type)) {
        setMessage({ type: 'error', text: `Unsupported file type: ${file.name}` });
        return false;
      }
      if (file.size === 0) {
        setMessage({ type: 'error', text: `File is empty: ${file.name}` });
        return false;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setMessage({ type: 'error', text: `File too large: ${file.name} (max ${MAX_FILE_SIZE_MB}MB)` });
        return false;
      }
      if (seen.has(file.name)) {
        setMessage({ type: 'error', text: `Duplicate file: ${file.name}` });
        return false;
      }
      seen.add(file.name);
    }
    return true;
  };

  const handleUploadChange = (e) => {
    const files = Array.from(e.target.files);
    if (validateFiles(files)) {
      setUploadFiles(files);
      setMessage({ type: '', text: '' });
    } else {
      e.target.value = null;
      setUploadFiles(null);
    }
  };

  const handleJDFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !ALLOWED_JD_TYPES.includes(file.type)) {
      setMessage({ type: 'error', text: `Unsupported JD file type: ${file.name}` });
      e.target.value = null;
      return;
    }
    if (file && file.size === 0) {
      setMessage({ type: 'error', text: `JD file is empty: ${file.name}` });
      e.target.value = null;
      return;
    }
    if (file && file.size > 1 * 1024 * 1024) {
      setMessage({ type: 'error', text: `JD file too large: ${file.name} (max 1MB)` });
      e.target.value = null;
      return;
    }
    setJdFile(file);
    setMessage({ type: '', text: '' });
  };

  const handleUpload = async () => {
    if (!uploadFiles || uploadFiles.length === 0) {
      setMessage({ type: 'error', text: 'Please select valid resume files.' });
      return;
    }

    const form = new FormData();
    uploadFiles.forEach(f => form.append('files', f));

    setUploadResults(prev => ({ ...prev, upload: [] }));
    setLoading(true);
    setMessage({ type: 'info', text: 'Uploading resumes...' });

    try {
      const { data } = await axios.post('/upload/', form);
      setUploadResults(prev => ({ ...prev, upload: data.matches }));
      setMessage({ type: 'success', text: 'Upload successful!' });
    } catch {
      setMessage({ type: 'error', text: 'Upload failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleMatch = async () => {
    if (mode === 'text' && !jdText.trim()) {
      setMessage({ type: 'error', text: 'Please enter job description text.' });
      return;
    }
    if (mode === 'pdf' && !jdFile) {
      setMessage({ type: 'error', text: 'Please select a JD file.' });
      return;
    }

    const form = new FormData();
    form.append('mode', mode);
    form.append('top_k', parseInt(topK) || 5);
    if (mode === 'text') form.append('text', jdText);
    else form.append('file', jdFile);

    setUploadResults(prev => ({ ...prev, match: [] }));
    setLoading(true);
    setMessage({ type: 'info', text: 'Matching resumes to JD...' });

    try {
      const { data } = await axios.post('/match/', form);
      setUploadResults(prev => ({ ...prev, match: data.matches }));
      setMessage({ type: 'success', text: 'Matching completed!' });
    } catch {
      setMessage({ type: 'error', text: 'Match failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-content">
      <div className="sub-tab-buttons">
        <button onClick={() => handleTabChange('upload')} disabled={loading} className={`sub-tab-upload ${uploadSubTab === 'upload' ? 'primary-btn' : ''}`}>
          Upload Resumes
        </button>
        <button onClick={() => handleTabChange('match')} disabled={loading} className={`sub-tab-match ${uploadSubTab === 'match' ? 'primary-btn' : ''}`}>
          Match to JD
        </button>
      </div>

      {message.text && (
        <div className={`banner ${message.type}`}>
          {message.text}
        </div>
      )}

      {uploadSubTab === 'upload' && (
        <div className="form-group">
  <label>Resume PDFs:</label>

  <div className="upload-controls">
    <label className="custom-file-upload">
      📁 Choose Resume PDFs
      <input type="file" multiple accept=".pdf" onChange={handleUploadChange} />
    </label>

    <button onClick={handleUpload} className="primary-action-button">
      Upload
    </button>
  </div>

  <FileListDisplay files={uploadFiles} />
</div>
      )}

      {uploadSubTab === 'match' && (
        <>
          <div className="form-group">
            <label>Job Description:</label>
            <div className="flex-row">
              <select value={mode} onChange={e => setMode(e.target.value)} className="input">
                <option value="text">Text</option>
                <option value="pdf">PDF</option>
              </select>
              {mode === 'text' ? (
                <textarea value={jdText} onChange={e => setJdText(e.target.value)} placeholder="Paste JD here..." rows={6} className="input" />
              ) : (
                <input type="file" accept=".pdf,.txt" onChange={handleJDFileChange} className="input" />
              )}
            </div>
          </div>
          <div className="form-group">
            <label>Select how many top resumes you want to compare with the job description.</label>
            <input type="number" min="1" max="100" value={topK} onChange={e => setTopK(e.target.value)} className="input small-input" />
          </div>
          <button onClick={handleMatch} className="primary-btn">Match</button>
        </>
      )}

      {!loading && uploadResults[uploadSubTab]?.length > 0 && (
        <ResultsTable results={uploadResults[uploadSubTab]} />
      )}
    </div>
  );
}
