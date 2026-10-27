import { useEffect, useState } from 'react';
import { birthday } from '../data/birthday';
import { Icon } from './Icon';

interface HeaderProps {
  completed: number;
  total: number;
  stars: number;
  soundOn: boolean;
  onToggleSound: () => void;
  onCopyLink: () => Promise<void> | void;
  onReset: () => void;
}

export function Header({
  completed,
  total,
  stars,
  soundOn,
  onToggleSound,
  onCopyLink,
  onReset,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  return (
    <header className="topbar">
      <div className="topbar__row">
        <div className="brand">
          <span className="brand__badge" aria-hidden="true">
            <Icon name="cake" size={20} />
          </span>
          <span className="brand__text">
            <small>Compleanno di</small>
            <strong>{birthday.name}</strong>
          </span>
        </div>

        <div className="topbar__actions">
          <button
            type="button"
            className="icon-btn"
            onClick={onToggleSound}
            aria-label={soundOn ? 'Disattiva audio' : 'Attiva audio'}
            aria-pressed={soundOn}
          >
            <Icon name={soundOn ? 'sound' : 'mute'} size={20} />
          </button>

          <div className="menu-wrap">
            <button
              type="button"
              className="icon-btn"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Apri menu"
              aria-expanded={menuOpen}
            >
              <Icon name="menu" size={20} />
            </button>

            {menuOpen && (
              <>
                <button
                  type="button"
                  className="menu-backdrop"
                  aria-label="Chiudi menu"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="menu" role="menu">
                  <button
                    type="button"
                    className="menu__item"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      void onCopyLink();
                    }}
                  >
                    <Icon name="copy" size={18} />
                    <span>
                      <strong>Copia link per riprendere</strong>
                      <small>Per continuare su un altro telefono</small>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="menu__item menu__item--danger"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      onReset();
                    }}
                  >
                    <Icon name="reset" size={18} />
                    <span>
                      <strong>Ricomincia da capo</strong>
                      <small>Progressi e stelle verranno azzerati</small>
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="topbar__progress">
        <div
          className="progress-track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={completed}
          aria-label="Tappe completate"
        >
          <span className="progress-track__fill" style={{ width: `${percentage}%` }} />
        </div>
        <span className="pill pill--stars">
          <Icon name="star" size={14} /> {stars}
        </span>
        <span className="pill">
          {completed}/{total}
        </span>
      </div>
    </header>
  );
}
