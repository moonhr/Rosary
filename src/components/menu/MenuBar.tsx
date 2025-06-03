"use client";

// 홈화면일 시 앱 설치버튼, 카카오톡 공유버튼 보여줌
// 묵주기도 화면일 시 홈버튼, 재생버튼or일시정지, 다음기도문버튼 보여줌
import { usePathname } from "next/navigation";
import HomeMove from "./HomeMove";
import ScrollSpeedButton from "@/components/ScrollSpeedButton";
import useAutoScroll from "@/hooks/useAutoScroll";
// 레이아웃단에서 사용
const HomeMenuBar = () => {
  return (
    <div>
      <HomeMove />
    </div>
  );
};

const RosaryMenuBar = () => {
  const { speedMultiplier, handleSpeedChange } = useAutoScroll();
  return (
    <div>
      <ScrollSpeedButton
        speedMultiplier={speedMultiplier}
        onSpeedChange={handleSpeedChange}
      />
    </div>
  );
};

const MenuBar = () => {
  const pathname = usePathname();

  return <>{pathname === "/" ? <HomeMenuBar /> : <RosaryMenuBar />}</>;
};

export default MenuBar;
