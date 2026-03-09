export type DemoReview = {
  company: string;
  review: string;
  proof: string;
  trust_percentage: number;
  trust_badge: "Bronze" | "Silver" | "Gold";
  qa_scorecard: {
    matchedPhotos: boolean;
    hiddenFees: boolean;
    reservationFound: boolean;
    finalPriceMatched: boolean;
    smoothCheckIn: boolean;
    helpfulSupport: boolean;
  };
  expectation_sliders: {
    visuals: number;
    value: number;
    process: number;
  };
  tags: {
    bestFor: string[];
    bookingExperience: string[];
  };
  verification_summary: string;
  verification_confidence: "low" | "medium" | "high";
  verification_flags: string[];
  is_demo: boolean;
};

export const demoReviews: DemoReview[] = [
  {
    company: "HotelPlanner.com",
    review:
      "Demo review: The booking details were found quickly at check-in, the pricing stayed consistent, and the stay matched what was expected from the booking flow. The overall process felt reliable and clear for a short business trip.",
    proof: "https://placehold.co/1200x800/png",
    trust_percentage: 92,
    trust_badge: "Gold",
    qa_scorecard: {
      matchedPhotos: true,
      hiddenFees: false,
      reservationFound: true,
      finalPriceMatched: true,
      smoothCheckIn: true,
      helpfulSupport: true
    },
    expectation_sliders: { visuals: 5, value: 4, process: 5 },
    tags: {
      bestFor: ["Business Trip", "Quick Overnight"],
      bookingExperience: ["Instant Confirmation", "Accurate Listing", "Responsive Support"]
    },
    verification_summary: "Specific, useful demo review with clear booking and arrival details.",
    verification_confidence: "high",
    verification_flags: [],
    is_demo: true
  },
  {
    company: "Booking.com",
    review:
      "Demo review: The room looked very close to the listing photos and the reservation appeared correctly at the front desk. The only weak point was slower support response before arrival, but there were no hidden charges.",
    proof: "https://placehold.co/1200x800/png",
    trust_percentage: 84,
    trust_badge: "Silver",
    qa_scorecard: {
      matchedPhotos: true,
      hiddenFees: false,
      reservationFound: true,
      finalPriceMatched: true,
      smoothCheckIn: true,
      helpfulSupport: false
    },
    expectation_sliders: { visuals: 4, value: 4, process: 4 },
    tags: {
      bestFor: ["Solo Travel", "Business Trip"],
      bookingExperience: ["Accurate Listing", "No Hidden Fees"]
    },
    verification_summary: "Useful demo review with a balanced mix of strengths and one friction point.",
    verification_confidence: "high",
    verification_flags: [],
    is_demo: true
  },
  {
    company: "Airbnb",
    review:
      "Demo review: The property looked stylish in person and the host communication was strong, but the check-in instructions required extra messages before arrival. Still, the final price and listing quality felt fair.",
    proof: "https://placehold.co/1200x800/png",
    trust_percentage: 78,
    trust_badge: "Silver",
    qa_scorecard: {
      matchedPhotos: true,
      hiddenFees: false,
      reservationFound: true,
      finalPriceMatched: true,
      smoothCheckIn: false,
      helpfulSupport: true
    },
    expectation_sliders: { visuals: 5, value: 4, process: 3 },
    tags: {
      bestFor: ["Couples Retreat", "Family Stay"],
      bookingExperience: ["Responsive Support", "Accurate Listing"]
    },
    verification_summary: "Clear demo review with strong visuals and moderate process friction.",
    verification_confidence: "high",
    verification_flags: [],
    is_demo: true
  },
  {
    company: "Expedia",
    review:
      "Demo review: The booking was easy to place, the confirmation arrived fast, and the property honored the reservation. The stay felt solid overall, though the value was only average compared with similar options nearby.",
    proof: "https://placehold.co/1200x800/png",
    trust_percentage: 81,
    trust_badge: "Silver",
    qa_scorecard: {
      matchedPhotos: true,
      hiddenFees: false,
      reservationFound: true,
      finalPriceMatched: true,
      smoothCheckIn: true,
      helpfulSupport: false
    },
    expectation_sliders: { visuals: 4, value: 3, process: 5 },
    tags: {
      bestFor: ["Quick Overnight"],
      bookingExperience: ["Instant Confirmation", "Accurate Listing"]
    },
    verification_summary: "Detailed demo review with helpful booking and arrival context.",
    verification_confidence: "high",
    verification_flags: [],
    is_demo: true
  }
];
