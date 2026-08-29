import { useActiveStep } from "../../hooks/useScrollReveal";

const STEPS = [
  { title: "Search for a service", detail: 'Try "AC Repair" near you.' },
  {
    title: "View available providers",
    detail: "Browse profiles and availability.",
  },
  {
    title: "Compare price & rating",
    detail: "See transparent pricing side by side.",
  },
  {
    title: "Select a provider",
    detail: "Pick the professional that fits your need.",
  },
  { title: "Choose date & time", detail: "Schedule at your convenience." },
  { title: "Confirm booking", detail: "Your request is sent to the provider." },
  { title: "Service completed", detail: "Verified on completion with OTP." },
  { title: "Rate the provider", detail: "Share your experience for others." },
];

const SearchToService = () => {
  const { activeStep, setStepRef } = useActiveStep(STEPS.length);

  return (
    <section className="fa-section fa-section-dark fa-sts">
      <div className="fa-container fa-sts-container">
        <div className="fa-sts-steps">
          <h2 className="fa-heading fa-heading-inverse">
            From Search to Service
          </h2>
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              ref={setStepRef(i)}
              data-step-index={i}
              className={`fa-sts-step ${activeStep === i ? "fa-sts-step-active" : ""}`}>
              <span className="fa-sts-step-num">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h4 className="fa-sts-step-title">{step.title}</h4>
                <p className="fa-sts-step-detail">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="fa-sts-mockup-wrap">
          <div className="fa-sts-mockup" aria-hidden="true">
            <div className="fa-sts-mockup-bar">
              <span />
              <span />
              <span />
            </div>
            <div className="fa-sts-mockup-body">
              <span className="fa-sts-mockup-step-count">
                Step {activeStep + 1} / {STEPS.length}
              </span>
              <h5 className="fa-sts-mockup-title">{STEPS[activeStep].title}</h5>
              <p className="fa-sts-mockup-detail">{STEPS[activeStep].detail}</p>
              <div className="fa-sts-progress">
                <div
                  className="fa-sts-progress-fill"
                  style={{
                    width: `${((activeStep + 1) / STEPS.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchToService;
