import {
  PopulationDataItem,
  PopulationDataSet,
  PopulationResponse,
  Prefecture,
  PrefecturesResponse,
} from '@/types/Type';
import apiClient from './api';
import { ERROR_MESSAGE, POPULATION_TYPE } from '@/constants/appStrings';

export const getPrefectures = async (): Promise<Prefecture[]> => {
  const response = await apiClient.get<PrefecturesResponse>('/prefectures');
  return response.data.result;
};

export const getPopulationData = async (
  prefCode: number,
  populationType: string
): Promise<PopulationDataItem[]> => {
  try {
    const response = await apiClient.get<PopulationResponse>(
      `/population/composition/perYear?prefCode=${prefCode}`
    );
    console.log('API Response:', response.data);
    if (!response.data || !response.data.result || !response.data.result.data) {
      throw new Error('Invalid API response');
    }

    const data = response.data.result.data;
    let populationData: PopulationDataSet | undefined;

    switch (populationType) {
      case POPULATION_TYPE.YOUNG:
        populationData = data.find(
          (d: PopulationDataSet) => d.label === POPULATION_TYPE.YOUNG
        );
        break;
      case POPULATION_TYPE.WORKING:
        populationData = data.find(
          (d: PopulationDataSet) => d.label === POPULATION_TYPE.WORKING
        );
        break;
      case POPULATION_TYPE.ELDERLY:
        populationData = data.find(
          (d: PopulationDataSet) => d.label === POPULATION_TYPE.ELDERLY
        );
        break;
      default:
        populationData = data.find(
          (d: PopulationDataSet) => d.label === POPULATION_TYPE.TOTAL
        );
        break;
    }

    if (!populationData) {
      throw new Error(ERROR_MESSAGE.POPULATION_DATA);
    }
    return populationData.data;
  } catch (error) {
    console.error(ERROR_MESSAGE.API, error);
    throw error;
  }
};
