'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CitySelector } from './CitySelector';

interface WeatherAppClientProps {
  initialCity: string;
}

/**
 * 天気予報アプリのクライアントサイド機能をまとめたラッパーコンポーネント
 * 
 * @param initialCity - 初期選択都市
 */
export const WeatherAppClient: React.FC<WeatherAppClientProps> = ({ initialCity = 'Tokyo' }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  /**
   * 都市が変更されたときの処理
   * クエリパラメータを更新し、ページをリフレッシュする
   */
  const handleCityChange = (newCity: string) => {
    setIsLoading(true);
    
    // 実際のアプリケーションでは、以下のようにURLを更新する
    // router.push(`/projects/003?city=${encodeURIComponent(newCity)}`);
    
    // このデモでは単純にページを再読み込みする
    router.refresh();
    
    // 実際のページ遷移が完了するまでローディング状態を維持
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };
  
  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
        </div>
      )}
      
      <CitySelector 
        initialCity={initialCity}
        onCityChange={handleCityChange}
      />
    </>
  );
};