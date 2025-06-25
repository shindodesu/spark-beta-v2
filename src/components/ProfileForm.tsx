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
      {/* ...既存の input 各種はそのまま... */}

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
