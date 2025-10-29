export interface StudyData {
  id: string;
  tp: number;
  fp: number;
  tn: number;
  fn: number;
  sensitivity?: number;
  specificity?: number;
}

export const studiesData: StudyData[] = [
  { id: "Alsatie M et al (2022)", tp: 147, fp: 0, tn: 105, fn: 0 },
  { id: "Alsatie M et al (2023)", tp: 799, fp: 1, tn: 599, fn: 1 },
  { id: "Bai X et al (2024)", tp: 1521, fp: 958, tn: 29657, fn: 315 },
  { id: "Bao H et al (2020 a)", tp: 1414, fp: 158, tn: 176, fn: 246 },
  { id: "Bao H et al (2020 b)", tp: 32169, fp: 2569, tn: 63233, fn: 578 },
  { id: "Benyes YK et al (2022)", tp: 369, fp: 0, tn: 122, fn: 1 },
  { id: "Crowell EF et al (2019)", tp: 54, fp: 22, tn: 131, fn: 3 },
  { id: "Hamdi M et al (2023)", tp: 69, fp: 0, tn: 122, fn: 2 },
  { id: "Holmström O et al (2021)", tp: 45, fp: 48, tn: 266, fn: 2 },
  { id: "Ikenberg H et al (2022)", tp: 628, fp: 83, tn: 1183, fn: 98 },
  { id: "Kanavati F et al (2022)", tp: 17, fp: 25, tn: 255, fn: 3 },
  { id: "Liu D et al (2024)", tp: 554, fp: 18, tn: 604, fn: 24 },
  { id: "Muksimova S et al (2025)", tp: 895, fp: 12, tn: 1225, fn: 20 },
  { id: "Tang HP et al (2021)", tp: 1078, fp: 62, tn: 720, fn: 84 },
  { id: "Wiersma D et al (2023)", tp: 56, fp: 29, tn: 245, fn: 102 },
  { id: "William W et al (2019)", tp: 555, fp: 4, tn: 154, fn: 4 },
  { id: "Zeng X et al (2024)", tp: 9132, fp: 77439, tn: 76348, fn: 929 },
  { id: "Zhu X et al (2021)", tp: 23566, fp: 3814, tn: 52268, fn: 0 },
];

// Calculate sensitivity and specificity
export const calculateMetrics = (study: StudyData) => {
  const sensitivity = study.tp / (study.tp + study.fn);
  const specificity = study.tn / (study.tn + study.fp);
  return {
    ...study,
    sensitivity,
    specificity,
  };
};

export const studiesWithMetrics = studiesData.map(calculateMetrics);
