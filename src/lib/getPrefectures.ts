import {
  PopulationDataItem,
  PopulationDataSet,
  PopulationResponse,
  Prefecture,
  PrefecturesResponse,
} from '@/types/Type';
import apiClient from './api';

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
      case '年少人口':
        populationData = data.find(
          (d: PopulationDataSet) => d.label === '年少人口'
        );
        break;
      case '生産年齢人口':
        populationData = data.find(
          (d: PopulationDataSet) => d.label === '生産年齢人口'
        );
        break;
      case '老年人口':
        populationData = data.find(
          (d: PopulationDataSet) => d.label === '老年人口'
        );
        break;
      default:
        populationData = data.find(
          (d: PopulationDataSet) => d.label === '総人口'
        );
        break;
    }

    if (!populationData) {
      throw new Error('Population data not found');
    }
    return populationData.data;
  } catch (error) {
    console.error('API request failed:', error); // デバッグ用
    throw error;
  }
};
