import { PrayerContent } from "./paryer";

// 성호경
// 사도신경
// 주기도문
// 성모송 3번

const Commonness = () => {
  return (
    <div className="flex flex-col gap-4">
      <PrayerContent name="성호경" />
      <PrayerContent name="사도신경" />
      <PrayerContent name="주기도문" />
      <p>성모송은 3번 반복</p>
      <PrayerContent name="성모송" />
    </div>
  );
};
export default Commonness;
