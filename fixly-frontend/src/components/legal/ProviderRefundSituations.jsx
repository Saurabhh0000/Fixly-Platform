const SITUATIONS = [
  "Provider cancellation",
  "Provider no-show",
  "Provider unable to complete service",
  "Service quality dispute",
  "Incomplete service",
];

const ProviderRefundSituations = () => (
  <ul className="frefund-provider-list">
    {SITUATIONS.map((s) => (
      <li key={s}>{s}</li>
    ))}
  </ul>
);

export default ProviderRefundSituations;
