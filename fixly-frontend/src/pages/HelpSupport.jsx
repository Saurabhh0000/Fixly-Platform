import { useState, useContext, useRef, useEffect } from "react";
import {
  FiSearch,
  FiX,
  FiMail,
  FiPhone,
  FiChevronDown,
  FiShield,
  FiCalendar,
  FiEye,
  FiFileText,
  FiTool,
  FiUser,
  FiHelpCircle,
  FiAward,
  FiArrowRight,
  FiActivity,
  FiStar,
  FiRefreshCw,
  FiZap,
  FiCreditCard,
  FiBell,
  FiDollarSign,
  FiUserPlus,
  FiTrendingUp,
  FiSettings,
  FiClock,
  FiMessageSquare,
} from "react-icons/fi";

import { AuthContext } from "../context/AuthContext";
import "../styles/help-support.css";
import UserLayout from "../layouts/UserLayout";
import ProviderLayout from "../layouts/ProviderLayout";
import ContactModal from "../components/contact/ContactModal";
import HelpTopicModal from "../components/help/HelpTopicModal";

/* ══════════════════════════════════════════════════════════════
   CATEGORY DATA — unchanged from the existing implementation.
   The `detail` shape (intro/steps/notes/tips/links) now powers
   HelpTopicModal instead of an inline accordion panel.
   ══════════════════════════════════════════════════════════════ */

const USER_CATEGORIES = [
  {
    id: "booking",
    icon: <FiCalendar />,
    title: "Booking Services",
    desc: "Find a provider, choose a slot, and confirm your service in minutes.",
    detail: {
      intro:
        "Booking a service on Fixly takes just a few taps. Search for the service you need, compare verified providers nearby, and lock in a time that works for you — no phone calls required.",
      steps: [
        "Tap “Book Service” and select a category (e.g. plumbing, electrical, cleaning).",
        "Enter your address or confirm your saved location so we can show providers near you.",
        "Browse available providers — filter by rating, price, or earliest availability.",
        "Pick a time slot and add any notes about the job (access instructions, specific issue, etc.).",
        "Review the estimated cost and confirm your booking. You'll get an instant confirmation.",
      ],
      notes: [
        "Peak-hour slots (mornings and weekends) fill up quickly — book at least a day ahead when possible.",
      ],
      tips: [
        "Add clear photos of the issue when booking; providers arrive better prepared and diagnose faster.",
        "Save a default address in your profile to speed up future bookings.",
      ],
      links: [{ label: "Book a Service", to: "/search" }],
    },
  },
  {
    id: "booking-status",
    icon: <FiActivity />,
    title: "Booking Status",
    desc: "Track every stage of your booking, from confirmed to completed.",
    detail: {
      intro:
        "Every booking moves through a clear set of stages so you always know what's happening: Confirmed → Provider Assigned → In Progress → Completed. You can check the current stage at any time from My Bookings.",
      steps: [
        "Open “My Bookings” from the navigation bar.",
        "Select the booking you want to check — the status pill at the top shows its current stage.",
        "Tap the booking for a detailed timeline, including the provider's live ETA once they're en route.",
        "You'll receive a notification automatically whenever the status changes.",
      ],
      notes: [
        "If a booking stays “Provider Assigned” for longer than expected, you can message the provider directly or contact support.",
      ],
      tips: [
        "Enable push notifications so you don't have to keep checking the app for updates.",
      ],
      links: [{ label: "Go to My Bookings", to: "/user/bookings" }],
    },
  },
  {
    id: "payments",
    icon: <FiCreditCard />,
    title: "Payments",
    desc: "Manage payment methods, view invoices, and understand pricing.",
    detail: {
      intro:
        "Fixly supports UPI, debit/credit cards, and net banking. Payment is only captured once you confirm a booking, and every transaction is protected by encrypted, tokenised payment infrastructure.",
      steps: [
        "Go to Profile → Payment Methods to add or remove a card, UPI ID, or bank account.",
        "During checkout, select your preferred payment method or use the saved default.",
        "After payment, an invoice is generated automatically and emailed to you.",
        "You can also download any past invoice from My Bookings → select booking → “View Invoice.”",
      ],
      notes: [
        "We never store your raw card number — all payment data is tokenised through our PCI-DSS Level 1 compliant gateway.",
      ],
      tips: ["Set a default payment method to skip a step during checkout."],
      links: [{ label: "Manage Payment Methods", to: "/profile" }],
    },
  },
  {
    id: "reviews",
    icon: <FiStar />,
    title: "Reviews & Ratings",
    desc: "Leave feedback for a completed service or understand how ratings work.",
    detail: {
      intro:
        "Your reviews help other customers choose the right provider and help great providers get discovered. You can rate and review any booking once it's marked complete.",
      steps: [
        "Go to My Bookings and find the completed service you want to review.",
        "Tap “Leave a Review” and choose a star rating from 1 to 5.",
        "Add a written comment describing your experience — be specific, it helps others.",
        "Optionally attach photos of the completed work.",
        "Submit — your review appears on the provider's profile within a few minutes.",
      ],
      notes: [
        "Reviews can only be submitted for bookings you've actually completed, and can be edited once within 48 hours of posting.",
      ],
      tips: [
        "Detailed reviews (what was fixed, how long it took, professionalism) are far more useful than a rating alone.",
      ],
      links: [{ label: "Go to My Bookings", to: "/user/bookings" }],
    },
  },
  {
    id: "account",
    icon: <FiShield />,
    title: "Account & Profile",
    desc: "Update your details, manage addresses, and secure your account.",
    detail: {
      intro:
        "Your profile keeps your contact details, saved addresses, and security settings in one place. Keeping it up to date means faster bookings and accurate provider communication.",
      steps: [
        "Open the profile menu from the navbar and select “Settings.”",
        "Update your name, phone number, or profile photo as needed.",
        "Go to the Addresses section to add, edit, or remove a saved address.",
        "Use “Change Password” to update your login credentials at any time.",
      ],
      notes: [
        "If you change your registered phone number, you'll need to verify it with an OTP before it takes effect.",
      ],
      tips: [
        "Save both a home and work address so switching booking locations only takes one tap.",
      ],
      links: [
        { label: "Go to Profile Settings", to: "/profile" },
        { label: "Change Password", to: "/change-password" },
      ],
    },
  },
  {
    id: "notifications",
    icon: <FiBell />,
    title: "Notifications",
    desc: "Control how and when Fixly notifies you about bookings and offers.",
    detail: {
      intro:
        "Fixly sends notifications for booking confirmations, provider updates, payment receipts, and occasional offers. You're always in control of what you receive and how.",
      steps: [
        "Go to Settings → Notification Preferences.",
        "Toggle push, email, and SMS notifications independently for each category.",
        "Booking-critical alerts (status changes, provider arrival) are recommended to keep enabled.",
        "Promotional notifications can be turned off at any time without affecting booking alerts.",
      ],
      notes: [
        "Disabling all notifications may cause you to miss time-sensitive updates like a provider's arrival window.",
      ],
      tips: [
        "Keep push notifications on for bookings, but feel free to mute promotional emails if they're not useful to you.",
      ],
      links: [{ label: "Manage Notification Settings", to: "/profile" }],
    },
  },
  {
    id: "cancellations",
    icon: <FiRefreshCw />,
    title: "Cancellations",
    desc: "Understand cancellation policies and how to cancel a booking.",
    detail: {
      intro:
        "Plans change — you can cancel a booking directly from the app. What you're charged, if anything, depends on how close to the appointment time you cancel.",
      steps: [
        "Open My Bookings and select the appointment you want to cancel.",
        "Tap “Cancel Booking” and choose a reason from the list.",
        "Confirm the cancellation — you'll see the applicable refund amount before confirming.",
        "You'll receive a confirmation email once the cancellation is processed.",
      ],
      notes: [
        "Cancellations made more than 24 hours before the appointment are fully refunded. Cancellations within 24 hours may incur a partial fee.",
      ],
      tips: [
        "If a provider hasn't been assigned yet, cancelling is instant and always free.",
      ],
      links: [{ label: "Go to My Bookings", to: "/user/bookings" }],
    },
  },
  {
    id: "refunds",
    icon: <FiDollarSign />,
    title: "Refunds",
    desc: "See how refunds are calculated and when the money reaches you.",
    detail: {
      intro:
        "When a refund is due — whether from a cancellation, a provider no-show, or a resolved complaint — it's processed automatically back to your original payment method.",
      steps: [
        "Refunds are triggered automatically after a qualifying cancellation or resolved support case.",
        "Check the refund amount and status from My Bookings → select booking → “Refund Status.”",
        "Card and net banking refunds settle within 3–5 business days.",
        "UPI refunds are typically faster, usually within 1–2 business days.",
      ],
      notes: [
        "If a refund doesn't appear after 5 business days, contact support with your booking ID for a manual check.",
      ],
      tips: [
        "You'll always get an email the moment a refund is initiated — keep an eye on that inbox for the exact timeline.",
      ],
      links: [{ label: "Contact Support", href: "#hs-sidebar-contact" }],
    },
  },
  {
    id: "support",
    icon: <FiMail />,
    title: "Support",
    desc: "Reach our team by email or phone. Available Monday to Saturday.",
    detail: {
      intro:
        "Can't find what you're looking for? Our support team is available Monday through Saturday and typically responds within a few hours.",
      steps: [
        "For account or booking-specific issues, email us with your booking ID for the fastest resolution.",
        "For urgent issues (e.g. a provider who hasn't arrived), call our support line directly.",
        "You can also browse the FAQs below — most common questions are answered there instantly.",
      ],
      notes: [],
      tips: [
        "Including screenshots and your booking ID in your email speeds up resolution significantly.",
      ],
      links: [
        { label: "Email Support", href: "mailto:support@fixly.in" },
        { label: "Call Support", href: "tel:+919876543210" },
      ],
    },
  },
];

const PROVIDER_CATEGORIES = [
  {
    id: "becoming-provider",
    icon: <FiUserPlus />,
    title: "Becoming a Provider",
    desc: "Learn how the application and onboarding process works.",
    detail: {
      intro:
        "Joining Fixly as a service provider takes a few steps: application, document verification, and profile setup. Most applicants are fully onboarded within a week.",
      steps: [
        "Go to “Become a Provider” from your account menu and fill out the application form.",
        "Select your service category(ies) and specify your service area.",
        "Submit the required documents (see Provider Verification below).",
        "Once approved, complete your profile with a photo, bio, and pricing to go live.",
      ],
      notes: [
        "Applications with incomplete or blurry document uploads are the most common cause of delay — double-check clarity before submitting.",
      ],
      tips: [
        "A complete profile with a clear photo and detailed bio gets noticeably more bookings in the first month.",
      ],
      links: [{ label: "Start Your Application", to: "/become-provider" }],
    },
  },
  {
    id: "verification",
    icon: <FiFileText />,
    title: "Provider Verification",
    desc: "Upload your ID, trade certificates, and check your verification status.",
    detail: {
      intro:
        "Verification protects both you and your customers. It confirms your identity and trade qualifications before your profile goes live on Fixly.",
      steps: [
        "Go to Provider Dashboard → Verification.",
        "Upload a government-issued photo ID (Aadhaar, PAN, driving licence, or passport).",
        "Upload your relevant trade certificate or licence, if applicable to your category.",
        "Submit for review — standard verification takes 2–4 business days.",
      ],
      notes: [
        "You'll receive an email the moment your profile is approved and live on Fixly. If more information is needed, we'll email you exactly what's missing.",
      ],
      tips: [
        "Scan documents in good lighting with all four corners visible to avoid review delays.",
      ],
      links: [{ label: "Go to Verification", to: "/provider/dashboard" }],
    },
  },
  {
    id: "managing-bookings",
    icon: <FiCalendar />,
    title: "Managing Bookings",
    desc: "Accept, reschedule, and communicate with clients on incoming jobs.",
    detail: {
      intro:
        "Every new booking request appears in your Provider Dashboard. You can accept, propose a new time, or decline — and message the customer directly for any clarification.",
      steps: [
        "Open Provider Dashboard → Bookings to see incoming, upcoming, and completed jobs.",
        "Tap a request to view job details, customer notes, and location.",
        "Accept the booking, or propose an alternate time if the slot doesn't work.",
        "Use in-app messaging to confirm access details before you head out.",
        "Mark the job “Completed” once finished so the customer can review it.",
      ],
      notes: [
        "Repeatedly declining or missing bookings can lower your visibility in search results.",
      ],
      tips: [
        "Confirm arrival time with the customer an hour before to reduce no-shows on both sides.",
      ],
      links: [{ label: "Go to Provider Dashboard", to: "/provider/dashboard" }],
    },
  },
  {
    id: "availability",
    icon: <FiEye />,
    title: "Availability",
    desc: "Set your working hours, service area, and control your listing status.",
    detail: {
      intro:
        "Your availability calendar controls when customers can book you. Keeping it current is the single biggest factor in how often you appear in search.",
      steps: [
        "Go to Provider Dashboard → Availability.",
        "Set your working days and hours for the upcoming week(s).",
        "Adjust your service radius if you want to cover a wider or narrower area.",
        "Use “Pause Profile” if you need to go temporarily offline (holiday, fully booked, etc.).",
      ],
      notes: [
        "Profiles with no availability set for the coming week are automatically deprioritised in search results.",
      ],
      tips: [
        "Update your calendar at the start of each week — a five-minute habit that noticeably increases bookings.",
      ],
      links: [{ label: "Manage Availability", to: "/provider/dashboard" }],
    },
  },
  {
    id: "earnings",
    icon: <FiTrendingUp />,
    title: "Earnings",
    desc: "Understand payouts, timelines, and how to track your income.",
    detail: {
      intro:
        "Your Earnings dashboard shows completed jobs, pending payouts, and full payment history, so you always know what's coming and when.",
      steps: [
        "Go to Provider Dashboard → Earnings to view your current balance and history.",
        "Payouts are released 24 hours after a job is marked complete and the review window closes.",
        "Funds are transferred to your registered bank account within 1–2 business days.",
        "Download monthly statements for your records from the Earnings tab.",
      ],
      notes: [
        "Make sure your bank details are correct in Account Management — incorrect details are the most common cause of delayed payouts.",
      ],
      tips: [
        "Completing jobs promptly and closing the review window faster gets your payout released sooner.",
      ],
      links: [{ label: "View Earnings", to: "/provider/dashboard" }],
    },
  },
  {
    id: "ratings",
    icon: <FiAward />,
    title: "Ratings",
    desc: "Learn how your score is calculated and how to respond to feedback.",
    detail: {
      intro:
        "Your public rating is a recency-weighted average of verified, post-service reviews — recent jobs count more than older ones, keeping your score reflective of your current work.",
      steps: [
        "A minimum of 5 completed jobs is required before a public rating appears on your profile.",
        "Reviews from the last 90 days carry more weight than older reviews.",
        "You can respond publicly to any review from Provider Dashboard → Reviews.",
        "If you believe a review violates guidelines, you can flag it for our team to investigate.",
      ],
      notes: [
        "Flagged reviews are reviewed within 3 business days using job photos, timestamps, and message history.",
      ],
      tips: [
        "A brief, professional public reply to critical reviews often reassures future customers more than the review itself concerns them.",
      ],
      links: [{ label: "View Your Reviews", to: "/provider/dashboard" }],
    },
  },
  {
    id: "provider-notifications",
    icon: <FiBell />,
    title: "Notifications",
    desc: "Stay on top of new bookings, messages, and payout alerts.",
    detail: {
      intro:
        "As a provider, timely notifications are critical — a missed booking alert can mean a lost job. Configure exactly what you're notified about and how.",
      steps: [
        "Go to Provider Dashboard → Settings → Notifications.",
        "Keep “New Booking Requests” on push and SMS for the fastest response time.",
        "Enable payout notifications to know the moment funds are transferred.",
        "Customer message alerts can be set to push-only if you prefer a quieter inbox.",
      ],
      notes: [
        "New booking requests typically expire if not accepted within a set response window — keep alerts on to avoid missing jobs.",
      ],
      tips: [
        "Providers who respond to new requests within 15 minutes see meaningfully higher acceptance-to-booking rates.",
      ],
      links: [{ label: "Notification Settings", to: "/provider/dashboard" }],
    },
  },
  {
    id: "account-management",
    icon: <FiSettings />,
    title: "Account Management",
    desc: "Manage your business details, bank account, and login security.",
    detail: {
      intro:
        "Your provider account settings cover everything from business information to payout details and login security — all in one place.",
      steps: [
        "Go to Provider Dashboard → Account Settings.",
        "Update your business name, service categories, and contact details as needed.",
        "Add or update your bank account details for payouts.",
        "Use “Change Password” to keep your login secure, and enable two-factor login if available.",
      ],
      notes: [
        "Changes to bank account details may trigger a short re-verification hold on your next payout for security.",
      ],
      tips: [
        "Review your account details each quarter to make sure everything (bank, service area, categories) is current.",
      ],
      links: [
        { label: "Go to Account Settings", to: "/provider/dashboard" },
        { label: "Change Password", to: "/change-password" },
      ],
    },
  },
];

const USER_FAQS = [
  {
    q: "How do I reschedule or cancel a booking?",
    a: "Go to My Bookings, select the appointment, and tap Reschedule or Cancel. Cancellations made more than 24 hours before the appointment are fully refunded. Cancellations within 24 hours may incur a fee per our cancellation policy.",
  },
  {
    q: "When will my refund arrive after cancellation?",
    a: "Refunds are processed within 3–5 business days to your original payment method. UPI transactions typically reflect faster, within 1–2 business days. You'll receive an email confirmation once the refund is initiated.",
  },
  {
    q: "Can I request a specific service provider?",
    a: "Yes. When booking, use the 'Choose Provider' option to browse available professionals in your area. You can filter by rating, experience, and reviews to find the right match.",
  },
  {
    q: "What if my provider doesn't show up?",
    a: "Mark the booking as 'Provider No-Show' in the app within 30 minutes of the scheduled time. You'll receive a full refund, and our team will reach out to help you rebook at your earliest convenience.",
  },
  {
    q: "Is my payment information secure?",
    a: "Yes. Fixly uses PCI-DSS Level 1 compliant payment infrastructure. We never store raw card details — all payment data is tokenised through our encrypted gateway and is never shared with service providers.",
  },
  {
    q: "How do I leave a review after a service?",
    a: "You'll receive a review prompt via email and in-app notification once your service is marked complete. You can also go to My Bookings, select the completed job, and tap Leave a Review.",
  },
];

const PROVIDER_FAQS = [
  {
    q: "How long does profile verification take?",
    a: "Standard verification takes 2–4 business days after all required documents are submitted — typically a government-issued ID and your relevant trade certificate. You'll receive an email once your profile is approved and live on Fixly.",
  },
  {
    q: "Why isn't my profile appearing in search results?",
    a: "Visibility depends on your verification status, availability calendar, and service area settings. Ensure your working hours are set for the coming week and your service radius covers the area being searched. Profiles with no upcoming availability are deprioritised.",
  },
  {
    q: "How is my star rating calculated?",
    a: "Your rating is a recency-weighted average of verified post-service reviews. Reviews from the past 90 days carry more weight than older ones. A minimum of 5 completed jobs is required before a public score appears on your profile.",
  },
  {
    q: "What happens if a client files a complaint?",
    a: "Our team reviews all complaints using job photos, GPS timestamps, and message history. You'll be notified immediately and given 48 hours to submit your response before any action is taken.",
  },
  {
    q: "How and when do payouts arrive?",
    a: "Payouts are released 24 hours after a job is marked complete and the client's review window closes. Funds reach your registered bank account within 1–2 business days. View all payout history in your Earnings dashboard.",
  },
  {
    q: "Can I pause my profile temporarily?",
    a: "Yes. Go to Account Settings → Profile Status → Pause Profile. Your listing will be hidden from search while existing bookings remain active. You can reactivate at any time with no waiting period.",
  },
];

/* ── Hero Artwork — unchanged ─────────────────────────────────── */
const RING_LABELS = [
  { label: "Users", angle: 0, ring: 1 },
  { label: "Providers", angle: 51.4, ring: 1 },
  { label: "Services", angle: 102.8, ring: 1 },
  { label: "Bookings", angle: 154.3, ring: 1 },
  { label: "Reviews", angle: 205.7, ring: 1 },
  { label: "Trust", angle: 257.1, ring: 1 },
  { label: "Payments", angle: 308.6, ring: 1 },
  { label: "Support", angle: 360, ring: 1 },
];

function HeroArtwork() {
  const cx = 210;
  const cy = 220;
  const rings = [148, 108, 72, 44, 22];

  return (
    <div className="hs-hero-art" aria-hidden="true">
      <svg
        className="hs-hero-art-svg"
        viewBox="0 0 420 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="artGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.20" />
            <stop offset="55%" stopColor="#22c55e" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="0.40" />
            <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx={cx} cy={cy} rx="190" ry="190" fill="url(#artGlow)" />

        {rings.map((r, i) => (
          <circle
            key={r}
            cx={cx}
            cy={cy}
            r={r}
            stroke={`rgba(34,197,94,${0.08 + i * 0.04})`}
            strokeWidth="0.75"
          />
        ))}

        <circle
          cx={cx}
          cy={cy}
          r={rings[1]}
          stroke="rgba(74,222,128,0.18)"
          strokeWidth="0.75"
          strokeDasharray="2 16"
          strokeLinecap="round"
        />
        <circle
          cx={cx}
          cy={cy}
          r={rings[3]}
          stroke="rgba(74,222,128,0.22)"
          strokeWidth="0.75"
          strokeDasharray="2 10"
          strokeLinecap="round"
        />

        <circle
          cx={cx}
          cy={cy}
          r={rings[0]}
          stroke="rgba(34,197,94,0.14)"
          strokeWidth="0.75"
          strokeDasharray="1 20"
          strokeLinecap="round"
        />

        {RING_LABELS.slice(0, 7).map(({ label, angle }) => {
          const rad = (angle * Math.PI) / 180;
          const nx = cx + rings[0] * Math.sin(rad);
          const ny = cy - rings[0] * Math.cos(rad);
          const lx = cx + (rings[0] + 22) * Math.sin(rad);
          const ly = cy - (rings[0] + 22) * Math.cos(rad);
          const anchor =
            Math.abs(rad - Math.PI) < 0.3 || Math.abs(rad) < 0.3
              ? "middle"
              : rad > Math.PI
                ? "end"
                : "start";
          return (
            <g key={label} className="hs-art-node">
              <line
                x1={cx + rings[2] * Math.sin(rad)}
                y1={cy - rings[2] * Math.cos(rad)}
                x2={nx}
                y2={ny}
                stroke="rgba(34,197,94,0.12)"
                strokeWidth="0.5"
              />
              <circle cx={nx} cy={ny} r="3.5" fill="rgba(74,222,128,0.60)" />
              <circle cx={nx} cy={ny} r="1.5" fill="#4ade80" />
              <text
                x={lx}
                y={ly + 4}
                textAnchor={anchor}
                fill="rgba(255,255,255,0.28)"
                fontSize="9"
                fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                fontWeight="600"
                letterSpacing="0.06em">
                {label.toUpperCase()}
              </text>
            </g>
          );
        })}

        <circle r="3" fill="#22c55e" opacity="0.80">
          <animateMotion
            dur="20s"
            repeatCount="indefinite"
            path={`M ${cx} ${cy - rings[0]} a ${rings[0]} ${rings[0]} 0 1 1 -0.01 0`}
          />
        </circle>

        <circle r="2.5" fill="#4ade80" opacity="0.55">
          <animateMotion
            dur="15s"
            repeatCount="indefinite"
            path={`M ${cx} ${cy + rings[1]} a ${rings[1]} ${rings[1]} 0 1 0 0.01 0`}
          />
        </circle>

        <circle r="2" fill="#86efac" opacity="0.50">
          <animateMotion
            dur="11s"
            repeatCount="indefinite"
            path={`M ${cx + rings[2]} ${cy} a ${rings[2]} ${rings[2]} 0 1 1 -0.01 0`}
          />
        </circle>

        <circle cx={cx} cy={cy} r="22" fill="url(#coreGlow)" />
        <circle cx={cx} cy={cy} r="9" fill="rgba(74,222,128,0.35)" />
        <circle cx={cx} cy={cy} r="4.5" fill="rgba(74,222,128,0.70)" />
        <circle cx={cx} cy={cy} r="2" fill="#4ade80" />

        <text
          x={cx}
          y={cy + 24}
          textAnchor="middle"
          fill="rgba(255,255,255,0.22)"
          fontSize="8.5"
          fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
          fontWeight="700"
          letterSpacing="0.10em">
          FIXLY
        </text>

        <line
          x1={cx - 14}
          y1={cy}
          x2={cx + 14}
          y2={cy}
          stroke="rgba(74,222,128,0.15)"
          strokeWidth="0.5"
        />
        <line
          x1={cx}
          y1={cy - 14}
          x2={cx}
          y2={cy + 14}
          stroke="rgba(74,222,128,0.15)"
          strokeWidth="0.5"
        />

        {[
          [330, 60],
          [380, 140],
          [340, 310],
          [80, 340],
          [50, 160],
          [110, 80],
          [370, 260],
          [60, 280],
        ].map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i % 2 === 0 ? 1.5 : 1}
            fill={`rgba(74,222,128,${0.2 + (i % 3) * 0.08})`}
          />
        ))}
      </svg>
    </div>
  );
}

/* ── Help Topic Card — compact, fully clickable, opens the modal ── */
function HelpTopicCard({ cat, onOpen }) {
  return (
    <button
      type="button"
      className="hs-topic-card"
      onClick={() => onOpen(cat)}
      aria-haspopup="dialog">
      <div className="hs-topic-card-icon-wrap" aria-hidden>
        <span className="hs-topic-card-icon">{cat.icon}</span>
      </div>
      <div className="hs-topic-card-body">
        <h3 className="hs-topic-card-title">{cat.title}</h3>
        <p className="hs-topic-card-desc">{cat.desc}</p>
        <span className="hs-topic-card-link">
          Read guide <FiArrowRight aria-hidden />
        </span>
      </div>
    </button>
  );
}

/* ── FAQ Item — unchanged ──────────────────────────────────────── */
function FaqItem({ item, index, isOpen, onToggle }) {
  const bodyRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (bodyRef.current) setHeight(isOpen ? bodyRef.current.scrollHeight : 0);
  }, [isOpen]);

  return (
    <div className={"hs-faq" + (isOpen ? " hs-faq--open" : "")}>
      <button
        className="hs-faq-trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={"faq-body-" + index}>
        <span className="hs-faq-num" aria-hidden>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="hs-faq-q">{item.q}</span>
        <span className="hs-faq-chevron" aria-hidden>
          <FiChevronDown />
        </span>
      </button>
      <div
        id={"faq-body-" + index}
        className="hs-faq-body"
        style={{ maxHeight: height + "px" }}
        ref={bodyRef}
        role="region">
        <p className="hs-faq-answer">{item.a}</p>
      </div>
    </div>
  );
}

/* ── Contact Card — unchanged ──────────────────────────────────── */
function ContactCard({ role }) {
  const isProvider = role === "PROVIDER";
  return (
    <div className="hs-contact" id="hs-sidebar-contact">
      <div className="hs-contact-glow" aria-hidden />
      <div className="hs-contact-head">
        <div className="hs-contact-badge" aria-hidden>
          <FiZap />
        </div>
        <div>
          <h3 className="hs-contact-title">
            {isProvider ? "Provider Support" : "Customer Support"}
          </h3>
          <p className="hs-contact-sub">We're here to help.</p>
        </div>
      </div>
      <ul className="hs-contact-list" aria-label="Contact details">
        <li className="hs-contact-row">
          <span className="hs-contact-row-icon" aria-hidden>
            <FiMail />
          </span>
          <div>
            <span className="hs-contact-lbl">Email</span>
            <a
              href={
                "mailto:" +
                (isProvider ? "providers@fixly.in" : "support@fixly.in")
              }
              className="hs-contact-val hs-contact-link">
              {isProvider ? "providers@fixly.in" : "support@fixly.in"}
            </a>
          </div>
        </li>
        <li className="hs-contact-row">
          <span className="hs-contact-row-icon" aria-hidden>
            <FiPhone />
          </span>
          <div>
            <span className="hs-contact-lbl">Phone</span>
            <a
              href="tel:+919876543210"
              className="hs-contact-val hs-contact-link">
              +91 98765 43210
            </a>
          </div>
        </li>
        <li className="hs-contact-row">
          <span className="hs-contact-row-icon" aria-hidden>
            <FiClock />
          </span>
          <div>
            <span className="hs-contact-lbl">Hours</span>
            <span className="hs-contact-val">Mon – Sat, 9 AM – 6 PM</span>
          </div>
        </li>
      </ul>
    </div>
  );
}

/* ── Role Chip — unchanged ─────────────────────────────────────── */
function RoleChip({ role }) {
  return (
    <div className="hs-role-chip">
      <div className="hs-role-icon-wrap" aria-hidden>
        <FiUser />
      </div>
      <div>
        <strong className="hs-role-label">
          Viewing as {role === "USER" ? "Customer" : "Provider"}
        </strong>
        <p className="hs-role-sub">
          Content is tailored for your account type.
        </p>
      </div>
    </div>
  );
}

/* ── Empty State — unchanged ───────────────────────────────────── */
function EmptyState({ loggedIn }) {
  return (
    <main className="hs-empty">
      <div className="hs-empty-icon" aria-hidden>
        <FiHelpCircle />
      </div>
      <h2 className="hs-empty-title">
        {loggedIn ? "Content unavailable" : "Sign in to view help"}
      </h2>
      <p className="hs-empty-body">
        {loggedIn
          ? "We couldn't load your help content. Please refresh the page."
          : "Sign in to see help articles and FAQs tailored to your account type."}
      </p>
      <button className="hs-empty-btn">
        {loggedIn ? "Refresh page" : "Go to sign in"}
      </button>
    </main>
  );
}

/* ── Search helper: checks title, desc, intro, steps, notes, tips ── */
function matchesQuery(cat, query) {
  if (!query) return true;
  const q = query.toLowerCase();
  const detail = cat.detail || {};
  const haystacks = [
    cat.title,
    cat.desc,
    detail.intro,
    ...(detail.steps || []),
    ...(detail.notes || []),
    ...(detail.tips || []),
  ];
  return haystacks.some((h) => (h || "").toLowerCase().includes(q));
}

/* ── Page ───────────────────────────────────────────────────────── */
export default function HelpSupport() {
  const { user } = useContext(AuthContext);
  const [query, setQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [contactOpen, setContactOpen] = useState(false);
  const searchRef = useRef(null);

  const isUser = user?.role === "USER";
  const isProvider = user?.role === "PROVIDER";
  const hasRole = isUser || isProvider;
  const categories = isUser
    ? USER_CATEGORIES
    : isProvider
      ? PROVIDER_CATEGORIES
      : [];
  const faqs = isUser ? USER_FAQS : isProvider ? PROVIDER_FAQS : [];
  const roleLabel = isUser ? "Customer" : isProvider ? "Provider" : "";
  const trimmedQuery = query.trim();
  const filtered = trimmedQuery
    ? categories.filter((c) => matchesQuery(c, trimmedQuery))
    : categories;

  if (!hasRole) return <EmptyState loggedIn={!!user} />;
  const Layout = isProvider ? ProviderLayout : UserLayout;

  // Topic modal "Contact Us" → close topic modal, then open ContactModal.
  const handleContactFromTopic = () => {
    setSelectedTopic(null);
    setContactOpen(true);
  };

  return (
    <Layout>
      <div className="hs-root">
        {/* ── Hero ──────────────────────────────────────────── */}
        <header className="hs-hero">
          <div className="hs-hero-grid" aria-hidden />
          <div className="hs-hero-glow" aria-hidden />

          <div className="hs-hero-inner">
            {/* Left */}
            <div className="hs-hero-left">
              <div className="hs-eyebrow">
                <FiTool className="hs-eyebrow-icon" aria-hidden />
                <span>Help &amp; Support</span>
              </div>

              <h1 className="hs-hero-title">
                How can we
                <br />
                <em className="hs-title-accent">help?</em>
              </h1>

              <p className="hs-hero-sub">
                Find answers to common questions and get assistance when you
                need it.
              </p>

              <div className="hs-search-wrap">
                <label htmlFor="hs-search" className="hs-sr-only">
                  Search help topics
                </label>
                <FiSearch className="hs-search-prefix" aria-hidden />
                <input
                  id="hs-search"
                  ref={searchRef}
                  className="hs-search"
                  type="search"
                  placeholder="Search help topics…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoComplete="off"
                />
                {query && (
                  <button
                    className="hs-search-clear"
                    onClick={() => {
                      setQuery("");
                      searchRef.current?.focus();
                    }}
                    aria-label="Clear search">
                    <FiX />
                  </button>
                )}
              </div>

              <div className="hs-hero-cta-row">
                <button
                  type="button"
                  className="hs-hero-contact-btn"
                  onClick={() => setContactOpen(true)}>
                  <FiMessageSquare aria-hidden />
                  Contact Us
                </button>

                <div
                  className="hs-hero-pills"
                  role="list"
                  aria-label="Contact options">
                  <a
                    href="mailto:support@fixly.in"
                    className="hs-pill"
                    role="listitem">
                    <FiMail className="hs-pill-icon" aria-hidden />
                    support@fixly.in
                  </a>
                  <span className="hs-pill hs-pill--muted" role="listitem">
                    <FiClock className="hs-pill-icon" aria-hidden />
                    Mon – Sat, 9 AM – 6 PM
                  </span>
                </div>
              </div>
            </div>

            {/* Right — decorative artwork */}
            <HeroArtwork />
          </div>
        </header>

        {/* ── Page body ─────────────────────────────────────── */}
        <main className="hs-page" id="main-content">
          <div className="hs-layout">
            <div className="hs-col-main">
              {/* Category section */}
              <section className="hs-section" aria-labelledby="hs-cat-heading">
                <div className="hs-section-hdr">
                  <div>
                    <span className="hs-section-eyebrow">Browse topics</span>
                    <h2 id="hs-cat-heading" className="hs-section-title">
                      {trimmedQuery
                        ? `Results for "${trimmedQuery}"`
                        : `${roleLabel} Help Topics`}
                    </h2>
                  </div>
                  <span className="hs-count-chip">
                    {filtered.length}{" "}
                    {filtered.length === 1 ? "topic" : "topics"}
                  </span>
                </div>

                {!trimmedQuery && (
                  <p className="hs-section-note">
                    Find answers and step-by-step guides for common Fixly
                    questions.
                  </p>
                )}

                {filtered.length > 0 ? (
                  <div className="hs-grid">
                    {filtered.map((cat) => (
                      <HelpTopicCard
                        key={cat.id}
                        cat={cat}
                        onOpen={setSelectedTopic}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="hs-no-results" role="status">
                    <FiSearch className="hs-no-results-icon" aria-hidden />
                    <p>
                      No help topics found for <strong>"{trimmedQuery}"</strong>
                      . Try a different search term or contact our support team.
                    </p>
                    <button
                      type="button"
                      className="hs-no-results-btn"
                      onClick={() => setContactOpen(true)}>
                      <FiMessageSquare aria-hidden />
                      Contact Us
                    </button>
                  </div>
                )}
              </section>

              {/* FAQ section */}
              {!trimmedQuery && (
                <section
                  className="hs-section"
                  aria-labelledby="hs-faq-heading">
                  <div className="hs-section-hdr">
                    <div>
                      <span className="hs-section-eyebrow">Self-service</span>
                      <h2 id="hs-faq-heading" className="hs-section-title">
                        Frequently Asked Questions
                      </h2>
                    </div>
                    <span className="hs-count-chip">{faqs.length} answers</span>
                  </div>
                  <div className="hs-faq-list">
                    {faqs.map((item, i) => (
                      <FaqItem
                        key={i}
                        item={item}
                        index={i}
                        isOpen={openFaq === i}
                        onToggle={() => setOpenFaq((p) => (p === i ? null : i))}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Bottom support CTA */}
              <section
                className="hs-bottom-cta"
                aria-labelledby="hs-bottom-cta-title">
                <h2 id="hs-bottom-cta-title" className="hs-bottom-cta-title">
                  Still need help?
                </h2>
                <p className="hs-bottom-cta-text">
                  Our support team is here to help with bookings, accounts,
                  providers, payments and more.
                </p>
                <button
                  type="button"
                  className="hs-bottom-cta-btn"
                  onClick={() => setContactOpen(true)}>
                  <FiMessageSquare aria-hidden />
                  Contact Us
                </button>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="hs-col-side" aria-label="Contact information">
              <ContactCard role={user.role} />
              <RoleChip role={user.role} />
            </aside>
          </div>
        </main>
      </div>

      <HelpTopicModal
        topic={selectedTopic}
        onClose={() => setSelectedTopic(null)}
        onContactClick={handleContactFromTopic}
      />

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </Layout>
  );
}
