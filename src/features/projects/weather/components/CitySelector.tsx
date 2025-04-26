'use client';

import { useState, useCallback } from 'react';

interface CitySelectorProps {
  initialCity: string;
  onCityChange: (city: string) => void;
}

/**
 * 天気予報アプリの都市選択フォームコンポーネント
 *
 * @param initialCity - 初期選択都市
 * @param onCityChange - 都市変更時のコールバック関数
 */
export const CitySelector: React.FC<CitySelectorProps> = ({
  initialCity = 'Tokyo',
  onCityChange,
}) => {
  const [city, setCity] = useState(initialCity);
  const [inputValue, setInputValue] = useState(initialCity);
  
  // よく使われる都市の一覧
  const popularCities = [
    { name: '東京', value: 'Tokyo' },
    { name: '大阪', value: 'Osaka' },
    { name: '名古屋', value: 'Nagoya' },
    { name: '札幌', value: 'Sapporo' },
    { name: '福岡', value: 'Fukuoka' }
  ];

  // 都市変更の確定時の処理
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setCity(inputValue);
      onCityChange(inputValue);
    }
  }, [inputValue, onCityChange]);

  // クイック選択時の処理
  const handleQuickSelect = useCallback((cityValue: string) => {
    setInputValue(cityValue);
    setCity(cityValue);
    onCityChange(cityValue);
  }, [onCityChange]);

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">都市を選択</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="都市名を入力（英語）"
          aria-label="都市名"
          className="flex-grow px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          data-testid="city-input"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-200"
          data-testid="search-button"
        >
          検索
        </button>
      </form>
      
      <div className="mt-4">
        <p className="text-sm text-gray-600 mb-2">よく検索される都市:</p>
        <div className="flex flex-wrap gap-2">
          {popularCities.map((popularCity) => (
            <button
              type="button"
              key={popularCity.value}
              onClick={() => handleQuickSelect(popularCity.value)}
              className={`px-3 py-1 text-sm rounded-full transition duration-200 ${
                city === popularCity.value
                  ? 'bg-blue-100 text-blue-700 border-blue-300'
                  : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
              } border`}
            >
              {popularCity.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};