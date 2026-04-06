import { useRef, useState } from 'react'
import type { OnboardingData } from '../App'
import { StepHeading, NavRow } from '../components/UI'
import styles from '../styles/onboarding.module.css'
 
interface Props {
  data: OnboardingData
  update: (p: Partial<OnboardingData>) => void
  next: () => void
  back: () => void
}
 
export default function StepUploadResume({ data, update, next, back }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')
 
  const handleFile = (file: File) => {
    if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      setError('Please upload a PDF or DOCX file.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File must be under 5 MB.')
      return
    }
    setError('')
    update({ resumeFile: file })
  }
 
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }
 
  const handleNext = () => {
    if (!data.resumeFile) {
      setError('Please upload your resume to continue.')
      return
    }
    next()
  }
 
  return (
    <div>
      <StepHeading
        title="Upload your resume."
        subtitle="We'll parse it automatically to pre-fill your profile and tailor suggestions."
      />
 
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        style={{ display: 'none' }}
        onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
      />
 
      {/* Drop zone */}
      <div
        className={`${styles.dropZone} ${dragOver ? styles.dragOver : ''} ${data.resumeFile ? styles.hasFile : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        {data.resumeFile ? (
          <div className={styles.filePreview}>
            <span className={styles.fileIcon}>📄</span>
            <div>
              <p className={styles.fileName}>{data.resumeFile.name}</p>
              <p className={styles.fileSize}>{(data.resumeFile.size / 1024).toFixed(0)} KB — click to replace</p>
            </div>
            <button
              className={styles.removeFile}
              onClick={e => { e.stopPropagation(); update({ resumeFile: null }) }}
            >✕</button>
          </div>
        ) : (
          <div className={styles.dropContent}>
            <div className={styles.uploadIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <p className={styles.dropMain}>Drop your resume here</p>
            <p className={styles.dropSub}>or <span className={styles.dropLink}>browse files</span> — PDF or DOCX, up to 5 MB</p>
          </div>
        )}
      </div>
 
      {error && <p className={styles.uploadError}>{error}</p>}
 
      <div className={styles.skipRow}>
        <button className={styles.skipBtn} onClick={next}>Skip for now →</button>
      </div>
 
      <NavRow onBack={back} onNext={handleNext} nextLabel="Set Preferences →" />
    </div>
  )
}
 