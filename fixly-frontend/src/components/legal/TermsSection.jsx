import LegalCallout from "./LegalCallout";

const Block = ({ block }) => {
  switch (block.type) {
    case "p":
      return <p className="fterms-p">{block.text}</p>;
    case "subheading":
      return <h3 className="fterms-subheading">{block.text}</h3>;
    case "list":
      return (
        <ul className="fterms-list">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "callout":
      return <LegalCallout tone={block.tone}>{block.text}</LegalCallout>;
    case "placeholder-link":
      return (
        <p className="fterms-placeholder-link">
          {block.label}{" "}
          <span className="fterms-placeholder-note">{block.note}</span>
        </p>
      );
    case "custom":
      // Backward-compatible extension: renders an arbitrary component
      // supplied inline in the section data. Unused by existing Terms/
      // Privacy content, so those pages are unaffected.
      return block.render ? block.render() : null;
    default:
      return null;
  }
};

const TermsSection = ({ section }) => (
  <section id={section.id} className="fterms-legal-section">
    <span className="fterms-legal-number">{section.number}</span>
    <h2 className="fterms-legal-title">{section.title}</h2>
    <div className="fterms-legal-body">
      {section.blocks.map((block, i) => (
        <Block block={block} key={i} />
      ))}
    </div>
  </section>
);

export default TermsSection;
