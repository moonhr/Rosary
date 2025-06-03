import { useEffect, useRef, useState } from "react";

const useAutoScroll = (baseSpeed: number = 30) => {
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleSpeedChange = () => {
    setSpeedMultiplier((prev) => {
      if (prev === 1) return 2;
      if (prev === 2) return 0.5;
      return 1;
    });
  };

  useEffect(() => {
    const scrollToBottom = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      const scrollHeight = document.documentElement.scrollHeight;
      const height = document.documentElement.clientHeight;
      const maxScrollTop = scrollHeight - height;

      let currentScroll = 0;
      intervalRef.current = setInterval(() => {
        if (currentScroll >= maxScrollTop) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return;
        }
        currentScroll += 1;
        window.scrollTo(0, currentScroll);
      }, baseSpeed / speedMultiplier);
    };

    scrollToBottom();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [speedMultiplier, baseSpeed]);

  return {
    speedMultiplier,
    handleSpeedChange,
  };
};

export default useAutoScroll;
