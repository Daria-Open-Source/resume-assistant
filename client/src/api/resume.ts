import { AnalysisResult } from '../types';

export async function analyzeResume(
  file: File,
  role: string,
  query: string
): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('role', role);
  formData.append('query', query);

  const response = await fetch('/api/rag/query', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? `Request failed: ${response.status}`);
  }

  return response.json();
}
