import { useScrollReveal } from "../../hooks/useScrollReveal";

const MissionVision = () => {
  const [missionRef, missionVisible] = useScrollReveal();
  const [visionRef, visionVisible] = useScrollReveal();

  return (
    <>
      <section className="fa-section fa-section-dark fa-mission">
        <div className="fa-mission-glow" aria-hidden="true" />
        <div className="fa-container">
          <span className="fa-eyebrow-inverse">Our Mission</span>
          <h2
            ref={missionRef}
            className={`fa-mission-heading ${missionVisible ? "fa-visible" : ""}`}>
            To make trusted services easier to discover, easier to book and
            easier to deliver.
          </h2>
        </div>
      </section>

      <section className="fa-section fa-section-light">
        <div className="fa-container">
          <span className="fa-eyebrow">Where We're Going</span>
          <h2
            ref={visionRef}
            className={`fa-heading ${visionVisible ? "fa-visible" : ""}`}>
            Our vision
          </h2>
          <p className="fa-vision-copy">
            We envision a service marketplace where customers can confidently
            find help and skilled professionals can build sustainable businesses
            around their expertise.
          </p>
        </div>
      </section>
    </>
  );
};

export default MissionVision;
