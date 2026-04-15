import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { analyzeResume } from '../api/resume';
import { AnalysisResult, AnalysisRouteState, SECTIONS } from '../types';
import styles from './AnalysisPage.module.css';

/** Renders a string that may contain "- item" lines as a proper bullet list. */
function BulletText({ text }: { text: string }) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const hasBullets = lines.some(l => l.startsWith('- '));

  if (!hasBullets) return <p className={styles.cardBody}>{text}</p>;

  // Split into intro text (before first bullet) and bullet lines
  const firstBullet = lines.findIndex(l => l.startsWith('- '));
  const intro = lines.slice(0, firstBullet).join(' ');
  const bullets = lines.slice(firstBullet).map(l => l.replace(/^-\s*/, ''));

  return (
    <div className={styles.cardBody}>
      {intro && <p className={styles.bulletIntro}>{intro}</p>}
      <ul className={styles.bulletList}>
        {bullets.map((b, i) => (
          <li key={i} className={styles.bulletItem}>{b}</li>
        ))}
      </ul>
    </div>
  );
}

export default function AnalysisPage() {
  const { state } = useLocation() as { state: AnalysisRouteState | null };
  const navigate = useNavigate();

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sectionIndex, setSectionIndex] = useState(0);
  const hasFetched = useRef(false);

  const activeSection = SECTIONS[sectionIndex];

  useEffect(() => {
    if (!state?.file || !state?.jobTitle) {
      navigate('/', { replace: true });
    }
  }, [state, navigate]);

  useEffect(() => {
    if (!state?.file || !state?.jobTitle || hasFetched.current) return;
    hasFetched.current = true;

    analyzeResume(state.file, state.jobTitle, `Analyze my resume for a ${state.jobTitle} role`)
      .then(data => { setResult(data); setLoading(false); })
      .catch(err => { setError(err.message ?? 'Something went wrong.'); setLoading(false); });
  }, [state]);

  if (!state) return null;

  const chunks = result?.chunkedResume?.[activeSection.key] ?? [];

  const goToPrev = () => setSectionIndex(i => Math.max(0, i - 1));
  const goToNext = () => setSectionIndex(i => Math.min(SECTIONS.length - 1, i + 1));

  return (
    <div className={styles.page}>
      {/* Top bar */}
      <header className={styles.topbar}>
        <button className={styles.backBtn} onClick={() => navigate('/')}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          New Analysis
        </button>
        <div className={styles.roleLabel}>
          <span className={styles.rolePre}>Analyzing for</span>
          <span className={styles.roleTitle}>{state.jobTitle}</span>
        </div>
        <div className={styles.fileNameTag}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          {state.file.name}
        </div>
      </header>

      {/* Body */}
      <div className={styles.body}>

        {/* ── Left panel: resume chunks ── */}
        <aside className={styles.leftPanel}>
          {/* Section tabs */}
          <div className={styles.sectionTabs}>
            {SECTIONS.map((s, i) => (
              <button
                key={s.key}
                className={`${styles.sectionTab} ${i === sectionIndex ? styles.sectionTabActive : ''}`}
                onClick={() => setSectionIndex(i)}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Chunk content */}
          <div className={styles.chunkArea}>
            {loading ? (
              <div className={styles.chunkLoading}>
                <div className={styles.skeletonLine} style={{ width: '80%' }} />
                <div className={styles.skeletonLine} style={{ width: '60%' }} />
                <div className={styles.skeletonLine} style={{ width: '75%' }} />
                <div className={styles.skeletonLine} style={{ width: '50%' }} />
              </div>
            ) : chunks.length > 0 ? (
              <div className={styles.chunkList}>
                {chunks.map((chunk, i) => (
                  <div key={i} className={styles.chunkItem}>
                    <span className={styles.chunkIndex}>{i + 1}</span>
                    <p className={styles.chunkText}>{chunk}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.chunkEmpty}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p>No {activeSection.label.toLowerCase()} section found in your resume.</p>
              </div>
            )}
          </div>

          {/* Prev / Next navigation */}
          <div className={styles.chunkNav}>
            <button
              className={styles.navBtn}
              onClick={goToPrev}
              disabled={sectionIndex === 0}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
              Previous
            </button>

            <span className={styles.navIndicator}>
              {sectionIndex + 1} / {SECTIONS.length}
              <span className={styles.navSectionName}>{activeSection.label}</span>
            </span>

            <button
              className={styles.navBtn}
              onClick={goToNext}
              disabled={sectionIndex === SECTIONS.length - 1}
            >
              Next
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        </aside>

        {/* ── Right panel: analysis ── */}
        <section className={styles.rightPanel}>
          {loading && (
            <div className={styles.loadingState}>
              <div className={styles.spinner} />
              <p className={styles.loadingText}>Analyzing your resume against gold-standard examples…</p>
              <p className={styles.loadingHint}>This may take up to 30 seconds.</p>
            </div>
          )}

          {error && !loading && (
            <div className={styles.errorState}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p className={styles.errorTitle}>Analysis failed</p>
              <p className={styles.errorMessage}>{error}</p>
              <button
                className={styles.retryBtn}
                onClick={() => { hasFetched.current = false; setLoading(true); setError(''); }}
              >
                Try again
              </button>
            </div>
          )}

          {result && !loading && (
            <div className={styles.results}>
              <div className={styles.resultsHeader}>
                <h2 className={styles.resultsTitle}>Analysis complete</h2>
                <p className={styles.resultsSubtitle}>
                  Based on real resumes from candidates who successfully landed{' '}
                  <strong>{state.jobTitle}</strong> roles.
                </p>
              </div>

              {/* Skill Alignment */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardDot} style={{ background: '#111' }} />
                  <h3 className={styles.cardTitle}>Skill Alignment</h3>
                </div>
                <BulletText text={result.skillAlignment} />
              </div>

              {/* Experience Gaps */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardDot} style={{ background: '#888' }} />
                  <h3 className={styles.cardTitle}>Experience Gaps</h3>
                </div>
                <BulletText text={result.experienceGaps} />
              </div>

              {/* Actionable Advice */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardDot} style={{ background: '#bbb' }} />
                  <h3 className={styles.cardTitle}>Actionable Advice</h3>
                </div>
                <ul className={styles.adviceList}>
                  {(Array.isArray(result.actionableAdvice)
                    ? result.actionableAdvice
                    : [result.actionableAdvice]
                  ).map((item, i) => (
                    <li key={i} className={styles.adviceItem}>
                      <span className={styles.adviceNum}>{i + 1}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
