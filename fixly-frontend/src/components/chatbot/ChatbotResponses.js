/* ============================================================
   FIXLY ASSISTANT
   Professional Phase 1 chatbot
   Keyword-based conversational assistant
   ============================================================ */

export const QUICK_QUESTIONS = [
  {
    id: "services",
    label: "What services does Fixly offer?",
  },
  {
    id: "find-service",
    label: "I need a service",
  },
  {
    id: "booking-works",
    label: "How does booking work?",
  },
  {
    id: "become-provider",
    label: "How can I become a provider?",
  },
  {
    id: "is-safe",
    label: "Is Fixly safe?",
  },
  {
    id: "contact",
    label: "I need help",
  },
];

/* ============================================================
   FIXLY SERVICES
   ============================================================ */

export const FIXLY_SERVICES = [
  {
    id: "child-care",
    name: "Child Care",
    keywords: [
      "child care",
      "childcare",
      "baby care",
      "babysitter",
      "babysitting",
      "baby sitter",
      "kid care",
    ],
  },

  {
    id: "plumber",
    name: "Plumber",
    keywords: [
      "plumber",
      "plumbing",
      "pipe",
      "water leakage",
      "tap repair",
      "bathroom repair",
    ],
  },

  {
    id: "electrician",
    name: "Electrician",
    keywords: [
      "electrician",
      "electric",
      "electrical",
      "wiring",
      "fan repair",
      "switch repair",
      "light repair",
    ],
  },

  {
    id: "home-cleaning",
    name: "Home Cleaning",
    keywords: [
      "cleaning",
      "home cleaning",
      "house cleaning",
      "deep cleaning",
      "cleaner",
    ],
  },

  {
    id: "painting",
    name: "Painting",
    keywords: [
      "painting",
      "painter",
      "wall painting",
      "house painting",
      "paint",
    ],
  },

  {
    id: "appliance-repair",
    name: "Appliance Repair",
    keywords: [
      "appliance",
      "appliance repair",
      "ac repair",
      "washing machine",
      "refrigerator",
      "fridge",
      "tv repair",
      "microwave",
    ],
  },

  {
    id: "carpenter",
    name: "Carpenter",
    keywords: [
      "carpenter",
      "carpentry",
      "furniture repair",
      "wood work",
      "woodwork",
    ],
  },

  {
    id: "pest-control",
    name: "Pest Control",
    keywords: [
      "pest",
      "pest control",
      "insects",
      "cockroach",
      "termite",
      "mosquito",
    ],
  },

  {
    id: "beauty",
    name: "Beauty Services",
    keywords: [
      "beauty",
      "salon",
      "makeup",
      "haircut",
      "facial",
      "beautician",
    ],
  },

  {
    id: "gardening",
    name: "Gardening",
    keywords: [
      "gardening",
      "gardener",
      "garden",
      "plants",
      "lawn",
    ],
  },
];

/* ============================================================
   RESPONSE DEFINITIONS
   ============================================================ */

const RESPONSES = {
  greeting: {
    text:
      "Hello! 👋 Welcome to Fixly. I'm your Fixly Assistant. I can help you find services, understand bookings, become a service provider, or answer questions about Fixly. How can I help you today?",
  },

  greetingService: {
    text:
      "Absolutely! 👋 Welcome to Fixly. I can help you find the right professional for your needs. Please choose a service from the list below.",
    showServices: true,
  },

  services: {
    text:
      "Fixly connects you with professionals for a variety of home and personal services. Here are some services you can explore:",
    showServices: true,
  },

  findService: {
    text:
      "Sure! 🔎 Tell me what service you need, such as a plumber, electrician, child care, cleaning, painting, or appliance repair. I'll help you find the right option.",
    showServices: true,
    action: {
      label: "Browse Services",
      to: "/search",
    },
  },

  bookingWorks: {
    text:
      "Booking a service with Fixly is simple. Choose the service you need, select a suitable provider, choose your address and preferred date, and confirm your booking. You'll then be able to track your booking from your dashboard.",
  },

  becomeProvider: {
    text:
      "Want to work with Fixly? 🛠️ You can register as a service provider and offer your professional services to customers. You'll need to provide your service and verification details during registration.",
    action: {
      label: "Become a Provider",
      to: "/become-provider",
    },
  },

  safe: {
    text:
      "Fixly is designed to make service booking easier and more reliable. The platform supports provider verification, booking management, OTP-based service verification, ratings and reviews, and account security.",
  },

  contact: {
    text:
      "I'm happy to help. If you need additional assistance, you can visit the Help & Support section for more information.",
    action: {
      label: "Help & Support",
      to: "/help-support",
    },
  },

  bookingStatus: {
    text:
      "You can manage and track your bookings from your Fixly dashboard. Open your bookings section to view your current and previous service requests.",
    action: {
      label: "My Bookings",
      to: "/user/bookings",
    },
  },

  account: {
    text:
      "You can manage your Fixly profile, account information, and security settings from your account section.",
    action: {
      label: "My Profile",
      to: "/profile",
    },
  },

  fallback: {
    text:
      "I'm sorry, I couldn't quite understand that. 🤔 You can ask me about Fixly services, bookings, becoming a provider, safety, or support. You can also choose a service from the list below.",
    showServices: true,
  },
};

/* ============================================================
   NORMALIZE USER TEXT
   ============================================================ */

function normalizeText(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[!?.,;:()[\]{}]/g, " ")
    .replace(/\s+/g, " ");
}

/* ============================================================
   GREETING DETECTION
   ============================================================ */

function isGreeting(text) {
  const normalized = normalizeText(text);

  const greetingPatterns = [
    /^hi$/,
    /^hello$/,
    /^hey$/,
    /^hii$/,
    /^hiii$/,
    /^helo$/,
    /^helloo$/,
    /^good morning$/,
    /^good afternoon$/,
    /^good evening$/,
    /^good night$/,
    /^hi fixly$/,
    /^hello fixly$/,
    /^hey fixly$/,
    /^hi there$/,
    /^hello there$/,
    /^hey there$/,
  ];

  return greetingPatterns.some((pattern) => pattern.test(normalized));
}

/* ============================================================
   SERVICE DETECTION
   ============================================================ */

function findService(text) {
  const normalized = normalizeText(text);

  return FIXLY_SERVICES.find((service) =>
    service.keywords.some((keyword) =>
      normalized.includes(keyword.toLowerCase())
    )
  );
}

/* ============================================================
   INTENT DETECTION
   ============================================================ */

function containsAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

/* ============================================================
   SERVICE RESPONSE
   ============================================================ */

function getServiceResponse(service) {
  return {
    text: `Sure! I can help you find a ${service.name} through Fixly. You can browse available professionals and choose the one that best matches your requirements.`,
    service: service,
    action: {
      label: `Find ${service.name}`,
      to: "/search",
    },
  };
}

/* ============================================================
   RESPONSE BY ID
   ============================================================ */

export function getResponseById(id) {
  return RESPONSES[id] || RESPONSES.fallback;
}

/* ============================================================
   FREE TEXT RESPONSE
   ============================================================ */

export function getResponseForText(text) {
  if (!text || !text.trim()) {
    return RESPONSES.greeting;
  }

  const normalized = normalizeText(text);

  /* ----------------------------------------------------------
     GREETING
     ---------------------------------------------------------- */

  if (isGreeting(normalized)) {
    return RESPONSES.greeting;
  }

  /* ----------------------------------------------------------
     GREETING + SERVICE
     Example:
     "Hi I need a plumber"
     "Hello I need cleaning"
     ---------------------------------------------------------- */

  const detectedService = findService(normalized);

  if (detectedService) {
    return getServiceResponse(detectedService);
  }

  /* ----------------------------------------------------------
     SERVICES
     ---------------------------------------------------------- */

  if (
    containsAny(normalized, [
      "services",
      "service list",
      "what can you do",
      "what services",
      "available services",
      "what does fixly offer",
      "fixly services",
    ])
  ) {
    return RESPONSES.services;
  }

  /* ----------------------------------------------------------
     FIND SERVICE
     ---------------------------------------------------------- */

  if (
    containsAny(normalized, [
      "find service",
      "find a service",
      "need a service",
      "book a service",
      "hire someone",
      "need professional",
      "looking for professional",
    ])
  ) {
    return RESPONSES.findService;
  }

  /* ----------------------------------------------------------
     BOOKING
     ---------------------------------------------------------- */

  if (
    containsAny(normalized, [
      "how booking works",
      "how does booking work",
      "how to book",
      "booking process",
      "booking work",
    ])
  ) {
    return RESPONSES.bookingWorks;
  }

  /* ----------------------------------------------------------
     MY BOOKINGS
     ---------------------------------------------------------- */

  if (
    containsAny(normalized, [
      "my booking",
      "my bookings",
      "booking status",
      "check booking",
      "track booking",
    ])
  ) {
    return RESPONSES.bookingStatus;
  }

  /* ----------------------------------------------------------
     PROVIDER
     ---------------------------------------------------------- */

  if (
    containsAny(normalized, [
      "become provider",
      "be a provider",
      "join fixly",
      "work with fixly",
      "work for fixly",
      "provider registration",
      "register as provider",
    ])
  ) {
    return RESPONSES.becomeProvider;
  }

  /* ----------------------------------------------------------
     SAFETY
     ---------------------------------------------------------- */

  if (
    containsAny(normalized, [
      "is fixly safe",
      "is fixly secure",
      "safe",
      "security",
      "trusted",
      "trust",
      "verified",
    ])
  ) {
    return RESPONSES.safe;
  }

  /* ----------------------------------------------------------
     ACCOUNT / PROFILE
     ---------------------------------------------------------- */

  if (
    containsAny(normalized, [
      "my profile",
      "profile",
      "account",
      "account settings",
      "change password",
    ])
  ) {
    return RESPONSES.account;
  }

  /* ----------------------------------------------------------
     CONTACT / SUPPORT
     ---------------------------------------------------------- */

  if (
    containsAny(normalized, [
      "contact",
      "support",
      "help",
      "customer support",
      "need help",
      "talk to someone",
    ])
  ) {
    return RESPONSES.contact;
  }

  /* ----------------------------------------------------------
     THANK YOU
     ---------------------------------------------------------- */

  if (
    containsAny(normalized, [
      "thank you",
      "thanks",
      "thank",
    ])
  ) {
    return {
      text:
        "You're very welcome! 😊 I'm always here if you need help with Fixly.",
    };
  }

  /* ----------------------------------------------------------
     BYE
     ---------------------------------------------------------- */

  if (
    containsAny(normalized, [
      "bye",
      "goodbye",
      "see you",
    ])
  ) {
    return {
      text:
        "Goodbye! 👋 Thank you for choosing Fixly. Have a great day!",
    };
  }

  /* ----------------------------------------------------------
     FALLBACK
     ---------------------------------------------------------- */

  return RESPONSES.fallback;
}