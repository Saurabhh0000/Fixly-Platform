import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import ContactForm from "./ContactForm";
import ContactSuccess from "./ContactSuccess";
import { useModalA11y } from "../../hooks/useModalA11y";
import "../../styles/help-support.css";

const ContactModal = ({ open, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (open) setSubmitted(false);
  }, [open]);

  useModalA11y({ open, onClose, panelRef, initialFocusRef: closeBtnRef });

  if (!open) return null;

  const handleOverlayClick = (e) => {
    if (panelRef.current && !panelRef.current.contains(e.target)) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="hs-modal-overlay"
      onMouseDown={handleOverlayClick}
      role="presentation">
      <div
        className="hs-modal-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="hs-modal-title"
        tabIndex={-1}>
        <button
          type="button"
          className="hs-modal-close"
          onClick={onClose}
          aria-label="Close contact form"
          ref={closeBtnRef}>
          <FiX />
        </button>

        <div className="hs-modal-header">
          <h2 id="hs-modal-title" className="hs-modal-title">
            Send us a message
          </h2>
          <p className="hs-modal-sub">
            Fill out the form and we'll get back to you.
          </p>
        </div>

        <div className="hs-modal-body">
          {submitted ? (
            <ContactSuccess onSendAnother={() => setSubmitted(false)} />
          ) : (
            <ContactForm onSuccess={() => setSubmitted(true)} />
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ContactModal;
