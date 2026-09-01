import { FaCheckSquare } from "react-icons/fa";

const ITEMS = [
  "Booking ID",
  "Service information",
  "Payment information",
  "Cancellation details, if applicable",
  "A description of the issue",
  "Relevant evidence, where appropriate",
];

const RefundDisputeChecklist = () => (
  <ul className="frefund-checklist">
    {ITEMS.map((item) => (
      <li key={item}>
        <FaCheckSquare aria-hidden="true" />
        {item}
      </li>
    ))}
  </ul>
);

export default RefundDisputeChecklist;
