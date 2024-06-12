export interface PopulationDataItem {
  year: number;
  value: number;
}

export interface PopulationDataSet {
  label: string;
  data: PopulationDataItem[];
}

export interface PopulationResponse {
  message: string | null;
  result: {
    boundaryYear: number;
    data: PopulationDataSet[];
  };
}

export interface Prefecture {
  prefCode: number;
  prefName: string;
}

export interface PrefecturesResponse {
  message: string | null;
  result: Prefecture[];
}

export interface PopulationData {
  name: string;
  data: { year: number; value: number }[];
}

export interface Regions {
  [key: string]: number[];
}
