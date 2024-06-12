'use client';

import { getPopulationData, getPrefectures } from '@/lib/getPrefectures';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import '../lib/chartSetup';
import { PopulationData } from '@/types/Type';
import { regions } from '@/lib/region';
import { getRandomColor } from '@/constants/ColorCode';

export default function Home() {
  const [prefectures, setPrefectures] = useState<any[]>([]);
  const [selectedPrefectures, setSelectedPrefectures] = useState<number[]>([]);
  const [populationData, setPopulationData] = useState<{
    [key: number]: PopulationData;
  }>({});
  const [prefectureColors, setPrefectureColors] = useState<{
    [key: number]: string;
  }>({});
  const [years, setYears] = useState<number[]>([]);
  const [populationType, setPopulationType] = useState<string>('総人口');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrefectures = async () => {
      try {
        const prefecturesData = await getPrefectures();
        setPrefectures(prefecturesData);
      } catch (error) {
        setError('都道府県データの取得に失敗しました');
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
        const data = await getPopulationData(prefCode, '総人口');
        setPopulationData((prevData) => ({
          ...prevData,
          [prefCode]: { name: prefName, data },
        }));
        if (data.length > 0 && years.length === 0) {
          setYears(data.map((item) => item.year));
        }
      } catch (err) {
        console.error('人口データの取得に失敗しました', err);
      }
    } else {
      setSelectedPrefectures(
        selectedPrefectures.filter((code) => code !== prefCode)
      );
      setPopulationData((prevData) => {
        const NewData = { ...prevData };
        delete NewData[prefCode];
        return NewData;
      });
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
  };

  const dataSets = Object.keys(populationData).map((prefCode) => {
    const color = prefectureColors[Number(prefCode)];
    return {
      label: populationData[Number(prefCode)].name,
      data: populationData[Number(prefCode)].data.map((item) => item.value),
      borderColor: color,
      backgroundColor: color + '33',
    };
  });

  return (
    <div>
      <h1>都道府県別総人口推移</h1>
      {error && <p>{error}</p>}
      <select onChange={handlePopulationTypeChange} value={populationType}>
        <option value='総人口'>総人口</option>
        <option value='年少人口'>年少人口</option>
        <option value='生産年齢人口'>生産年齢人口</option>
        <option value='老年人口'>老年人口</option>
      </select>
      {Object.keys(regions).map((region) => (
        <div key={region}>
          <h2>{region}</h2>
          {regions[region].map((prefCode) => {
            const prefecture = prefectures.find(
              (pref) => pref.prefCode === prefCode
            );
            if (!prefecture) return null;
            return (
              <div key={prefecture.prefCode}>
                <input
                  type='checkbox'
                  value={prefecture.prefCode}
                  onChange={handlePrefectureChange}
                />
                <label>{prefecture.prefName}</label>
              </div>
            );
          })}
        </div>
      ))}
      <Line
        data={{
          labels: years,
          datasets: dataSets.length
            ? dataSets
            : [
                {
                  label: '',
                  data: [],
                  borderColor: 'rgba(0, 0, 0, 0)',
                  backgroundColor: 'rgba(0, 0, 0, 0)',
                },
              ],
        }}
      />
    </div>
  );
}
