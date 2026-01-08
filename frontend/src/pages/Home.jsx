// eslint-disable-next-line no-unused-vars
import React from "react";
import Header from "../components/Header";
import InstitutionInfo from "../components/InstitutionInfo";
import StatsSection from "../components/StatsSection";
import Features from "../components/Features";
import VirtualTour from "../components/VirtualTour";

function Home() {
  return (
    <>
      <Header />
      <InstitutionInfo />
      <StatsSection />
      <Features />
      <VirtualTour />
    </>
  );
}

export default Home;
