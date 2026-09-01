import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { REFUND_SECTIONS } from "../../data/legalContent";

const NAV_HEIGHT_OFFSET = 90;

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const top =
    el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT_OFFSET;
  window.scrollTo({ top, behavior: "smooth" });
}

const RefundSidebar = ({ activeId }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="frefund-sidebar" aria-label="On this page">
        <p className="frefund-sidebar-title">On this page</p>
        <ul className="frefund-sidebar-list">
          {REFUND_SECTIONS.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                className={`frefund-sidebar-link ${activeId === s.id ? "frefund-sidebar-link-active" : ""}`}
                onClick={() => scrollToSection(s.id)}>
                <span
                  className="frefund-sidebar-indicator"
                  aria-hidden="true"
                />
                {s.number} {s.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="frefund-mobile-toc">
        <button
          type="button"
          className="frefund-mobile-toc-toggle"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((o) => !o)}>
          Jump to a section
          <FaChevronDown
            className={`frefund-mobile-toc-chevron ${mobileOpen ? "frefund-mobile-toc-chevron-open" : ""}`}
          />
        </button>
        {mobileOpen && (
          <ul className="frefund-mobile-toc-list">
            {REFUND_SECTIONS.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  className="frefund-mobile-toc-link"
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

export default RefundSidebar;
