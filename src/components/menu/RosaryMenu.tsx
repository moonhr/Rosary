"use client";

import { useRouter } from "next/navigation";
import { RosaryNames } from "../prayer/rosary";
import Button from "../atoms/Button";

const RosaryMenu = () => {
  const router = useRouter();
  const names = RosaryNames();

  // "환희의 신비" => "Joyful"로 변환
  const changeName = (name: string) => {
    if (name === "환희의 신비") return "joyful";
    if (name === "빛의 신비") return "luminous";
    if (name === "고통의 신비") return "sorrowful";
    if (name === "영광의 신비") return "glorious";
    return name.replace(/ /g, "").toLowerCase();
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {names.map((name) => (
        <Button
          className="col-span-1 bg-blue-500 text-white"
          key={name}
          onClick={() => router.push(`/${changeName(name)}`)}
        >
          {name}
        </Button>
      ))}
    </div>
  );
};

export default RosaryMenu;
