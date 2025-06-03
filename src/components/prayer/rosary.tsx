import rosaryData from "../../../public/prayer/rosary.json";

// 타입 정의
type MysteryStep = {
  요일: string[];
  소개: string;
  "1단": string;
  "2단": string;
  "3단": string;
  "4단": string;
  "5단": string;
};

type RosaryData = {
  [key: string]: MysteryStep;
};

export const RosaryNames = (): string[] => {
  const names = Object.keys(rosaryData as RosaryData);
  return names;
};

export const TodayRosary = () => {
  const today = new Date().toLocaleDateString("ko-KR", { weekday: "short" });
  const todayMystery = Object.entries(rosaryData as RosaryData).find(
    ([, data]) => data.요일.includes(today)
  );

  if (!todayMystery) return <p>오늘은 묵주기도의 날이 아닙니다.</p>;

  return (
    <div>
      <h2>{todayMystery[0]}</h2>
      <p>{todayMystery[1].소개}</p>
      <div>
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step}>
            <h3>{step}단</h3>
            <p>{todayMystery[1][`${step}단` as keyof MysteryStep]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
