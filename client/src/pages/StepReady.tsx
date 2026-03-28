import type { OnboardingData } from '../App'
import { Button } from '../components/UI'
import styles from '../styles/onboarding.module.css'
 
interface Props {
  data: OnboardingData
  update: (p: Partial<OnboardingData>) => void
  next: () => void
  back: () => void
}
 
export default function StepReady({ data, back }: Props) {
  const summaryItems = [
    { label: 'Name', value: `${data.firstName} ${data.lastName}`.trim() || '—' },
    { label: 'Email', value: data.email || '—' },
    { label: 'Field', value: data.role.join(', ') || '—' },
    { label: 'Resume', value: data.resumeFile ? data.resumeFile.name : 'Not uploaded' },
    { label: 'Target roles', value: data.targetRoles || '—' },
    { label: 'Work style', value: data.workStyle || '—' },
  ]
 
  return (
    <div className={styles.readyPage}>
      <div className={styles.readyBadge}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="var(--rpi-red)" fillOpacity="0.12"/>
          <path d="M10 16l4 4 8-8" stroke="var(--rpi-red)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
 
      <h1 className={styles.readyTitle}>You're all set, {data.firstName || 'there'}!</h1>
      <p className={styles.readySubtitle}>
        Your Resume Assistant is configured. Here's a quick summary before you dive in.
      </p>
 
      <div className={styles.summaryCard}>
        {summaryItems.map(item => (
          <div key={item.label} className={styles.summaryRow}>
            <span className={styles.summaryLabel}>{item.label}</span>
            <span className={styles.summaryValue}>{item.value}</span>
          </div>
        ))}
      </div>
 
      <div className={styles.readyActions}>
        <button className={styles.skipBtn} onClick={back}>← Edit preferences</button>
        <Button
          onClick={() => alert('Launching dashboard… (wire up routing here)')}
        >
          Launch Dashboard →
        </Button>
      </div>
 
      <p className={styles.readyNote}>
        You can update any of these settings at any time from your profile.
      </p>
    </div>
  )
}