import { useState } from 'react'
import type { OnboardingData } from '../App'
import { Input, ToggleChip, StepHeading, NavRow } from '../components/UI'
import styles from '../styles/onboarding.module.css'
 
const ROLES = [
  { label: 'Software Engineer', icon: '⌨️' },
  { label: 'Product Management', icon: '📋' },
  { label: 'Data & Analytics', icon: '📊' },
  { label: 'Design & UX', icon: '🎨' },
  { label: 'Marketing', icon: '📣' },
  { label: 'Finance', icon: '💼' },
  { label: 'Operations', icon: '⚙️' },
  { label: 'Sales', icon: '🤝' },
]
 
interface Props {
  data: OnboardingData
  update: (p: Partial<OnboardingData>) => void
  next: () => void
  back: () => void
}
 
export default function StepCreateProfile({ data, update, next }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({})
 
  const toggleRole = (role: string) => {
    const current = data.role
    const updated = current.includes(role)
      ? current.filter(r => r !== role)
      : [...current, role]
    update({ role: updated })
  }
 
  const validate = () => {
    const e: Record<string, string> = {}
    if (!data.firstName.trim()) e.firstName = 'First name is required'
    if (!data.lastName.trim()) e.lastName = 'Last name is required'
    if (!data.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Enter a valid email'
    if (data.role.length === 0) e.role = 'Select at least one role'
    setErrors(e)
    return Object.keys(e).length === 0
  }
 
  const handleNext = () => { if (validate()) next() }
 
  return (
    <div>
      <StepHeading
        title="Tell us about yourself."
        subtitle="This helps us tailor the resume assistant to your goals."
      />
 
      <div className={styles.fieldRow}>
        <Input
          id="firstName"
          label="First name"
          placeholder="Alex"
          value={data.firstName}
          onChange={e => update({ firstName: e.target.value })}
          error={errors.firstName}
        />
        <Input
          id="lastName"
          label="Last name"
          placeholder="Rivera"
          value={data.lastName}
          onChange={e => update({ lastName: e.target.value })}
          error={errors.lastName}
        />
      </div>
 
      <div className={styles.fieldSingle}>
        <Input
          id="email"
          label="Work email"
          type="email"
          placeholder="alex@company.com"
          value={data.email}
          onChange={e => update({ email: e.target.value })}
          error={errors.email}
        />
      </div>
 
      <div className={styles.section}>
        <p className={styles.sectionLabel}>What's your field? Choose one or more.</p>
        {errors.role && <span className={styles.roleError}>{errors.role}</span>}
        <div className={styles.chipGrid}>
          {ROLES.map(r => (
            <ToggleChip
              key={r.label}
              label={r.label}
              icon={r.icon}
              selected={data.role.includes(r.label)}
              onClick={() => toggleRole(r.label)}
            />
          ))}
        </div>
      </div>
 
      <NavRow onNext={handleNext} nextLabel="Set Up Resume →" />
    </div>
  )
}