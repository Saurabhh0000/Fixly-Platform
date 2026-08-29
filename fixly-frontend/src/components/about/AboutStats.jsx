import { useEffect, useState } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

/*
 * IMPORTANT: these are product-level, non-fabricated labels rather than
 * invented company metrics (no "10,000+ customers" style claims). Replace
 * `value` with real backend-supplied numbers when/if an endpoint exists.
 */
const STATS = [
  { key: "categories", label: "Service Categories", value: 12 },
  { key: "flow", label: "Booking Lifecycle Stages", value: 4 },
  { key: "otp", label: "OTP-Verified Completions", value: 1 },
  { key: "roles", label: "Platform Roles Supported", value: 3 },
];

const CountUp = ({ target, active }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      setValue(target);
      return;
    }
    const duration = 900;
    const start = performance.now();
    let frame;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target]);

  return <>{value}</>;
};

const AboutStats = () => {
  const [ref, visible] = useScrollReveal();
  return (
    <section className="fa-section fa-section-light" ref={ref}>
      <div className="fa-container">
        <div className="fa-stats-grid">
          {STATS.map((stat, i) => (
            <div
              key={stat.key}
              className={`fa-stat-card ${visible ? "fa-visible" : ""}`}
              style={{ "--fa-delay": `${i * 90}ms` }}>
              <div className="fa-stat-value">
                <CountUp target={stat.value} active={visible} />+
              </div>
              <div className="fa-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutStats;
