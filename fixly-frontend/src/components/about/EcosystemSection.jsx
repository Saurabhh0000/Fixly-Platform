import { useScrollReveal } from "../../hooks/useScrollReveal";

const NODES = [
  { label: "Customers", angle: 0 },
  { label: "Providers", angle: 51 },
  { label: "Services", angle: 102 },
  { label: "Bookings", angle: 154 },
  { label: "Payments", angle: 206 },
  { label: "Ratings", angle: 257 },
  { label: "Support", angle: 309 },
];

const EcosystemSection = () => {
  const [ref, visible] = useScrollReveal();
  return (
    <section className="fa-section fa-section-dark" ref={ref}>
      <div className="fa-container">
        <h2 className="fa-heading fa-heading-inverse fa-heading-center">
          More than a booking page — an ecosystem.
        </h2>
        <div
          className={`fa-ecosystem ${visible ? "fa-visible" : ""}`}
          aria-hidden="true">
          <div className="fa-ecosystem-center">Fixly</div>
          {NODES.map((node, i) => (
            <div
              key={node.label}
              className="fa-ecosystem-node"
              style={{
                "--fa-angle": `${node.angle}deg`,
                "--fa-delay": `${i * 60}ms`,
              }}>
              {node.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EcosystemSection;
