import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { TERMS_SECTIONS } from "../../data/legalContent";

const NAV_HEIGHT_OFFSET = 90; // accounts for fixed Fixly navbar

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const top =
    el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT_OFFSET;
  window.scrollTo({ top, behavior: "smooth" });
}

const TermsSidebar = ({ activeId }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sticky sidebar */}
      <nav className="fterms-sidebar" aria-label="On this page">
        <p className="fterms-sidebar-title">On this page</p>
        <ul className="fterms-sidebar-list">
          {TERMS_SECTIONS.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                className={`fterms-sidebar-link ${activeId === s.id ? "fterms-sidebar-link-active" : ""}`}
                onClick={() => scrollToSection(s.id)}>
                <span className="fterms-sidebar-indicator" aria-hidden="true" />
                {s.number} {s.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile collapsible TOC */}
      <div className="fterms-mobile-toc">
        <button
          type="button"
          className="fterms-mobile-toc-toggle"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((o) => !o)}>
          Jump to a section
          <FaChevronDown
            className={`fterms-mobile-toc-chevron ${mobileOpen ? "fterms-mobile-toc-chevron-open" : ""}`}
          />
        </button>
        {mobileOpen && (
          <ul className="fterms-mobile-toc-list">
            {TERMS_SECTIONS.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  className="fterms-mobile-toc-link"
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

export default TermsSidebar;
