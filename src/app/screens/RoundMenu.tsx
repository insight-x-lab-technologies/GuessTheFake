import { MoreHorizontal } from 'lucide-react';
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import type { Translate } from '../app-types';
import styles from '../App.module.css';

export type RoundMenuItem = {
  id: string;
  icon: ReactNode;
  label: string;
  onSelect: () => void;
  // Lets an item stand for an inline disclosure (the score reset panel).
  controls?: string;
};

// W15-01: secondary round actions behind a `...` button so the board keeps
// its room for the statements. Closes on Escape, outside click or selection.
export function RoundMenu({ t, items }: { t: Translate; items: RoundMenuItem[] }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (!open) return undefined;
    itemRefs.current[0]?.focus();
    const handlePointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointer);
    return () => document.removeEventListener('pointerdown', handlePointer);
  }, [open]);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!open) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const current = itemRefs.current.findIndex(item => item === document.activeElement);
    const step = event.key === 'ArrowDown' ? 1 : -1;
    itemRefs.current[(current + step + items.length) % items.length]?.focus();
  }

  return (
    <div className={styles.roundMenu} ref={rootRef} onKeyDown={handleKeyDown}>
      <button
        ref={triggerRef}
        aria-controls={menuId}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t('juice.menu.label')}
        className={styles.roundMenuTrigger}
        title={t('juice.menu.label')}
        type="button"
        onClick={() => setOpen(current => !current)}
      >
        <MoreHorizontal size={20} />
      </button>
      {open ? (
        <div className={styles.roundMenuList} id={menuId} role="menu" aria-label={t('juice.menu.label')}>
          {items.map((item, index) => (
            <button
              key={item.id}
              ref={element => {
                itemRefs.current[index] = element;
              }}
              aria-controls={item.controls}
              role="menuitem"
              type="button"
              onClick={() => {
                setOpen(false);
                item.onSelect();
              }}
            >
              {item.icon} <span>{item.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
