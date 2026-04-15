export interface ChunkedResume {
  education:  string[];
  experience: string[];
  projects:   string[];
  leadership: string[];
  skills:     string[];
  [key: string]: string[];
}

export interface AnalysisResult {
  skillAlignment: string;
  experienceGaps: string;
  actionableAdvice: string[];
  chunkedResume?: ChunkedResume;
}

export interface AnalysisRouteState {
  file: File;
  jobTitle: string;
}

export type ResumeSection = 'education' | 'experience' | 'projects' | 'leadership' | 'skills';

export const SECTIONS: { key: ResumeSection; label: string }[] = [
  { key: 'education',   label: 'Education'   },
  { key: 'experience',  label: 'Experience'  },
  { key: 'projects',    label: 'Projects'    },
  { key: 'leadership',  label: 'Leadership'  },
  { key: 'skills',      label: 'Skills'      },
];
