import type { InputHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './UI.module.css'
 
/* ── Button ── */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
  children: ReactNode
}
 
export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
 
/* ── Input ── */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}
 
export function Input({ label, error, id, className = '', ...props }: InputProps) {
  return (
    <div className={styles.inputWrapper}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      <input
        id={id}
        className={`${styles.input} ${error ? styles.inputError : ''} ${className}`}
        {...props}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  )
}
 
/* ── ToggleChip ── */
interface ChipProps {
  label: string
  icon?: string
  selected: boolean
  onClick: () => void
}
 
export function ToggleChip({ label, icon, selected, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles.chip} ${selected ? styles.chipSelected : ''}`}
    >
      {icon && <span className={styles.chipIcon}>{icon}</span>}
      {label}
    </button>
  )
}
 
/* ── Section heading ── */
export function StepHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className={styles.heading}>
      <h1 className={styles.h1}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  )
}
 
/* ── Back + Next row ── */
interface NavRowProps {
  onBack?: () => void
  onNext: () => void
  nextLabel?: string
  nextDisabled?: boolean
}
 
export function NavRow({ onBack, onNext, nextLabel = 'Continue', nextDisabled }: NavRowProps) {
  return (
    <div className={styles.navRow}>
      {onBack ? (
        <button type="button" className={styles.backBtn} onClick={onBack}>
          ← Back
        </button>
      ) : <span />}
      <Button onClick={onNext} disabled={nextDisabled}>{nextLabel}</Button>
    </div>
  )
}
 