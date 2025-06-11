// src/components/ProfileForm.tsx
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types'; // 型をインポート
import { supabase } from '../lib/supabase'; // Supabaseクライアントをインポート

interface ProfileFormProps {
  initialData?: UserProfile; // 初期表示データ（既存プロフィールの編集用）
  onSubmit: (data: UserProfile) => Promise<void>; // フォーム送信時のハンドラ
  isSubmitting: boolean; // フォーム送信中フラグ
  error: string | null; // エラーメッセージ
}

const PARTS = ['Soprano', 'Alto', 'Tenor', 'Baritone', 'Bass','Vocal_Perc.'];
const REGIONS = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
];

const ProfileForm: React.FC<ProfileFormProps> = ({ initialData, onSubmit, isSubmitting, error }) => {
  const [nickname, setNickname] = useState(initialData?.nickname || '');
  const [selectedParts, setSelectedParts] = useState<string[]>(initialData?.part || []);
  const [region, setRegion] = useState(initialData?.region || '');
  const [experienceYears, setExperienceYears] = useState(initialData?.experienceYears || 0);

  // initialDataが更新された場合にフォームの状態をリセット
  useEffect(() => {
    if (initialData) {
      setNickname(initialData.nickname);
      setSelectedParts(initialData.part);
      setRegion(initialData.region);
      setExperienceYears(initialData.experienceYears);
    }
  }, [initialData]);

  const handlePartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedParts((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ nickname, part: selectedParts, region, experienceYears });
  };

  return (
    <div className="p-8 bg-white rounded shadow-md w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">プロフィール{initialData ? '編集' : '作成'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* あだ名 */}
        <div>
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
            あだ名
          </label>
          <input
            type="text"
            id="nickname"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
        </div>

        {/* パート（選択式） */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            パート (複数選択可)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PARTS.map((part) => (
              <label key={part} className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600"
                  value={part}
                  checked={selectedParts.includes(part)}
                  onChange={handlePartChange}
                />
                <span className="ml-2 text-gray-700">{part}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 地域（選択式） */}
        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700">
            地域 (都道府県)
          </label>
          <select
            id="region"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            required
          >
            <option value="">選択してください</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* 経験年数 */}
        <div>
          <label htmlFor="experienceYears" className="block text-sm font-medium text-gray-700">
            経験年数
          </label>
          <input
            type="number"
            id="experienceYears"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={experienceYears}
            onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
            min="0"
            required
          />
        </div>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? '保存中...' : 'プロフィールを保存'}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;