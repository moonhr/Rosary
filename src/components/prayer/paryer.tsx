import prayersData from "../../../public/prayer/prayers.json";

type PrayerData = {
  [key: string]: string[];
};

export const PrayerNames = (): string[] => {
  return Object.keys(prayersData as PrayerData);
};

export const PrayerContent = ({ name }: { name: string }) => {
  const prayers = prayersData as PrayerData;
  const content = prayers[name];

  if (!content) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">{name}</h2>
      <div className="space-y-2">
        {content.map((line, index) => (
          <p
            key={index}
            className={`text-2xl ${
              name === "사도신경" && index === 2 ? "text-lg" : ""
            } ${name === "사도신경" && index === 3 ? "underline" : ""}`}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
};

const Prayers = () => {
  const names = PrayerNames();

  return (
    <div className="space-y-8">
      {names.map((name) => (
        <PrayerContent key={name} name={name} />
      ))}
    </div>
  );
};

export default Prayers;
