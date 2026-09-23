import "server-only";

import ContactInquiry from "./ContactInquiry";
import FeatureGrid from "./FeatureGrid";
import FeaturedProfile from "./FeaturedProfile";
import FoundationOverview from "./FoundationOverview";
import Hero from "./Hero";
import ImpactOverview from "./ImpactOverview";
import InitiativeFeature from "./InitiativeFeature";
import PillarFeature from "./PillarFeature";
import VisionMission from "./VisionMission";

// Public routes render content directly on the server. Keep Slice Machine's
// generated dynamic registry for the simulator; it may regenerate index.ts.
// This key check flags newly generated slices that still need registering here.
export const components = {
  contact_inquiry: ContactInquiry,
  feature_grid: FeatureGrid,
  featured_profile: FeaturedProfile,
  foundation_overview: FoundationOverview,
  hero: Hero,
  impact_overview: ImpactOverview,
  initiative_feature: InitiativeFeature,
  pillar_feature: PillarFeature,
  vision_mission: VisionMission,
} satisfies Record<keyof typeof import("./index").components, unknown>;
