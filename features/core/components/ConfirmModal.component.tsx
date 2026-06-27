'use client';
import { Modal } from './Modal.component';
import styles from './Modal.module.css';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
};

export function ConfirmModal({ open, onClose, onConfirm, message, confirmLabel = 'Confirmar', danger = true }: Props) {
  function handleConfirm() {
    onConfirm();
    onClose();
  }
  return (
    <Modal open={open} onClose={onClose} title="Confirmar">
      <p className={styles.confirmMessage}>{message}</p>
      <div className={styles.confirmActions}>
        <button
          className={`${styles.confirmBtn} ${danger ? styles.confirmDanger : ''}`}
          onClick={handleConfirm}
        >
          {confirmLabel}
        </button>
        <button className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
      </div>
    </Modal>
  );
}
