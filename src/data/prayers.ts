export const PRAYERS = {
  ourFather: {
    title: "주님의 기도",
    lines: [
      "하늘에 계신 우리 아버지,",
      "아버지의 이름이 거룩히 빛나시며",
      "아버지의 나라가 오시며",
      "아버지의 뜻이 하늘에서와 같이",
      "땅에서도 이루어지소서.",
      "오늘 저희에게 일용할 양식을 주시고",
      "저희에게 잘못한 이를 저희가 용서하오니",
      "저희 죄를 용서하시고",
      "저희를 유혹에 빠지지 않게 하시고",
      "악에서 구하소서.",
      "아멘.",
    ],
  },
  hailMary: {
    title: "성모송",
    lines: [
      "은총이 가득하신 마리아님, 기뻐하소서.",
      "주님께서 함께 계시니",
      "여인 중에 복되시며",
      "태중의 아들 예수님 또한 복되시나이다.",
      "천주의 성모 마리아님,",
      "이제와 저희 죽을 때에",
      "저희 죄인을 위하여 빌어주소서.",
      "아멘.",
    ],
  },
  gloryBe: {
    title: "영광송",
    lines: [
      "영광이 성부와 성자와 성령께,",
      "처음과 같이 이제와 항상 영원히.",
      "아멘.",
    ],
  },
  fatima: {
    title: "구원송",
    lines: [
      "예수님, 저희 죄를 용서하시며",
      "저희를 지옥불에서 구하시고",
      "모든 영혼을 천국으로 이끄시며",
      "가장 버림받은 영혼을 돌보소서.",
    ],
  },
};

export type MysteryId = "joyful" | "sorrowful" | "glorious" | "luminous";

export interface Mystery {
  id: MysteryId;
  name: string;
  subtitle: string;
  accent: string;
  decades: string[];
}

export const MYSTERIES: Record<MysteryId, Mystery> = {
  joyful: {
    id: "joyful",
    name: "환희의 신비",
    subtitle: "월요일 · 토요일",
    accent: "#c79a3a",
    decades: [
      "마리아께서 예수님을 잉태하심을 묵상합시다.",
      "마리아께서 엘리사벳을 찾아보심을 묵상합시다.",
      "마리아께서 예수님을 낳으심을 묵상합시다.",
      "마리아께서 예수님을 성전에 바치심을 묵상합시다.",
      "마리아께서 예수님을 성전에서 다시 찾으심을 묵상합시다.",
    ],
  },
  sorrowful: {
    id: "sorrowful",
    name: "고통의 신비",
    subtitle: "화요일 · 금요일",
    accent: "#8c4a2a",
    decades: [
      "예수님께서 우리를 위하여 피땀을 흘리심을 묵상합시다.",
      "예수님께서 우리를 위하여 매맞으심을 묵상합시다.",
      "예수님께서 우리를 위하여 가시관 쓰심을 묵상합시다.",
      "예수님께서 우리를 위하여 십자가 지심을 묵상합시다.",
      "예수님께서 우리를 위하여 십자가에 못박혀 돌아가심을 묵상합시다.",
    ],
  },
  glorious: {
    id: "glorious",
    name: "영광의 신비",
    subtitle: "수요일 · 일요일",
    accent: "#b8843a",
    decades: [
      "예수님께서 부활하심을 묵상합시다.",
      "예수님께서 승천하심을 묵상합시다.",
      "성령께서 강림하심을 묵상합시다.",
      "마리아께서 하늘에 불려 올림을 받으심을 묵상합시다.",
      "마리아께서 하늘에서 영광의 관을 받으심을 묵상합시다.",
    ],
  },
  luminous: {
    id: "luminous",
    name: "빛의 신비",
    subtitle: "목요일",
    accent: "#a67c2e",
    decades: [
      "예수님께서 세례 받으심을 묵상합시다.",
      "예수님께서 가나에서 첫 기적을 행하심을 묵상합시다.",
      "예수님께서 하느님 나라를 선포하심을 묵상합시다.",
      "예수님께서 거룩하게 변모하심을 묵상합시다.",
      "예수님께서 성체성사를 세우심을 묵상합시다.",
    ],
  },
};

export const DAY_TO_MYSTERY: MysteryId[] = [
  "glorious",
  "joyful",
  "sorrowful",
  "glorious",
  "luminous",
  "sorrowful",
  "joyful",
];

export const DAY_NAMES = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

export type StepKind = "announce" | "ourFather" | "hailMary" | "gloryBe" | "fatima";

export interface DecadeStep {
  kind: StepKind;
  title: string;
  lines: string[];
  beadIndex?: number;
}

export function buildDecadeSteps(mysteryId: MysteryId, decadeIndex: number): DecadeStep[] {
  const m = MYSTERIES[mysteryId];
  const steps: DecadeStep[] = [];

  steps.push({
    kind: "announce",
    title: `${decadeIndex + 1}단`,
    lines: [m.decades[decadeIndex]],
  });

  steps.push({
    kind: "ourFather",
    title: PRAYERS.ourFather.title,
    lines: PRAYERS.ourFather.lines,
  });

  for (let i = 0; i < 10; i++) {
    steps.push({
      kind: "hailMary",
      title: "성모송",
      lines: PRAYERS.hailMary.lines,
      beadIndex: i,
    });
  }

  steps.push({
    kind: "gloryBe",
    title: PRAYERS.gloryBe.title,
    lines: PRAYERS.gloryBe.lines,
  });

  steps.push({
    kind: "fatima",
    title: PRAYERS.fatima.title,
    lines: PRAYERS.fatima.lines,
  });

  return steps;
}
