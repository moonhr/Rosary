"use client";

import Commonness from "@/components/prayer/commonness";
import ScrollSpeedButton from "@/components/ScrollSpeedButton";
import useAutoScroll from "@/hooks/useAutoScroll";

const Joyful = () => {
  const { speedMultiplier, handleSpeedChange } = useAutoScroll();

  return (
    <div>
      <ScrollSpeedButton
        speedMultiplier={speedMultiplier}
        onSpeedChange={handleSpeedChange}
      />
      <Commonness />
    </div>
  );
};

export default Joyful;
