// page.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import 'jest-canvas-mock';
import Home from '../app/page';
import { PopulationContainer } from '../features/PopulationContainer';
import { getPrefectures, getPopulationData } from '../lib/getPrefectures';

// Mock the PopulationContainer and API functions
jest.mock('../features/PopulationContainer');
jest.mock('../lib/getPrefectures');
jest.mock('react-chartjs-2', () => {
  return {
    Line: () => <canvas data-testid="chart-canvas" />,
  };
});

const mockPopulationContainer = PopulationContainer as jest.MockedFunction<
  typeof PopulationContainer
>;
const mockGetPrefectures = getPrefectures as jest.MockedFunction<
  typeof getPrefectures
>;
const mockGetPopulationData = getPopulationData as jest.MockedFunction<
  typeof getPopulationData
>;

describe('Home component', () => {
  beforeEach(() => {
    mockPopulationContainer.mockReturnValue({
      prefectures: [
        { prefCode: 1, prefName: '北海道' },
        { prefCode: 2, prefName: '青森県' },
      ],
      populationData: {
        1: {
          name: '北海道',
          data: [
            { year: 2000, value: 1000 },
            { year: 2005, value: 1200 },
          ],
        },
        2: {
          name: '青森県',
          data: [
            { year: 2000, value: 800 },
            { year: 2005, value: 850 },
          ],
        },
      },
      prefectureColors: {
        1: '#FF0000',
        2: '#00FF00',
      },
      years: [2000, 2005],
      populationType: '総人口',
      error: null,
      handlePrefectureChange: jest.fn(),
      handlePopulationTypeChange: jest.fn(),
      selectedPrefectures: [],
    });

    mockGetPrefectures.mockResolvedValue([
      { prefCode: 1, prefName: '北海道' },
      { prefCode: 2, prefName: '青森県' },
    ]);

    mockGetPopulationData.mockResolvedValue([
      { year: 2000, value: 1000 },
      { year: 2005, value: 1200 },
    ]);
  });

  it('renders the header', () => {
    render(<Home />);
    expect(screen.getByText('都道府県別総人口推移')).toBeInTheDocument();
  });

  it('renders the prefecture checkboxes', () => {
    render(<Home />);
    expect(screen.getByLabelText('北海道')).toBeInTheDocument();
    expect(screen.getByLabelText('青森県')).toBeInTheDocument();
  });

  it('renders the population type select box', () => {
    render(<Home />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders the chart', () => {
    render(<Home />);
    expect(screen.getByTestId('chart-canvas')).toBeInTheDocument();
  });

  it('calls handlePrefectureChange when a checkbox is clicked', async () => {
    const { handlePrefectureChange } = mockPopulationContainer();
    render(<Home />);

    const checkbox = screen.getByLabelText('北海道');
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(handlePrefectureChange).toHaveBeenCalled();
    });
  });

  it('calls handlePopulationTypeChange when a select box option is changed', async () => {
    const { handlePopulationTypeChange } = mockPopulationContainer();
    render(<Home />);

    const selectBox = screen.getByRole('combobox');
    fireEvent.change(selectBox, { target: { value: '年少人口' } });

    await waitFor(() => {
      expect(handlePopulationTypeChange).toHaveBeenCalled();
    });
  });

  it('displays error message when error exists', () => {
    mockPopulationContainer.mockReturnValueOnce({
      ...mockPopulationContainer(),
      error: 'Error fetching data',
    });
    render(<Home />);

    expect(screen.getByText('Error fetching data')).toBeInTheDocument();
  });
});
