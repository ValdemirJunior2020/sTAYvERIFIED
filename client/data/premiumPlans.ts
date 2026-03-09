export type PremiumPlan = {
  id: string;
  title: string;
  subtitle: string;
  monthlyPrice: string;
  yearlyPrice: string;
  badge: string;
  highlight: string;
  features: string[];
  appleDisclosure: string;
};

export const premiumPlans: PremiumPlan[] = [
  {
    id: "traveler_plus",
    title: "Traveler Plus",
    subtitle: "For people who want deeper trust insight before they book",
    monthlyPrice: "$4.99",
    yearlyPrice: "$39.99",
    badge: "Most Popular",
    highlight: "Unlock premium trust filters and full badge intelligence",
    features: [
      "Advanced trust filters",
      "Verified traveler profile badge",
      "Full property trust history",
      "Red-flag trend summaries",
      "Saved trusted lists",
      "Early access to new trust signals"
    ],
    appleDisclosure:
      "Auto-renewable subscription placeholder. Billing must be completed with Apple In-App Purchase before release."
  },
  {
    id: "traveler_pro",
    title: "Traveler Pro",
    subtitle: "For frequent travelers who want stronger proof and deeper decision tools",
    monthlyPrice: "$9.99",
    yearlyPrice: "$79.99",
    badge: "Pro",
    highlight: "Everything in Plus plus premium analytics and booking intelligence",
    features: [
      "Everything in Traveler Plus",
      "Trust score breakdowns by category",
      "Booking platform comparison tools",
      "Trip-type recommendation intelligence",
      "Priority support",
      "Future booking link perks"
    ],
    appleDisclosure:
      "Auto-renewable subscription placeholder. Billing must be completed with Apple In-App Purchase before release."
  }
];
