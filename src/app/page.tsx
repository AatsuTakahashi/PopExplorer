'use client';

import { getPopulationData, getPrefectures } from '@/lib/getPrefectures';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import '../lib/chartSetup';
import { PopulationData } from '@/types/Type';

export default function Home() {
  const [prefectures, setPrefectures] = useState<any[]>([]);
  const [selectedPrefectures, setSelectedPrefectures] = useState<number[]>([]);
  const [populationData, setPopulationData] = useState<{
    [key: number]: PopulationData;
  }>({});
  const [years, setYears] = useState<number[]>([]);
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

  const handlePrefectureChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const prefCode = Number(event.target.value);
    const prefName =
      prefectures.find((pref) => pref.prefCode === prefCode)?.prefName || '';
    if (event.target.checked) {
      setSelectedPrefectures([...selectedPrefectures, prefCode]);
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

  const dataSets = Object.keys(populationData).map((prefCode) => ({
    label: populationData[Number(prefCode)].name,
    data: populationData[Number(prefCode)].data.map((item) => item.value),
    borderColor: 'rgba(75, 192, 192, 1)',
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
  }));

  return (
    <div>
      <h1>都道府県別総人口推移</h1>
      {error && <p>{error}</p>}
      <div>
        {prefectures.map((prefecture) => (
          <div key={prefecture.prefCode}>
            <input
              type='checkbox'
              value={prefecture.prefCode}
              onChange={handlePrefectureChange}
            />
            <label>{prefecture.prefName}</label>
          </div>
        ))}
      </div>
      <Line
        data={{
          labels: years,
          datasets: dataSets,
        }}
      />
    </div>
  );
}
