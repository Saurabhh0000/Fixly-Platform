import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { PRIVACY_SECTIONS } from "../../data/legalContent";

const NAV_HEIGHT_OFFSET = 90;

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const top =
    el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT_OFFSET;
  window.scrollTo({ top, behavior: "smooth" });
}

const PrivacySidebar = ({ activeId }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="fprivacy-sidebar" aria-label="On this page">
        <p className="fprivacy-sidebar-title">On this page</p>
        <ul className="fprivacy-sidebar-list">
          {PRIVACY_SECTIONS.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                className={`fprivacy-sidebar-link ${activeId === s.id ? "fprivacy-sidebar-link-active" : ""}`}
                onClick={() => scrollToSection(s.id)}>
                <span
                  className="fprivacy-sidebar-indicator"
                  aria-hidden="true"
                />
                {s.number} {s.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="fprivacy-mobile-toc">
        <button
          type="button"
          className="fprivacy-mobile-toc-toggle"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((o) => !o)}>
          Jump to a section
          <FaChevronDown
            className={`fprivacy-mobile-toc-chevron ${mobileOpen ? "fprivacy-mobile-toc-chevron-open" : ""}`}
          />
        </button>
        {mobileOpen && (
          <ul className="fprivacy-mobile-toc-list">
            {PRIVACY_SECTIONS.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  className="fprivacy-mobile-toc-link"
                  onClick={() => {
                    scrollToSection(s.id);
                    setMobileOpen(false);
                  }}>
                  {s.number} {s.title}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default PrivacySidebar;
