import Image from 'next/image'

interface ChatBubbleProps {
  user: 'shindo' | 'junna'
  icon: string
  name: string
  children: React.ReactNode
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ user, icon, name, children }) => {
  const isRight = user === 'junna'

  return (
    <div className={`flex items-start mb-4 ${isRight ? 'justify-end' : ''}`}>
      {!isRight && (
        <Image
          src={icon}
          alt={name}
          width={40}
          height={40}
          className="rounded-full mr-2"
        />
      )}
      <div
        className={`max-w-xs p-3 rounded-lg text-sm whitespace-pre-wrap shadow ${
          isRight
            ? 'bg-pink-500 text-white rounded-br-none mr-2'
            : 'bg-white text-gray-800 rounded-bl-none'
        }`}
      >
        {children}
      </div>
      {isRight && (
        <Image
          src={icon}
          alt={name}
          width={40}
          height={40}
          className="rounded-full ml-2"
        />
      )}
    </div>
  )
}

export default function InterviewChat() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4 text-white">
      <h1 className="text-2xl font-bold text-center mb-6">🎤 利用者インタビュー：純菜（山口大学,Sing A Song）</h1>

      <ChatBubble user="shindo" icon="/bad_note_icon.jpg" name="進藤">
        今回は、Spark β のシャッフルバンド企画に参加してくれた純菜さん（山口大学,Sing A Song）にお話を聞いていきます！
      </ChatBubble>

      <ChatBubble user="junna" icon="/junna_icon.jpg" name="純菜">
        よろしくお願いします〜！
      </ChatBubble>

      <ChatBubble user="shindo" icon="/bad_note_icon.jpg" name="進藤">
        いや〜コアスタッフお疲れ様でした。純菜さんにとってSparkってどんなイベントでしたか？
      </ChatBubble>

      <ChatBubble user="junna" icon="/junna_icon.jpg" name="純菜">
        楽しかったです！うちの大学ってあんまりイベント出てなくて……。今回みたいに他大の人と話せたのは初めてで新鮮でした！
      </ChatBubble>

      <ChatBubble user="shindo" icon="/bad_note_icon.jpg" name="進藤">
        今回は、九州・山口でも前例の少ないシャッフルバンド企画をしてみたけど、ぶっちゃけどうでした？
      </ChatBubble>

      <ChatBubble user="junna" icon="/junna_icon.jpg" name="純菜">
        練習も和気あいあいとしてて楽しかったです。最初は緊張したけど、いずみんさんとかがうまく回してくれて、自然と話せる雰囲気でした。
      </ChatBubble>

      <ChatBubble user="shindo" icon="/bad_note_icon.jpg" name="進藤">
        まっつー(SASのもう一人の参加者)も一緒に参加してたよね？
      </ChatBubble>

      <ChatBubble user="junna" icon="/junna_icon.jpg" name="純菜">
        はい！「学校外と関わりたいけど出るのがむずいよ〜」って言ってたので、個人で出られるシャッフルバンド企画がすごくありがたかったです。
      </ChatBubble>

      <ChatBubble user="shindo" icon="/bad_note_icon.jpg" name="進藤">
        わ、まっつーがそう言ってるのめっちゃみえる(笑)。Sparkのテーマであるように彼の「きっかけ」になってくれていたら嬉しいですね。SASの普段の活動はどんな感じ？
      </ChatBubble>

      <ChatBubble user="junna" icon="/junna_icon.jpg" name="純菜">
        幽霊含めると60人くらいだけど、実働は各学年10人くらい。兼部も多くて、バンドの6人全会一致で動くのは難しいです。
      </ChatBubble>

      <ChatBubble user="shindo" icon="/bad_note_icon.jpg" name="進藤">
        Spark が転換点になった？
      </ChatBubble>

      <ChatBubble user="junna" icon="/junna_icon.jpg" name="純菜">
        間違いなく！他大の人と話すの初めてだったけど、意外とラフに話せました。「スキャット」「シラブル」みたいな言葉の文化差も面白かったです。
      </ChatBubble>

      <ChatBubble user="junna" icon="/junna_icon.jpg" name="純菜">
        こういう場、もっとあったらいいなって思います！九州って渉外のオフ会も少ないので（笑）、Sparkみたいなつながりがもっと増えると嬉しいです。
      </ChatBubble>
    </div>
  )
}
