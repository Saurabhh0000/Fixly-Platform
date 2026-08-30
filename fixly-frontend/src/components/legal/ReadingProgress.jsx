const ReadingProgress = ({ progress }) => (
  <div className="fterms-progress-track" aria-hidden="true">
    <div
      className="fterms-progress-fill"
      style={{ width: `${Math.round(progress * 100)}%` }}
    />
  </div>
);

export default ReadingProgress;
