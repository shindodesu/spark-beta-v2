import { useEffect, useState } from 'react'

export default function AddToHomeButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowButton(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice
    if (choice.outcome === 'accepted') {
      console.log('PWAインストール成功')
    } else {
      console.log('PWAインストール拒否')
    }
    setShowButton(false)
  }

  if (!showButton) return null

  return (
    <div className="p-4 bg-white/10 backdrop-blur-md rounded-lg text-white text-sm flex items-center justify-between shadow mt-6">
      <span>ホーム画面に追加してすぐアクセスできます！</span>
      <button
        onClick={handleInstallClick}
        className="ml-4 px-3 py-1 bg-pink-400 hover:bg-pink-500 text-white font-bold rounded"
      >
        追加する
      </button>
    </div>
  )
}
