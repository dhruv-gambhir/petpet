"use client";

import { useParams } from "next/navigation";
import AdoptionPage from "../AdoptionPage";
import EventsPage from "../EventsPage";
import SittingPage from "../SittingPage";

export default function InterestionNav() {
  const { nav } = useParams();

  const map = {
    "adoption": <AdoptionPage />,
    "events": <EventsPage />,
    "sitting": <SittingPage />
  };

  const mapKey = nav ? nav[0] : null;

  return (
    <>
      {map[mapKey]}
    </>
  )
}