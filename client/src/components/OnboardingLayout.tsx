import type { ReactNode } from 'react'
import styles from '../styles/onboarding.module.css'

interface Step { id: number; label: string }

interface Props {
  step: number
  steps: Step[]
  children: ReactNode
}

export default function OnboardingLayout({ step, steps, children }: Props) {
  return (
    <div className={styles.page}>
      {/* Top progress nav */}
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <span className={styles.logoMark}>RPI</span>
          <span className={styles.logoText}>Daria</span>
        </div>
        <ol className={styles.steps}>
          {steps.map((s, i) => {
            const state = step > s.id ? 'done' : step === s.id ? 'active' : 'pending'
            return (
              <li key={s.id} className={`${styles.stepItem} ${styles[state]}`}>
                <span className={styles.stepNumber}>
                  {state === 'done' ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : s.id}
                </span>
                <span className={styles.stepLabel}>{s.label}</span>
                {i < steps.length - 1 && <span className={styles.stepDivider} />}
              </li>
            )
          })}
        </ol>
      </nav>

      {/* Active step progress bar */}
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
        />
      </div>

      {/* Card */}
      <main className={styles.main}>
        <div className={styles.card}>
          {children}
        </div>
      </main>
    </div>
  )
}
