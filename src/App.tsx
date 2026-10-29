import { useCallback, useEffect, useRef, useState } from 'react';
import { STEPS, STEP_IDS } from './data/steps';
import {
  buildRestoreLink,
  clearRestoreHash,
  createEmptyProgress,
  loadLocalProgress,
  normalizeProgress,
  readRestoreHash,
  saveLocalProgress,
} from './lib/progress';
import type { Progress } from './lib/progress';
import { loadSoundPreference, saveSoundPreference } from './lib/prefs';
import { playSound } from './lib/sound';
import { copyText } from './lib/share';
import { LandingScreen } from './components/LandingScreen';
import { Header } from './components/Header';
import { PathScreen } from './components/PathScreen';
import { StepModal } from './components/StepModal';
import { FinalScreen } from './components/FinalScreen';
import { Toast } from './components/Toast';
import { ConfirmDialog } from './components/ConfirmDialog';

type View = 'landing' | 'path' | 'final';

interface InitialState {
  progress: Progress;
  restored: boolean;
}

/**
 * Sceglie il progresso migliore tra quello locale e quello di un eventuale link.
 * Regola: vince chi ha più tappe completate; a parità, il più recente.
 */
function loadInitialState(): InitialState {
  const local = loadLocalProgress();
  const remote = readRestoreHash();
  const localProgress = local ? normalizeProgress(local, STEP_IDS) : null;
  const remoteProgress = remote ? normalizeProgress(remote, STEP_IDS) : null;

  const preferRemote =
    remoteProgress !== null &&
    (localProgress === null ||
      remoteProgress.completed.length > localProgress.completed.length ||
      (remoteProgress.completed.length === localProgress.completed.length &&
        remoteProgress.updatedAt > localProgress.updatedAt));

  if (preferRemote && remoteProgress) {
    return { progress: remoteProgress, restored: true };
  }

  return { progress: localProgress ?? createEmptyProgress(), restored: false };
}

export default function App() {
  const [initial] = useState(loadInitialState);
  const [progress, setProgress] = useState<Progress>(initial.progress);
  const [view, setView] = useState<View>(() => {
    if (initial.progress.completed.length >= STEPS.length) return 'final';
    if (initial.progress.completed.length === 0) return 'landing';
    return 'path';
  });
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [soundOn, setSoundOn] = useState(loadSoundPreference);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const toastTimer = useRef<number | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    };
  }, []);

  useEffect(() => {
    saveLocalProgress(progress);
  }, [progress]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [view]);

  useEffect(() => {
    clearRestoreHash();
    if (initial.restored) {
      showToast('Bentornata! Progressi ripristinati ✨');
    }
  }, [initial.restored, showToast]);

  const activeIndex = activeStepId ? STEPS.findIndex((step) => step.id === activeStepId) : -1;
  const activeStep = activeIndex >= 0 ? STEPS[activeIndex] : null;
  const totalStars = Object.values(progress.stars).reduce((sum, value) => sum + value, 0);

  const completeStep = (stepId: string, stars: number) => {
    const isLast = stepId === STEPS[STEPS.length - 1].id;

    setProgress((current) => {
      if (current.completed.includes(stepId)) return current;
      return {
        ...current,
        completed: [...current.completed, stepId],
        stars: { ...current.stars, [stepId]: stars },
        updatedAt: Date.now(),
      };
    });

    setActiveStepId(null);

    if (isLast) {
      setToast(null);
      setView('final');
    } else if (stars === 3) {
      showToast('Tre stelle! Tappa perfetta ⭐⭐⭐');
    } else {
      showToast(`Tappa completata · ${stars} ${stars === 1 ? 'stella' : 'stelle'} ⭐`);
    }
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    saveSoundPreference(next);
    if (next) playSound('tap', true);
  };

  const copyResumeLink = async () => {
    const copied = await copyText(buildRestoreLink(progress));
    showToast(copied ? 'Link copiato! Aprilo su un altro telefono.' : 'Copia non riuscita. Riprova.');
  };

  const openStep = (stepId: string) => {
    setToast(null);
    setActiveStepId(stepId);
  };

  const startJourney = () => {
    playSound('tap', soundOn);
    setView('path');
  };

  const resetProgress = () => {
    setProgress(createEmptyProgress());
    setView('path');
    setActiveStepId(null);
    setConfirmReset(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
    showToast('Percorso azzerato. Si ricomincia! 🎂');
  };

  return (
    <div className="app">
      <div className="app-shell">
        {view === 'landing' ? (
          <LandingScreen soundOn={soundOn} onStart={startJourney} />
        ) : view === 'path' ? (
          <>
            <Header
              completed={progress.completed.length}
              total={STEPS.length}
              stars={totalStars}
              soundOn={soundOn}
              onToggleSound={toggleSound}
              onCopyLink={copyResumeLink}
              onReset={() => setConfirmReset(true)}
            />
            <PathScreen
              steps={STEPS}
              progress={progress}
              onOpenStep={openStep}
              onNotice={showToast}
              onShowFinal={() => setView('final')}
            />
          </>
        ) : (
          <FinalScreen
            completed={progress.completed.length}
            totalSteps={STEPS.length}
            totalStars={totalStars}
            onReplay={() => setConfirmReset(true)}
            onBackToPath={() => setView('path')}
          />
        )}
      </div>

      {activeStep && (
        <StepModal
          step={activeStep}
          index={activeIndex}
          total={STEPS.length}
          soundOn={soundOn}
          onClose={() => setActiveStepId(null)}
          onComplete={(stars) => completeStep(activeStep.id, stars)}
        />
      )}

      {toast && !activeStep && <Toast message={toast} />}

      {confirmReset && (
        <ConfirmDialog
          title="Ricomincia da capo?"
          message="Tutte le tappe e le stelle verranno azzerate. Questa azione non si può annullare."
          confirmLabel="Sì, azzera"
          onConfirm={resetProgress}
          onCancel={() => setConfirmReset(false)}
        />
      )}
    </div>
  );
}
