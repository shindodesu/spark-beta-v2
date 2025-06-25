import React, { useState, useEffect } from 'react'
import { User } from '../types/supabase'

type ProfileFormData = Omit<User, 'id' | 'email'>

interface ProfileFormProps {
  initialData?: ProfileFormData
  onSubmit: (data: ProfileFormData) => Promise<void>
  isSubmitting: boolean
  error: string | null
}

const PARTS = ['Soprano', 'Alto', 'Tenor', 'Baritone', 'Bass', 'Vocal_Percussion']
const REGIONS = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県', 'その他'
]

const ProfileForm: React.FC<ProfileFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  error
}) => {
  const [name, setNickname] = useState(initialData?.name || '')
  const [realName, setRealName] = useState(initialData?.real_name || '')
  const [university, setUniversity] = useState(initialData?.university || '')
  const [selectedParts, setSelectedParts] = useState<string[]>(initialData?.part || [])
  const [region, setRegion] = useState(initialData?.region || '')
  const [experienceYears, setExperienceYears] = useState(
    initialData?.experience_years?.toString() || ''
  )
  const [bio, setBio] = useState(initialData?.bio || '')
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    setNickname(initialData?.name || '')
    setRealName(initialData?.real_name || '')
    setUniversity(initialData?.university || '')
    setSelectedParts(initialData?.part || [])
    setRegion(initialData?.region || '')
    setExperienceYears(initialData?.experience_years?.toString() || '')
    setBio(initialData?.bio || '')
  }, [initialData])

  const handlePartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSelectedParts((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    // ✅ 必須項目のバリデーション
    if (
      !name.trim() ||
      !realName.trim() ||
      !university.trim() ||
      selectedParts.length === 0 ||
      !region.trim() ||
      !experienceYears.trim() ||
      !bio.trim()
    ) {
      setValidationError('すべての項目を入力してください。')
      return
    }

    await onSubmit({
      real_name: realName,
      name,
      university,
      part: selectedParts,
      region,
      experience_years: parseInt(experienceYears) || 0,
      bio
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-white">
      <div>
        <label htmlFor="nickname" className="block text-sm mb-1 text-white/80">
          あだ名（公開）
        </label>
        <input
          type="text"
          id="nickname"
          className="w-full px-4 py-2 rounded bg-white/20 backdrop-blur-md placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-white"
          value={name}
          onChange={(e) => setNickname(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="real_name" className="block text-sm mb-1 text-white/80">
          本名（非公開）
        </label>
        <input
          type="text"
          id="real_name"
          className="w-full px-4 py-2 rounded bg-white/20 backdrop-blur-md placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-white"
          value={realName}
          onChange={(e) => setRealName(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="university" className="block text-sm mb-1 text-white/80">
          大学名
        </label>
        <input
          type="text"
          id="university"
          className="w-full px-4 py-2 rounded bg-white/20 backdrop-blur-md placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-white"
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-2 text-white/80">パート（複数選択可）</label>
        <div className="grid grid-cols-2 gap-2">
          {PARTS.map((part) => (
            <label key={part} className="inline-flex items-center text-white/90">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-pink-400"
                value={part}
                checked={selectedParts.includes(part)}
                onChange={handlePartChange}
              />
              <span className="ml-2">{part}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="region" className="block text-sm mb-1 text-white/80">
          地域（都道府県）
        </label>
        <select
          id="region"
          className="w-full px-4 py-2 rounded bg-white/20 backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-white"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          required
        >
          <option value="">選択してください</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="experienceYears" className="block text-sm mb-1 text-white/80">
          経験年数（何年目か）
        </label>
        <input
          type="number"
          id="experienceYears"
          className="w-full px-4 py-2 rounded bg-white/20 backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-white appearance-none"
          value={experienceYears}
          onChange={(e) => setExperienceYears(e.target.value)}
          min="0"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="例: 2"
          required
        />
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm mb-1 text-white/80">
          自己紹介
        </label>
        <textarea
          id="bio"
          className="w-full px-4 py-2 rounded bg-white/20 backdrop-blur-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
        />
      </div>

      {validationError && (
        <p className="text-red-300 text-sm text-center">{validationError}</p>
      )}

      {error && (
        <p className="text-red-300 text-sm text-center">{error}</p>
      )}

      <button
        type="submit"
        className="w-full py-3 rounded-md bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 hover:brightness-110 text-white font-semibold transition"
        disabled={isSubmitting}
      >
        {isSubmitting ? '保存中...' : 'プロフィールを保存'}
      </button>
    </form>
  )
}

export default ProfileForm
