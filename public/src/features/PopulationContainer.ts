import React, { useEffect, useState } from 'react';
import { getPopulationData, getPrefectures } from '../lib/getPrefectures';
import { ERROR_MESSAGE, POPULATION_TYPE } from '../constants/appStrings';
import { getRandomColor } from '../constants/ColorCode';
import { PopulationData } from '../types/Type';
import useForceUpdate from '../hooks/useForceUpdate';

export function PopulationContainer() {
  const [prefectures, setPrefectures] = useState<any[]>([]);
  const [selectedPrefectures, setSelectedPrefectures] = useState<number[]>([]);
  const [populationData, setPopulationData] = useState<{
    [key: number]: PopulationData;
  }>({});
  const [prefectureColors, setPrefectureColors] = useState<{
    [key: number]: string;
  }>({});

  const [years, setYears] = useState<number[]>([]);
  const [populationType, setPopulationType] = useState<string>(
    POPULATION_TYPE.TOTAL
  );
  const [error, setError] = useState<string | null>(null);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const fetchPrefectures = async () => {
      try {
        const prefecturesData = await getPrefectures();
        setPrefectures(prefecturesData);
        forceUpdate();
      } catch (error) {
        setError(ERROR_MESSAGE.PREFECTURE_DATA);
      }
    };

    fetchPrefectures();
  }, []);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const startYear = 1960;
    const yearRange = [];
    for (let year = startYear; year <= currentYear; year += 5) {
      yearRange.push(year);
    }
    setYears(yearRange);
  }, []);

  useEffect(() => {
    console.log('Population data updated:', populationData);
  }, [populationData]);

  const handlePrefectureChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const prefCode = Number(event.target.value);
    const prefName =
      prefectures.find((pref) => pref.prefCode === prefCode)?.prefName || '';
    if (event.target.checked) {
      setSelectedPrefectures([...selectedPrefectures, prefCode]);
      if (!prefectureColors[prefCode]) {
        setPrefectureColors((prevColors) => ({
          ...prevColors,
          [prefCode]: getRandomColor(),
        }));
      }
      try {
        const data = await getPopulationData(prefCode, POPULATION_TYPE.TOTAL);
        setPopulationData((prevData) => {
          const newData = {
            ...prevData,
            [prefCode]: { name: prefName, data },
          };
          return newData;
        });
        if (data.length > 0 && years.length === 0) {
          setYears(data.map((item) => item.year));
        }
        forceUpdate();
      } catch (err) {
        console.error(ERROR_MESSAGE.POPULATION_DATA, err);
      }
    } else {
      console.log('Entering else block for unchecked checkbox:', prefCode);
      setSelectedPrefectures((prevSelected) =>
        prevSelected.filter((code) => code !== prefCode)
      );
      setPopulationData((prevData) => {
        const newData = { ...prevData };
        delete newData[prefCode];
        console.log('Removing population data:', newData);
        return newData;
      });
      forceUpdate();
    }
  };

  const handlePopulationTypeChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedType = event.target.value;
    setPopulationType(selectedType);

    const updatedPopulationData = await Promise.all(
      selectedPrefectures.map(async (prefCode) => {
        const prefName =
          prefectures.find((pref) => pref.prefCode === prefCode)?.prefName ||
          '';
        const data = await getPopulationData(prefCode, selectedType);
        return { prefCode, prefName, data };
      })
    );

    const newPopulationData: { [key: number]: PopulationData } = {};
    updatedPopulationData.forEach(({ prefCode, prefName, data }) => {
      newPopulationData[prefCode] = { name: prefName, data };
    });
    setPopulationData(newPopulationData);
    forceUpdate();
  };

  return {
    prefectures,
    selectedPrefectures,
    populationData,
    prefectureColors,
    years,
    populationType,
    error,
    handlePrefectureChange,
    handlePopulationTypeChange,
  };
}
