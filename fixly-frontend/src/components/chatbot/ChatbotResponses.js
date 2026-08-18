/* ============================================================
   FIXLY ASSISTANT
   Professional conversational assistant
   Phase 1: Smart keyword + intent based assistant

   Response contract:
   {
     text: string,
     action?: {
       label: string,
       to: string
     },
     showServices?: boolean,
     service?: object
   }

   Later this can be replaced with a backend AI service without
   changing the chatbot UI.
   ============================================================ */


/* ============================================================
   QUICK QUESTIONS
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
   FIXLY SERVICE DIRECTORY
   ============================================================ */

export const FIXLY_SERVICES = [
  {
    id: "child-care",
    name: "Child Care",
    description:
      "Find professionals who can assist with child and baby care needs.",
    keywords: [
      "child care",
      "childcare",
      "baby care",
      "babysitter",
      "babysitting",
      "baby sitter",
      "kid care",
      "kids care",
      "child sitter",
      "baby sitter service",
      "nanny",
      "nanny service",
      "care for child",
      "care for baby",
    ],
  },

  {
    id: "plumber",
    name: "Plumber",
    description:
      "Get help with plumbing issues such as leaks, taps, pipes and bathroom fittings.",
    keywords: [
      "plumber",
      "plumbing",
      "pipe",
      "pipes",
      "water leakage",
      "water leak",
      "leakage",
      "tap repair",
      "tap",
      "faucet",
      "bathroom repair",
      "sink repair",
      "toilet repair",
      "drainage",
      "drain",
      "blocked pipe",
      "water pipe",
    ],
  },

  {
    id: "electrician",
    name: "Electrician",
    description:
      "Find professionals for electrical repairs, wiring, lights, fans and switches.",
    keywords: [
      "electrician",
      "electric",
      "electrical",
      "electric work",
      "electrical work",
      "wiring",
      "wire",
      "rewiring",
      "fan repair",
      "fan installation",
      "switch repair",
      "switch",
      "light repair",
      "light installation",
      "socket",
      "power issue",
      "electrical repair",
      "short circuit",
    ],
  },

  {
    id: "home-cleaning",
    name: "Home Cleaning",
    description:
      "Book professionals for home cleaning, deep cleaning and general household cleaning.",
    keywords: [
      "cleaning",
      "home cleaning",
      "house cleaning",
      "deep cleaning",
      "cleaner",
      "cleaning service",
      "room cleaning",
      "bathroom cleaning",
      "kitchen cleaning",
      "sofa cleaning",
      "floor cleaning",
      "home cleaner",
    ],
  },

  {
    id: "painting",
    name: "Painting",
    description:
      "Find painters for walls, rooms, homes and other painting requirements.",
    keywords: [
      "painting",
      "painter",
      "painters",
      "wall painting",
      "house painting",
      "home painting",
      "room painting",
      "paint",
      "painting service",
      "wall paint",
      "interior painting",
      "exterior painting",
    ],
  },

  {
    id: "appliance-repair",
    name: "Appliance Repair",
    description:
      "Get professional help for household appliance repair and maintenance.",
    keywords: [
      "appliance",
      "appliance repair",
      "ac repair",
      "air conditioner",
      "air conditioning",
      "washing machine",
      "washing machine repair",
      "refrigerator",
      "refrigerator repair",
      "fridge",
      "fridge repair",
      "tv repair",
      "television repair",
      "microwave",
      "microwave repair",
      "cooler repair",
      "home appliance",
    ],
  },

  {
    id: "carpenter",
    name: "Carpenter",
    description:
      "Find carpenters for furniture repair, woodwork, fittings and installation.",
    keywords: [
      "carpenter",
      "carpentry",
      "carpenters",
      "furniture repair",
      "furniture",
      "wood work",
      "woodwork",
      "wooden work",
      "door repair",
      "door fitting",
      "cabinet repair",
      "shelf",
      "shelf installation",
      "table repair",
      "chair repair",
    ],
  },

  {
    id: "pest-control",
    name: "Pest Control",
    description:
      "Get professional assistance for common household pest problems.",
    keywords: [
      "pest",
      "pest control",
      "insects",
      "cockroach",
      "cockroaches",
      "termite",
      "termites",
      "mosquito",
      "mosquitoes",
      "ants",
      "bed bugs",
      "bedbug",
      "rat",
      "rats",
      "rodent",
      "rodents",
      "insect control",
    ],
  },

  {
    id: "beauty",
    name: "Beauty Services",
    description:
      "Explore beauty and personal care services available through Fixly.",
    keywords: [
      "beauty",
      "beauty service",
      "salon",
      "makeup",
      "make up",
      "haircut",
      "hair cut",
      "facial",
      "beautician",
      "hair service",
      "grooming",
      "personal grooming",
    ],
  },

  {
    id: "gardening",
    name: "Gardening",
    description:
      "Find professionals for gardening, plants, lawns and garden maintenance.",
    keywords: [
      "gardening",
      "gardener",
      "garden",
      "plants",
      "plant care",
      "lawn",
      "lawn care",
      "garden maintenance",
      "tree care",
      "plant maintenance",
    ],
  },
];


/* ============================================================
   COMMON RESPONSE HELPERS
   ============================================================ */

const RESPONSES = {

  /* ----------------------------------------------------------
     GREETINGS
     ---------------------------------------------------------- */

  greeting: {
    text:
      "Hello! 👋 Welcome to Fixly. I'm your Fixly Assistant. I can help you discover services, find the right professional, understand bookings, learn about provider registration, or answer questions about using Fixly. What can I help you with today?",
  },

  morning: {
    text:
      "Good morning! ☀️ Welcome to Fixly. I'm your Fixly Assistant. Whether you need help at home or want to find a professional, I'm here to help. What service are you looking for today?",
  },

  afternoon: {
    text:
      "Good afternoon! 👋 Welcome to Fixly. How can I help you today? I can help you find a service, understand the booking process, or answer questions about Fixly.",
  },

  evening: {
    text:
      "Good evening! 🌙 Welcome to Fixly. Tell me what you need help with and I'll guide you toward the right service.",
  },


  /* ----------------------------------------------------------
     ABOUT FIXLY
     ---------------------------------------------------------- */

  aboutFixly: {
    text:
      "Fixly is a service booking platform that connects users with service professionals. You can discover services, find suitable providers, manage bookings, choose your service address, and keep track of your requests from your Fixly account.",
  },

  whatCanYouDo: {
    text:
      "I can help you with several things on Fixly. 😊 For example, you can ask me about available services, finding a plumber or electrician, booking a service, becoming a provider, provider verification, ratings and reviews, booking status, safety, your account, or getting support.",
  },


  /* ----------------------------------------------------------
     SERVICES
     ---------------------------------------------------------- */

  services: {
    text:
      "Fixly offers a range of home and personal services. Here are some of the services you can explore:",
    showServices: true,
  },

  findService: {
    text:
      "Absolutely! 🔎 Tell me what you need help with. For example, you can say 'I need a plumber', 'I need someone to clean my house', 'I need an electrician', or 'I need child care'. You can also choose from the services below.",
    showServices: true,
    action: {
      label: "Browse Services",
      to: "/search",
    },
  },


  /* ----------------------------------------------------------
     BOOKING
     ---------------------------------------------------------- */

  bookingWorks: {
    text:
      "Booking on Fixly is designed to be simple. First, choose the service you need. Then browse the available professionals, select a suitable provider, choose your address and preferred service date, and submit your booking request. You can then manage the booking from your dashboard.",
  },

  bookingSteps: {
    text:
      "Here's the basic Fixly booking flow:\n\n1. Choose a service.\n2. Find a suitable professional.\n3. Select your service address.\n4. Choose your preferred date.\n5. Submit the booking request.\n6. Track the booking from your dashboard.\n7. Complete the service using the applicable verification process.",
  },

  bookingStatus: {
    text:
      "You can check your current and previous bookings from your Fixly dashboard. The booking section helps you keep track of your service requests and their current status.",
    action: {
      label: "My Bookings",
      to: "/user/bookings",
    },
  },

  bookingCancel: {
    text:
      "If you need to cancel a booking, first check the booking status and the available actions in your dashboard. If the cancellation option isn't available or you need assistance, please contact Fixly support.",
    action: {
      label: "Help & Support",
      to: "/help-support",
    },
  },

  bookingReschedule: {
    text:
      "If you need to change your service date, check whether rescheduling is available for your booking. If you cannot change it from your dashboard, Fixly Support can guide you further.",
    action: {
      label: "Help & Support",
      to: "/help-support",
    },
  },


  /* ----------------------------------------------------------
     PROVIDER
     ---------------------------------------------------------- */

  becomeProvider: {
    text:
      "Interested in working with Fixly? 🛠️ You can register as a service provider and offer your professional services to customers. During registration, you'll provide information about your service, experience and required verification details.",
    action: {
      label: "Become a Provider",
      to: "/become-provider",
    },
  },

  providerVerification: {
    text:
      "Fixly uses provider verification as part of its service marketplace. Provider registration may require professional and identity-related information so the platform can review the provider before they become available for customers.",
  },

  providerApproval: {
    text:
      "After a provider submits their registration information, the request can go through the platform's verification and approval process. Once approved, the provider can use the provider features available to their account.",
  },


  /* ----------------------------------------------------------
     SAFETY / TRUST
     ---------------------------------------------------------- */

  safe: {
    text:
      "Fixly is designed with trust and reliability in mind. The platform supports provider verification, secure account authentication, booking management, OTP-based service verification, ratings and reviews, and administrative oversight.",
  },

  verification: {
    text:
      "Provider verification helps Fixly maintain a more trustworthy service marketplace. Verification information can be reviewed before a provider is approved to offer services through the platform.",
  },

  otp: {
    text:
      "Fixly uses OTP-based verification as part of the service workflow. Depending on the booking flow, the OTP can help confirm the service interaction or completion.",
  },


  /* ----------------------------------------------------------
     RATINGS
     ---------------------------------------------------------- */

  ratings: {
    text:
      "Ratings and reviews help users understand the experience of previous customers with a service provider. Before choosing a provider, you can consider their available rating information and reviews where provided.",
  },

  review: {
    text:
      "After receiving a service, users can provide feedback through ratings and reviews when the booking flow allows it. Your feedback can help other Fixly users make better decisions.",
  },


  /* ----------------------------------------------------------
     ADDRESS / LOCATION
     ---------------------------------------------------------- */

  address: {
    text:
      "Fixly uses your service address to help manage where the requested service should be provided. When booking a service, make sure your city, area and pincode are entered correctly.",
  },

  location: {
    text:
      "Looking for a professional near you? 🔎 Fixly uses service and location information to help users find suitable professionals for their requirements.",
    action: {
      label: "Find a Service",
      to: "/search",
    },
  },


  /* ----------------------------------------------------------
     PRICING
     ---------------------------------------------------------- */

  pricing: {
    text:
      "Service pricing can depend on the provider, service category, experience and the specific requirement. Before confirming a booking, review the available service and provider information shown by Fixly.",
  },

  price: {
    text:
      "The cost of a service can vary depending on the provider and the type of work required. I recommend checking the provider information and booking details before confirming your request.",
  },


  /* ----------------------------------------------------------
     ACCOUNT
     ---------------------------------------------------------- */

  account: {
    text:
      "You can manage your Fixly account and personal information from your profile. If you need to update account or security information, use the available account settings.",
    action: {
      label: "My Profile",
      to: "/profile",
    },
  },

  password: {
    text:
      "If you want to update your account password, you can use the Change Password section available in Fixly.",
    action: {
      label: "Change Password",
      to: "/change-password",
    },
  },


  /* ----------------------------------------------------------
     SUPPORT
     ---------------------------------------------------------- */

  contact: {
    text:
      "Of course! 😊 If you need additional assistance, visit Fixly's Help & Support section. It provides a place to get help with common questions and platform-related issues.",
    action: {
      label: "Help & Support",
      to: "/help-support",
    },
  },


  /* ----------------------------------------------------------
     THANK YOU
     ---------------------------------------------------------- */

  thanks: {
    text:
      "You're very welcome! 😊 I'm glad I could help. If you need anything else, just ask me about Fixly or one of our services.",
  },


  /* ----------------------------------------------------------
     GOODBYE
     ---------------------------------------------------------- */

  goodbye: {
    text:
      "Goodbye! 👋 Thank you for choosing Fixly. Whenever you need a service professional, I'll be here to help.",
  },


  /* ----------------------------------------------------------
     POSITIVE / CASUAL
     ---------------------------------------------------------- */

  great: {
    text:
      "Glad to hear that! 😊 Let me know if you'd like help finding a Fixly service or understanding your booking.",
  },


  /* ----------------------------------------------------------
     FALLBACK
     ---------------------------------------------------------- */

  fallback: {
    text:
      "I want to make sure I give you the right information. 🤔 I can currently help with Fixly services, finding professionals, bookings, providers, verification, ratings, addresses, pricing, account questions and support. Try asking something like 'I need a plumber' or 'How does Fixly booking work?'",
    showServices: true,
  },
};


/* ============================================================
   NORMALIZE TEXT
   ============================================================ */

function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[!?.,;:()[\]{}'"`]/g, " ")
    .replace(/\s+/g, " ");
}


/* ============================================================
   KEYWORD MATCHING
   ============================================================ */

function containsAny(text, keywords) {
  return keywords.some((keyword) =>
    text.includes(keyword.toLowerCase())
  );
}


/* ============================================================
   GREETING DETECTION
   ============================================================ */

function getGreetingResponse(text) {
  const normalized = normalizeText(text);

  /* Exact/common greetings */

  if (
    containsAny(normalized, [
      "good morning",
      "morning",
    ])
  ) {
    return RESPONSES.morning;
  }

  if (
    containsAny(normalized, [
      "good afternoon",
      "afternoon",
    ])
  ) {
    return RESPONSES.afternoon;
  }

  if (
    containsAny(normalized, [
      "good evening",
      "evening",
    ])
  ) {
    return RESPONSES.evening;
  }

  if (
    containsAny(normalized, [
      "good night",
    ])
  ) {
    return RESPONSES.goodbye;
  }

  const greetings = [
    "hi",
    "hii",
    "hiii",
    "hello",
    "helloo",
    "helo",
    "hey",
    "heyy",
    "yo",
    "namaste",
  ];

  /*
   * Match greetings even when the user writes:
   *
   * Hi Fixly
   * Hello Fixly
   * Hey there
   * Hi I need help
   */

  const startsWithGreeting = greetings.some(
    (greeting) =>
      normalized === greeting ||
      normalized.startsWith(`${greeting} `)
  );

  if (startsWithGreeting) {
    return RESPONSES.greeting;
  }

  return null;
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
   SERVICE RESPONSE
   ============================================================ */

function getServiceResponse(service) {
  return {
    text:
      `Absolutely! 👍 It sounds like you need help with ${service.name}. ` +
      `${service.description} ` +
      `You can browse the available professionals and choose the one that best matches your requirement.`,

    service,

    action: {
      label: `Find ${service.name}`,
      to: "/search",
    },
  };
}


/* ============================================================
   SERVICE INFORMATION
   ============================================================ */

function getDetailedServiceResponse(service) {
  return {
    text:
      `Sure! Here's some information about ${service.name}:\n\n` +
      `${service.description}\n\n` +
      `If you'd like to find a professional for this service, you can browse the available options on Fixly.`,

    service,

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
  if (RESPONSES[id]) {
    return RESPONSES[id];
  }

  return RESPONSES.fallback;
}


/* ============================================================
   MAIN FREE-TEXT RESPONSE ENGINE
   ============================================================ */

export function getResponseForText(text) {
  if (!text || !String(text).trim()) {
    return RESPONSES.greeting;
  }

  const normalized = normalizeText(text);


  /* ==========================================================
     1. GREETING
     ========================================================== */

  const greetingResponse = getGreetingResponse(normalized);

  /*
   * Don't immediately return greeting if the same message
   * contains a meaningful request.
   *
   * Example:
   * "Hi I need a plumber"
   */

  const detectedService = findService(normalized);

  if (greetingResponse && !detectedService) {
    return greetingResponse;
  }


  /* ==========================================================
     2. SERVICE REQUEST
     ========================================================== */

  if (detectedService) {
    return getServiceResponse(detectedService);
  }


  /* ==========================================================
     3. SERVICE INFORMATION
     ========================================================== */

  if (
    containsAny(normalized, [
      "tell me about plumber",
      "tell me about plumbing",
      "plumber service",
      "plumbing service",
      "what does plumber do",
      "what can plumber do",
      "plumber information",
    ])
  ) {
    const service = FIXLY_SERVICES.find(
      (item) => item.id === "plumber"
    );

    return getDetailedServiceResponse(service);
  }


  if (
    containsAny(normalized, [
      "tell me about electrician",
      "electrician service",
      "electrical service",
      "what does electrician do",
      "electrician information",
    ])
  ) {
    const service = FIXLY_SERVICES.find(
      (item) => item.id === "electrician"
    );

    return getDetailedServiceResponse(service);
  }


  if (
    containsAny(normalized, [
      "tell me about child care",
      "tell me about childcare",
      "child care service",
      "childcare service",
      "child care information",
      "baby care information",
    ])
  ) {
    const service = FIXLY_SERVICES.find(
      (item) => item.id === "child-care"
    );

    return getDetailedServiceResponse(service);
  }


  /* ==========================================================
     4. ABOUT FIXLY
     ========================================================== */

  if (
    containsAny(normalized, [
      "what is fixly",
      "what's fixly",
      "what does fixly do",
      "about fixly",
      "tell me about fixly",
      "explain fixly",
      "how fixly works",
      "what is this website",
      "what is this platform",
      "what is this app",
      "fixly platform",
      "about this website",
    ])
  ) {
    return RESPONSES.aboutFixly;
  }


  /* ==========================================================
     5. WHAT CAN YOU DO
     ========================================================== */

  if (
    containsAny(normalized, [
      "what can you do",
      "how can you help",
      "what do you do",
      "help me",
      "what can i ask",
      "what can i ask you",
      "what are you",
      "who are you",
      "are you a bot",
      "are you chatbot",
      "are you an ai",
    ])
  ) {
    return RESPONSES.whatCanYouDo;
  }


  /* ==========================================================
     6. SERVICES
     ========================================================== */

  if (
    containsAny(normalized, [
      "services",
      "service list",
      "list of services",
      "what services",
      "what service",
      "available services",
      "available service",
      "services available",
      "what does fixly offer",
      "what can i book",
      "what can i hire",
      "show services",
      "show me services",
      "give me services",
      "fixly services",
      "categories",
      "service categories",
    ])
  ) {
    return RESPONSES.services;
  }


  /* ==========================================================
     7. FIND SERVICE
     ========================================================== */

  if (
    containsAny(normalized, [
      "find service",
      "find a service",
      "find me a service",
      "need a service",
      "need service",
      "looking for service",
      "looking for a service",
      "need professional",
      "need a professional",
      "find professional",
      "find me professional",
      "hire someone",
      "hire professional",
      "book service",
      "book a service",
      "i need help at home",
      "someone to help",
      "need someone",
    ])
  ) {
    return RESPONSES.findService;
  }


  /* ==========================================================
     8. BOOKING
     ========================================================== */

  if (
    containsAny(normalized, [
      "how booking works",
      "how does booking work",
      "how booking",
      "how to book",
      "how can i book",
      "booking process",
      "booking procedure",
      "how do i book",
      "want to book",
      "make a booking",
      "create booking",
      "place booking",
    ])
  ) {
    return RESPONSES.bookingWorks;
  }


  if (
    containsAny(normalized, [
      "booking steps",
      "steps to book",
      "booking flow",
      "booking procedure",
    ])
  ) {
    return RESPONSES.bookingSteps;
  }


  /* ==========================================================
     9. MY BOOKINGS
     ========================================================== */

  if (
    containsAny(normalized, [
      "my booking",
      "my bookings",
      "booking status",
      "check booking",
      "check my booking",
      "track booking",
      "track my booking",
      "where is my booking",
      "booking history",
      "previous booking",
      "past booking",
    ])
  ) {
    return RESPONSES.bookingStatus;
  }


  /* ==========================================================
     10. CANCEL BOOKING
     ========================================================== */

  if (
    containsAny(normalized, [
      "cancel booking",
      "cancel my booking",
      "cancel service",
      "want to cancel",
      "need to cancel",
    ])
  ) {
    return RESPONSES.bookingCancel;
  }


  /* ==========================================================
     11. RESCHEDULE
     ========================================================== */

  if (
    containsAny(normalized, [
      "reschedule",
      "change booking date",
      "change service date",
      "change appointment",
      "change my booking date",
      "move booking",
    ])
  ) {
    return RESPONSES.bookingReschedule;
  }


  /* ==========================================================
     12. PROVIDER
     ========================================================== */

  if (
    containsAny(normalized, [
      "become provider",
      "be a provider",
      "become a provider",
      "join fixly",
      "work with fixly",
      "work for fixly",
      "provider registration",
      "register as provider",
      "register as a provider",
      "provider signup",
      "provider sign up",
      "provider account",
      "offer my service",
      "offer services",
      "provide service",
      "provide services",
      "i want to work",
      "i want to become provider",
    ])
  ) {
    return RESPONSES.becomeProvider;
  }


  /* ==========================================================
     13. PROVIDER VERIFICATION
     ========================================================== */

  if (
    containsAny(normalized, [
      "provider verification",
      "verify provider",
      "provider verified",
      "verified provider",
      "how provider verified",
      "verification process",
      "verification details",
      "why verification",
      "documents for provider",
    ])
  ) {
    return RESPONSES.providerVerification;
  }


  /* ==========================================================
     14. PROVIDER APPROVAL
     ========================================================== */

  if (
    containsAny(normalized, [
      "provider approval",
      "approve provider",
      "provider approved",
      "approval process",
      "when provider approved",
      "provider request",
    ])
  ) {
    return RESPONSES.providerApproval;
  }


  /* ==========================================================
     15. SAFETY / TRUST
     ========================================================== */

  if (
    containsAny(normalized, [
      "is fixly safe",
      "is fixly secure",
      "is fixly trusted",
      "safe",
      "security",
      "secure",
      "trusted",
      "trust",
      "reliable",
      "is it safe",
      "can i trust fixly",
      "can i trust provider",
      "verified professional",
      "verified professionals",
    ])
  ) {
    return RESPONSES.safe;
  }


  /* ==========================================================
     16. VERIFICATION / OTP
     ========================================================== */

  if (
    containsAny(normalized, [
      "otp",
      "verification code",
      "service verification",
      "verify service",
      "service otp",
      "completion otp",
      "why otp",
    ])
  ) {
    return RESPONSES.otp;
  }


  /* ==========================================================
     17. RATINGS
     ========================================================== */

  if (
    containsAny(normalized, [
      "rating",
      "ratings",
      "provider rating",
      "check rating",
      "see rating",
      "star rating",
      "how rating works",
      "review provider",
    ])
  ) {
    return RESPONSES.ratings;
  }


  /* ==========================================================
     18. REVIEWS
     ========================================================== */

  if (
    containsAny(normalized, [
      "review",
      "reviews",
      "write review",
      "give review",
      "leave review",
      "customer feedback",
      "give feedback",
      "rate provider",
    ])
  ) {
    return RESPONSES.review;
  }


  /* ==========================================================
     19. ADDRESS
     ========================================================== */

  if (
    containsAny(normalized, [
      "address",
      "service address",
      "my address",
      "change address",
      "add address",
      "location address",
      "where service",
      "service location",
    ])
  ) {
    return RESPONSES.address;
  }


  /* ==========================================================
     20. LOCATION
     ========================================================== */

  if (
    containsAny(normalized, [
      "near me",
      "nearby",
      "near my location",
      "local provider",
      "provider near me",
      "service near me",
      "find nearby",
      "professionals near me",
    ])
  ) {
    return RESPONSES.location;
  }


  /* ==========================================================
     21. PRICE / COST
     ========================================================== */

  if (
    containsAny(normalized, [
      "price",
      "pricing",
      "cost",
      "how much",
      "charges",
      "service charge",
      "service cost",
      "rate",
      "rates",
      "fee",
      "fees",
      "expensive",
      "cheap",
    ])
  ) {
    return RESPONSES.pricing;
  }


  /* ==========================================================
     22. ACCOUNT
     ========================================================== */

  if (
    containsAny(normalized, [
      "my profile",
      "profile",
      "account",
      "account settings",
      "user account",
      "my account",
      "personal information",
      "update profile",
      "edit profile",
    ])
  ) {
    return RESPONSES.account;
  }


  /* ==========================================================
     23. PASSWORD
     ========================================================== */

  if (
    containsAny(normalized, [
      "password",
      "change password",
      "forgot password",
      "update password",
      "reset password",
    ])
  ) {
    return RESPONSES.password;
  }


  /* ==========================================================
     24. SUPPORT
     ========================================================== */

  if (
    containsAny(normalized, [
      "contact",
      "contact fixly",
      "contact support",
      "support",
      "customer support",
      "help",
      "need help",
      "technical support",
      "problem",
      "issue",
      "complaint",
      "report problem",
      "talk to someone",
    ])
  ) {
    return RESPONSES.contact;
  }


  /* ==========================================================
     25. THANK YOU
     ========================================================== */

  if (
    containsAny(normalized, [
      "thank you",
      "thanks",
      "thank",
      "thx",
      "thankyou",
    ])
  ) {
    return RESPONSES.thanks;
  }


  /* ==========================================================
     26. GOODBYE
     ========================================================== */

  if (
    containsAny(normalized, [
      "bye",
      "goodbye",
      "see you",
      "see ya",
      "talk later",
      "good night",
    ])
  ) {
    return RESPONSES.goodbye;
  }


  /* ==========================================================
     27. POSITIVE RESPONSE
     ========================================================== */

  if (
    containsAny(normalized, [
      "great",
      "perfect",
      "awesome",
      "nice",
      "okay thanks",
      "sounds good",
      "got it",
      "understood",
    ])
  ) {
    return RESPONSES.great;
  }


  /* ==========================================================
     28. FALLBACK
     ========================================================== */

  return RESPONSES.fallback;
}