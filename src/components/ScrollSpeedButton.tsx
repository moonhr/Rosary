interface ScrollSpeedButtonProps {
  speedMultiplier: number;
  onSpeedChange: () => void;
}

const ScrollSpeedButton = ({
  speedMultiplier,
  onSpeedChange,
}: ScrollSpeedButtonProps) => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={onSpeedChange}
        className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
      >
        {speedMultiplier === 1 ? "x1" : speedMultiplier === 2 ? "x2" : "x0.5"}
      </button>
    </div>
  );
};

export default ScrollSpeedButton;
