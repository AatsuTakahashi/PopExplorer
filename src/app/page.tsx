'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import '../lib/chartSetup';
import 'chart.js/auto';
import { regions } from '../lib/region';
import { COLOR_CODE } from '../constants/ColorCode';
import {
  POPULATION_PREFECTURES,
  POPULATION_TYPE,
} from '../constants/appStrings';
import '../styles/displayPrefecture.css';
import { PopulationContainer } from '../features/PopulationContainer';

export default function Home() {
  const {
    prefectures,
    populationData,
    prefectureColors,
    years,
    populationType,
    error,
    handlePrefectureChange,
    handlePopulationTypeChange,
  } = PopulationContainer();

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
      <h1>{POPULATION_PREFECTURES}</h1>
      {error && <p>{error}</p>}
      <select
        onChange={handlePopulationTypeChange}
        value={populationType}
        className="select-box"
      >
        <option value={POPULATION_TYPE.TOTAL}>{POPULATION_TYPE.TOTAL}</option>
        <option value={POPULATION_TYPE.YOUNG}>{POPULATION_TYPE.YOUNG}</option>
        <option value={POPULATION_TYPE.WORKING}>
          {POPULATION_TYPE.WORKING}
        </option>
        <option value={POPULATION_TYPE.ELDERLY}>
          {POPULATION_TYPE.ELDERLY}
        </option>
      </select>
      {Object.keys(regions).map((region) => (
        <div key={region} className="region-container">
          <h2>{region}</h2>
          <div className="prefecture-container">
            {regions[region].map((prefCode: any) => {
              const prefecture = prefectures.find(
                (pref) => pref.prefCode === prefCode
              );
              if (!prefecture) return null;
              return (
                <div key={prefecture.prefCode} className="prefecture">
                  <input
                    type="checkbox"
                    id={`checkbox-${prefecture.prefCode}`}
                    value={prefecture.prefCode}
                    onChange={handlePrefectureChange}
                    aria-label={prefecture.prefName}
                  />
                  <label htmlFor={`checkbox-${prefecture.prefCode}`}>
                    {prefecture.prefName}
                  </label>
                </div>
              );
            })}
          </div>
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
                  borderColor: COLOR_CODE.TRANSPARENT,
                  backgroundColor: COLOR_CODE.TRANSPARENT,
                },
              ],
        }}
      />
    </div>
  );
}
