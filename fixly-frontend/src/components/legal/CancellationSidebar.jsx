import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { CANCELLATION_SECTIONS } from "../../data/legalContent";

const NAV_HEIGHT_OFFSET = 90;

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const top =
    el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT_OFFSET;
  window.scrollTo({ top, behavior: "smooth" });
}

const CancellationSidebar = ({ activeId }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="fcxl-sidebar" aria-label="On this page">
        <p className="fcxl-sidebar-title">On this page</p>
        <ul className="fcxl-sidebar-list">
          {CANCELLATION_SECTIONS.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                className={`fcxl-sidebar-link ${activeId === s.id ? "fcxl-sidebar-link-active" : ""}`}
                onClick={() => scrollToSection(s.id)}>
                <span className="fcxl-sidebar-indicator" aria-hidden="true" />
                {s.number} {s.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="fcxl-mobile-toc">
        <button
          type="button"
          className="fcxl-mobile-toc-toggle"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((o) => !o)}>
          Jump to a section
          <FaChevronDown
            className={`fcxl-mobile-toc-chevron ${mobileOpen ? "fcxl-mobile-toc-chevron-open" : ""}`}
          />
        </button>
        {mobileOpen && (
          <ul className="fcxl-mobile-toc-list">
            {CANCELLATION_SECTIONS.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  className="fcxl-mobile-toc-link"
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

export default CancellationSidebar;
