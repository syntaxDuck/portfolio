import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] bg-bg2 dark:bg-bg2-dark border border-borderMuted dark:border-borderMuted flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-borderMuted dark:border-borderMuted">
          <h2
            id="modal-title"
            className="text-lg font-semibold text-primary dark:text-primary-dark truncate"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-muted dark:text-muted-dark hover:text-text dark:hover:text-text-dark transition-colors text-xl leading-none"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
