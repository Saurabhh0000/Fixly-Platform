import { useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  FiX,
  FiAlertTriangle,
  FiInfo,
  FiArrowRight,
  FiCheck,
  FiMessageSquare,
} from "react-icons/fi";
import { useModalA11y } from "../../hooks/useModalA11y";

const CONTACT_ANCHOR_HREF = "#hs-sidebar-contact";

const HelpTopicModal = ({ topic, onClose, onContactClick }) => {
  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);

  useModalA11y({
    open: !!topic,
    onClose,
    panelRef,
    initialFocusRef: closeBtnRef,
  });

  if (!topic) return null;

  const { icon, title, desc, detail } = topic;
  const { intro, steps = [], notes = [], tips = [], links = [] } = detail || {};

  const handleOverlayClick = (e) => {
    if (panelRef.current && !panelRef.current.contains(e.target)) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="hs-help-modal-overlay"
      onMouseDown={handleOverlayClick}
      role="presentation">
      <div
        className="hs-help-modal-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="hs-help-modal-title"
        aria-describedby="hs-help-modal-desc"
        tabIndex={-1}>
        <header className="hs-help-modal-header">
          <div className="hs-help-modal-icon-wrap" aria-hidden>
            {icon}
          </div>
          <div className="hs-help-modal-header-text">
            <h2 id="hs-help-modal-title" className="hs-help-modal-title">
              {title}
            </h2>
            <p id="hs-help-modal-desc" className="hs-help-modal-desc">
              {desc}
            </p>
          </div>
          <button
            type="button"
            className="hs-help-modal-close"
            onClick={onClose}
            aria-label="Close help topic"
            ref={closeBtnRef}>
            <FiX />
          </button>
        </header>

        <div className="hs-help-modal-body">
          {intro && (
            <section className="hs-help-modal-section">
              <h3 className="hs-detail-heading">Overview</h3>
              <p className="hs-detail-intro">{intro}</p>
            </section>
          )}

          {steps.length > 0 && (
            <section className="hs-help-modal-section">
              <h3 className="hs-detail-heading">How it works</h3>
              <ol className="hs-detail-steps">
                {steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </section>
          )}

          {notes.length > 0 && (
            <section className="hs-help-modal-section">
              <div className="hs-detail-notice hs-detail-notice--warning">
                <FiAlertTriangle
                  className="hs-detail-notice-icon"
                  aria-hidden
                />
                <div>
                  <span className="hs-detail-notice-label">Important</span>
                  {notes.map((n, i) => (
                    <p key={i}>{n}</p>
                  ))}
                </div>
              </div>
            </section>
          )}

          {tips.length > 0 && (
            <section className="hs-help-modal-section">
              <h3 className="hs-detail-heading">Helpful tips</h3>
              <ul className="hs-help-modal-tip-list">
                {tips.map((t, i) => (
                  <li key={i} className="hs-help-modal-tip">
                    <FiCheck aria-hidden />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {links.length > 0 && (
            <section className="hs-help-modal-section">
              <h3 className="hs-detail-heading">Related actions</h3>
              <div className="hs-detail-actions">
                {links.map((l, i) => {
                  if (l.href === CONTACT_ANCHOR_HREF) {
                    return (
                      <button
                        key={i}
                        type="button"
                        className="hs-detail-btn hs-detail-btn--ghost"
                        onClick={onContactClick}>
                        {l.label}
                        <FiArrowRight aria-hidden />
                      </button>
                    );
                  }
                  return l.to ? (
                    <Link key={i} to={l.to} className="hs-detail-btn">
                      {l.label}
                      <FiArrowRight aria-hidden />
                    </Link>
                  ) : (
                    <a
                      key={i}
                      href={l.href}
                      className="hs-detail-btn hs-detail-btn--ghost">
                      {l.label}
                      <FiArrowRight aria-hidden />
                    </a>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        <footer className="hs-help-modal-footer">
          <span className="hs-help-modal-footer-text">Still need help?</span>
          <button
            type="button"
            className="hs-help-modal-footer-btn"
            onClick={onContactClick}>
            <FiMessageSquare aria-hidden />
            Contact Us
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  );
};

export default HelpTopicModal;
