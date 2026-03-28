import type { OnboardingData } from '../App'
import { Input, ToggleChip, StepHeading, NavRow } from '../components/UI'
import styles from '../styles/onboarding.module.css'
 
const INDUSTRIES = [
  { label: 'Technology', icon: '💻' },
  { label: 'Finance', icon: '🏦' },
  { label: 'Healthcare', icon: '🏥' },
  { label: 'Education', icon: '🎓' },
  { label: 'Startups', icon: '🚀' },
  { label: 'Government', icon: '🏛️' },
]
 
const WORK_STYLES = [
  { label: 'Remote', icon: '🏠' },
  { label: 'Hybrid', icon: '🔄' },
  { label: 'On-site', icon: '🏢' },
]
 
interface Props {
  data: OnboardingData
  update: (p: Partial<OnboardingData>) => void
  next: () => void
  back: () => void
}
 
export default function StepJobPreferences({ data, update, next, back }: Props) {
  const toggleIndustry = (ind: string) => {
    const updated = data.targetIndustries.includes(ind)
      ? data.targetIndustries.filter(i => i !== ind)
      : [...data.targetIndustries, ind]
    update({ targetIndustries: updated })
  }
 
  return (
    <div>
      <StepHeading
        title="What are you looking for?"
        subtitle="We'll use this to rank job matches and tune your resume suggestions."
      />
 
      <div className={styles.fieldSingle}>
        <Input
          id="targetRoles"
          label="Target job titles"
          placeholder="e.g. Senior Software Engineer, Staff Engineer"
          value={data.targetRoles}
          onChange={e => update({ targetRoles: e.target.value })}
        />
      </div>
 
      <div className={styles.section}>
        <p className={styles.sectionLabel}>Industries you're interested in</p>
        <div className={styles.chipGrid}>
          {INDUSTRIES.map(ind => (
            <ToggleChip
              key={ind.label}
              label={ind.label}
              icon={ind.icon}
              selected={data.targetIndustries.includes(ind.label)}
              onClick={() => toggleIndustry(ind.label)}
            />
          ))}
        </div>
      </div>
 
      <div className={styles.section}>
        <p className={styles.sectionLabel}>Preferred work style</p>
        <div className={styles.chipRow}>
          {WORK_STYLES.map(ws => (
            <ToggleChip
              key={ws.label}
              label={ws.label}
              icon={ws.icon}
              selected={data.workStyle === ws.label}
              onClick={() => update({ workStyle: ws.label === data.workStyle ? '' : ws.label })}
            />
          ))}
        </div>
      </div>
 
      <div className={styles.section}>
        <p className={styles.sectionLabel}>Target salary range (USD / year)</p>
        <div className={styles.fieldRow}>
          <Input
            id="salaryMin"
            placeholder="Min (e.g. 100,000)"
            value={data.salaryMin}
            onChange={e => update({ salaryMin: e.target.value })}
          />
          <Input
            id="salaryMax"
            placeholder="Max (e.g. 160,000)"
            value={data.salaryMax}
            onChange={e => update({ salaryMax: e.target.value })}
          />
        </div>
      </div>
 
      <NavRow onBack={back} onNext={next} nextLabel="Finish Setup →" />
    </div>
  )
}