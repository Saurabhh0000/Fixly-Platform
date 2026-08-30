/**
 * Data-driven Terms & Conditions content. Each section is rendered
 * generically by <TermsSection>, so adding/editing legal copy later
 * doesn't require touching JSX.
 *
 * Block types supported by TermsSection:
 *  - { type: "p", text }
 *  - { type: "subheading", text }
 *  - { type: "list", items: [] }
 *  - { type: "callout", tone: "note" | "warning", text }
 *  - { type: "placeholder-link", label, note }  // renders as plain
 *    non-clickable text per current routing decision (no live routes
 *    for /privacy-policy, /cancellation-policy, /refund-policy yet)
 */

export const TERMS_SECTIONS = [
  {
    id: "acceptance",
    number: "01",
    title: "Acceptance of Terms",
    blocks: [
      {
        type: "p",
        text: "By accessing or using Fixly, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these Terms, please do not continue using the platform.",
      },
      {
        type: "callout",
        tone: "note",
        text: "These Terms & Conditions are a product/legal-content template and should be reviewed by qualified legal counsel before being used as binding terms.",
      },
    ],
  },
  {
    id: "about-fixly",
    number: "02",
    title: "About Fixly",
    blocks: [
      {
        type: "p",
        text: "Fixly is a technology platform and marketplace that helps customers discover and connect with independent service providers for home and everyday services, such as plumbing, electrical work, cleaning, and appliance repair.",
      },
      {
        type: "p",
        text: "Fixly facilitates discovery, booking, and communication between customers and providers through the platform. Unless otherwise stated, the actual service is performed by the independent provider selected by the customer, not by Fixly directly.",
      },
    ],
  },
  {
    id: "eligibility",
    number: "03",
    title: "Eligibility",
    blocks: [
      {
        type: "p",
        text: "To use Fixly, you must have the legal capacity to enter into a binding agreement and meet any applicable age requirement under [Applicable Jurisdiction — to be confirmed by legal counsel].",
      },
      {
        type: "list",
        items: [
          "You provide accurate and current information when using the platform.",
          "You are responsible for complying with applicable local laws when using Fixly.",
          "Fixly may restrict access where eligibility requirements are not met.",
        ],
      },
    ],
  },
  {
    id: "accounts",
    number: "04",
    title: "User Accounts",
    blocks: [
      {
        type: "p",
        text: "Creating an account may be required to access certain features of Fixly, such as booking a service or managing a provider profile.",
      },
      {
        type: "list",
        items: [
          "You agree to provide accurate, current, and complete information when creating an account.",
          "You are responsible for maintaining the confidentiality of your account credentials.",
          "You are responsible for all activity that occurs under your account.",
          "Notify Fixly promptly of any unauthorized use of your account.",
          "Fixly may suspend or terminate accounts that violate these Terms.",
        ],
      },
    ],
  },
  {
    id: "services-providers",
    number: "05",
    title: "Services and Service Providers",
    blocks: [
      {
        type: "p",
        text: "Fixly allows customers to discover service providers through profiles that may include service descriptions, pricing information, availability, and ratings or reviews from other customers.",
      },
      {
        type: "callout",
        tone: "note",
        text: "Where Fixly performs a verification step for providers, this reflects a review of submitted information at a point in time and does not constitute a guarantee of a provider's ongoing conduct, licensing, insurance, or quality of work.",
      },
    ],
  },
  {
    id: "bookings",
    number: "06",
    title: "Bookings",
    blocks: [
      {
        type: "p",
        text: "The typical booking flow on Fixly involves the following steps:",
      },
      {
        type: "list",
        items: [
          "Search for a service",
          "Select a service category",
          "Select a provider",
          "Choose a date and time",
          "Confirm the booking",
          "The provider reviews and may accept the booking",
          "The service is carried out",
          "Completion is confirmed",
          "The customer may leave a review",
        ],
      },
      {
        type: "p",
        text: "Provider availability may change, and a booking request is not guaranteed to be accepted. Fixly will make reasonable efforts to reflect accurate booking status within the platform.",
      },
    ],
  },
  {
    id: "payments",
    number: "07",
    title: "Payments",
    blocks: [
      {
        type: "p",
        text: "Customers are responsible for paying the price displayed for a service at the time of booking, plus any applicable fees shown within the platform.",
      },
      {
        type: "list",
        items: [
          "Displayed prices may be set by individual providers and can vary.",
          "Payments may be processed through third-party payment processors.",
          "Fixly is not responsible for delays or errors caused by third-party payment providers.",
          "In the case of a failed or unauthorized transaction, please contact Help & Support.",
        ],
      },
      {
        type: "callout",
        tone: "note",
        text: "Specific fee structures are not listed here and should be confirmed against current, in-platform pricing rather than this document.",
      },
    ],
  },
  {
    id: "cancellation-refunds",
    number: "08",
    title: "Cancellation and Refunds",
    blocks: [
      {
        type: "p",
        text: "Cancellation and refund outcomes may depend on the specific service, the current booking status, how close to the scheduled time a cancellation occurs, and applicable provider or Fixly policies.",
      },
      {
        type: "p",
        text: "Please refer to the applicable Cancellation Policy and Refund Policy for specific rules.",
      },
      {
        type: "placeholder-link",
        label: "Cancellation Policy",
        note: "(page not yet published)",
      },
      {
        type: "placeholder-link",
        label: "Refund Policy",
        note: "(page not yet published)",
      },
    ],
  },
  {
    id: "customer-responsibilities",
    number: "09",
    title: "Customer Responsibilities",
    blocks: [
      {
        type: "list",
        items: [
          "Provide accurate information about the service you need.",
          "Provide reasonable access to the service location at the agreed time.",
          "Communicate respectfully with providers.",
          "Follow the booking requirements shown in the platform.",
          "Make required payments for confirmed bookings.",
          "Do not misuse the platform or attempt to circumvent its booking process.",
        ],
      },
    ],
  },
  {
    id: "provider-responsibilities",
    number: "10",
    title: "Provider Responsibilities",
    blocks: [
      {
        type: "list",
        items: [
          "Keep profile information accurate and up to date.",
          "Provide honest and accurate service descriptions and pricing.",
          "Manage availability responsibly.",
          "Conduct yourself professionally with customers.",
          "Complete accepted bookings to the best of your ability.",
          "Communicate promptly with customers regarding bookings.",
          "Comply with applicable laws and licensing requirements for your trade.",
        ],
      },
      {
        type: "callout",
        tone: "note",
        text: "Fixly does not guarantee a minimum volume of bookings, customer demand, or income for providers using the platform.",
      },
    ],
  },
  {
    id: "reviews-ratings",
    number: "11",
    title: "Reviews and Ratings",
    blocks: [
      {
        type: "p",
        text: "Customers may leave reviews and ratings reflecting their genuine experience with a completed booking.",
      },
      {
        type: "list",
        items: [
          "Reviews must reflect an actual, genuine experience.",
          "Fake reviews, review manipulation, or incentivized reviews that misrepresent experience are not permitted.",
          "Reviews should not contain harassment, hate speech, or misleading claims.",
          "Fixly may moderate or remove content that violates applicable content policies.",
        ],
      },
    ],
  },
  {
    id: "prohibited-activities",
    number: "12",
    title: "Prohibited Activities",
    blocks: [
      {
        type: "p",
        text: "The following activities are prohibited on Fixly:",
      },
      {
        type: "list",
        items: [
          "Fraud or attempted fraud",
          "Creating fake accounts or impersonating another person or business",
          "Manipulating reviews or ratings",
          "Attempting unauthorized access to accounts or systems",
          "Harassment or abuse of other users",
          "Engaging in illegal activity through the platform",
          "Scraping or unauthorized automated access to the platform",
          "Uploading malware or malicious code",
          "Attempting to bypass platform security measures",
          "Misusing payment systems, including unauthorized chargebacks",
        ],
      },
    ],
  },
  {
    id: "intellectual-property",
    number: "13",
    title: "Intellectual Property",
    blocks: [
      {
        type: "p",
        text: "The Fixly name, logo, branding, website design, software, and platform content are the property of Fixly or its licensors. You may not copy, reproduce, or use Fixly's intellectual property without prior written permission, except as necessary to use the platform as intended.",
      },
    ],
  },
  {
    id: "privacy",
    number: "14",
    title: "Privacy",
    blocks: [
      {
        type: "p",
        text: "Your personal information is handled in accordance with Fixly's Privacy Policy.",
      },
      {
        type: "placeholder-link",
        label: "Privacy Policy",
        note: "(page not yet published)",
      },
    ],
  },
  {
    id: "third-party-services",
    number: "15",
    title: "Third-Party Services",
    blocks: [
      {
        type: "p",
        text: "Fixly may integrate with third-party services to operate the platform, which can include payment processors, authentication providers, maps or location services, analytics, and communication tools. Use of such third-party services may be subject to their own terms.",
      },
    ],
  },
  {
    id: "disclaimers",
    number: "16",
    title: "Disclaimers",
    blocks: [
      {
        type: "p",
        text: "Fixly provides a platform for discovering and coordinating services. Except where explicitly stated, services displayed on the platform are performed by independent providers, and Fixly does not guarantee the quality, safety, timeliness, or legality of services performed by providers.",
      },
      {
        type: "callout",
        tone: "warning",
        text: "This section is a placeholder and requires review by qualified legal counsel before use as binding terms.",
      },
    ],
  },
  {
    id: "limitation-liability",
    number: "17",
    title: "Limitation of Liability",
    blocks: [
      {
        type: "p",
        text: "To the maximum extent permitted by applicable law, Fixly shall not be liable for indirect, incidental, special, or consequential damages arising from use of the platform, subject to [Applicable Jurisdiction — to be confirmed by legal counsel].",
      },
      {
        type: "callout",
        tone: "warning",
        text: "This section requires review and finalization by qualified legal counsel before use as binding terms.",
      },
    ],
  },
  {
    id: "indemnification",
    number: "18",
    title: "Indemnification",
    blocks: [
      {
        type: "p",
        text: "You may be asked to indemnify and hold Fixly harmless from claims, damages, or expenses arising out of your misuse of the platform or violation of these Terms, subject to applicable law.",
      },
      {
        type: "callout",
        tone: "warning",
        text: "Jurisdiction-specific language in this section requires legal review before use as binding terms.",
      },
    ],
  },
  {
    id: "suspension-termination",
    number: "19",
    title: "Suspension and Termination",
    blocks: [
      {
        type: "p",
        text: "Fixly may suspend, restrict, or terminate access to an account under circumstances that may include:",
      },
      {
        type: "list",
        items: [
          "Suspected fraud",
          "Abuse of other users or the platform",
          "Security violations",
          "Violations of these Terms",
          "Illegal activity",
        ],
      },
    ],
  },
  {
    id: "changes-to-terms",
    number: "20",
    title: "Changes to These Terms",
    blocks: [
      {
        type: "p",
        text: "Fixly may update these Terms from time to time. The \"Last Updated\" date at the top of this page reflects the most recent revision. Material changes may be communicated through the platform. Continued use of Fixly after changes take effect constitutes acceptance of the revised Terms.",
      },
    ],
  },
  {
    id: "governing-law",
    number: "21",
    title: "Governing Law / Dispute Resolution",
    blocks: [
      {
        type: "p",
        text: "These Terms are governed by the laws of [Applicable jurisdiction — to be confirmed by legal counsel]. Any disputes arising from use of Fixly will be handled in accordance with applicable law and, where relevant, dispute resolution procedures to be defined by Fixly with legal guidance.",
      },
    ],
  },
  {
    id: "contact",
    number: "22",
    title: "Contact",
    blocks: [
      {
        type: "p",
        text: "If you have questions about these Terms & Conditions, please contact Fixly through the official support channel.",
      },
      {
        type: "p",
        text: "Legal contact: [Legal Contact Email]",
      },
    ],
  },
];

export const SUMMARY_CARDS = [
  { title: "Use Fixly responsibly", key: "responsible" },
  { title: "Provide accurate information", key: "accurate" },
  { title: "Respect customers and providers", key: "respect" },
  { title: "Follow booking and payment rules", key: "rules" },
  { title: "Review the terms before using the platform", key: "review" },
];