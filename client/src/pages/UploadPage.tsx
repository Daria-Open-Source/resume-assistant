import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UploadPage.module.css';

export default function UploadPage() {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptFile = (f: File) => {
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(f.type)) {
      setError('Only PDF or DOCX files are accepted.');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError('File must be under 5 MB.');
      return;
    }
    setError('');
    setFile(f);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) acceptFile(dropped);
  }, []);

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (picked) acceptFile(picked);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim()) { setError('Please enter a target job title.'); return; }
    if (!file) { setError('Please upload your resume.'); return; }
    navigate('/analysis', { state: { file, jobTitle: jobTitle.trim() } });
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.badge}>Gap Analysis</div>
          <h1 className={styles.title}>Resume Gap Analysis</h1>
          <p className={styles.subtitle}>
            Discover what's missing between your resume and your target role,
            backed by real examples from successful candidates.
          </p>
        </div>

        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="jobTitle">
              Target job title
            </label>
            <input
              id="jobTitle"
              className={styles.input}
              type="text"
              placeholder="e.g. Software Engineer, Product Manager…"
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Resume</label>
            <div
              className={`${styles.dropzone} ${dragging ? styles.dropzoneDragging : ''} ${file ? styles.dropzoneHasFile : ''}`}
              onClick={() => inputRef.current?.click()}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                style={{ display: 'none' }}
                onChange={onFileChange}
              />
              {file ? (
                <div className={styles.fileInfo}>
                  <span className={styles.fileIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </span>
                  <div>
                    <p className={styles.fileName}>{file.name}</p>
                    <p className={styles.fileSize}>{(file.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <button
                    type="button"
                    className={styles.removeFile}
                    onClick={e => { e.stopPropagation(); setFile(null); }}
                    aria-label="Remove file"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              ) : (
                <div className={styles.dropPrompt}>
                  <span className={styles.uploadIcon}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polyline points="16 16 12 12 8 16"/>
                      <line x1="12" y1="12" x2="12" y2="21"/>
                      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                    </svg>
                  </span>
                  <p className={styles.dropText}>Drop your resume here or <span className={styles.browseLink}>browse</span></p>
                  <p className={styles.dropHint}>PDF or DOCX — max 5 MB</p>
                </div>
              )}
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submitBtn}>
            Analyze Resume
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
