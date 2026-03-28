import { useState } from 'react'
import OnboardingLayout from './components/OnboardingLayout'
import StepCreateProfile from './pages/StepCreateProfile'
import StepUploadResume from './pages/StepUploadResume'
import StepJobPreferences from './pages/StepJobPreferences'
import StepReady from './pages/StepReady'
 
export interface OnboardingData {
  firstName: string
  lastName: string
  email: string
  role: string[]
  resumeFile: File | null
  targetRoles: string
  targetIndustries: string[]
  workStyle: string
  salaryMin: string
  salaryMax: string
}
 
const STEPS = [
  { id: 1, label: 'Create Profile' },
  { id: 2, label: 'Upload Resume' },
  { id: 3, label: 'Job Preferences' },
  { id: 4, label: 'Get Started' },
]
 
const defaultData: OnboardingData = {
  firstName: '',
  lastName: '',
  email: '',
  role: [],
  resumeFile: null,
  targetRoles: '',
  targetIndustries: [],
  workStyle: '',
  salaryMin: '',
  salaryMax: '',
}
 
export default function App() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<OnboardingData>(defaultData)
 
  const update = (patch: Partial<OnboardingData>) =>
    setData(prev => ({ ...prev, ...patch }))
 
  const next = () => setStep(s => Math.min(s + 1, STEPS.length))
  const back = () => setStep(s => Math.max(s - 1, 1))
 
  const stepProps = { data, update, next, back }
 
  return (
    <OnboardingLayout step={step} steps={STEPS}>
      {step === 1 && <StepCreateProfile {...stepProps} />}
      {step === 2 && <StepUploadResume {...stepProps} />}
      {step === 3 && <StepJobPreferences {...stepProps} />}
      {step === 4 && <StepReady {...stepProps} />}
    </OnboardingLayout>
  )
}
 