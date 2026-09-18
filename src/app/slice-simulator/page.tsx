import type { Metadata } from "next";
import {
  SliceSimulator,
  type SliceSimulatorParams,
  getSlices,
} from "@prismicio/next";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";

export const metadata: Metadata = {
  title: "Slice Simulator",
  robots: { index: false, follow: false },
};

export default async function SliceSimulatorPage({
  searchParams,
}: SliceSimulatorParams) {
  const { state } = await searchParams;

  return (
    <SliceSimulator>
      <SliceZone slices={getSlices(state)} components={components} />
    </SliceSimulator>
  );
}
