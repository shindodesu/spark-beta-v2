import Link from "next/link";
import Image from "next/image";


export default function About() {
  return (
    <main className="max-w-3xl mx-auto p-6 text-white">
      {/* ✅ ロゴを追加 */}
  {/* 写真エリア：ネオングラス風ボックス */}
  <div className="mb-10 flex justify-center">
  <div className="w-72 h-72 overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/30 shadow-md">
    <Image
      src="/spark_greeting_by_bad_note.JPG"
      alt="Spark副代表挨拶"
      width={288}
      height={288}
      className="object-cover object-top w-full h-full"
    />
  </div>
</div>

      <h1 className="text-4xl font-bold mb-6 drop-shadow-md">
        Spark β について
      </h1>

      <section className="space-y-6 text-lg leading-loose text-white/90">
        <p>
          こんにちは！<br />
          Spark β を作った人、進藤(バッド)です。
        </p>
        <p>
          Spark β は<br />
          「もっと気軽に、でも本質的に、音を楽しめる仲間を見つけたい」<br />
          そんな思いから生まれました。<br />
        </p>

        <p>
          これまでの音楽コミュニティには、<br />
          「閉じた雰囲気」や「同調圧力が正義」みたいなルールが多くて、<br />
          本当に面白い音や出会いが埋もれてしまうことがありました。
        </p>

        <p>
        けど、そんな時代は僕が終わらせたい。<br />
        芸術工学（音響設計専攻）の知見と IT 技術を掛け合わせて、<br />
        まだ誰も作らなかった仕組みを生み出した。<br />
        それが Spark β です。
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-2">
          💡 Spark β とは？
        </h2>
        <div className="space-y-4">
          <p>
            Spark β は、音文化を楽しみたい人同士が、<br />
            もっと自然に繋がれる新しいプラットフォームです。
          </p>
          <p>
            最初は「シャッフルバンド自動生成」からスタートしていますが、<br />
            今後は性格や価値観で繋がれる機能も準備中です。
          </p>
          <p>
            アカペラだけじゃなく、音楽や音文化全体を楽しむ人にとって、<br />
            便利な“出会いのきっかけ”にしていきます。
          </p>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-2">🚀 これから</h2>
        <div className="space-y-4">
          <p>
            まだまだ、駆け出しなので、<br />
            みなさんの声を聞きながら育てていきます。
          </p>
          <p>
            「こういう機能が欲しい」「もっとこうしたら面白い！」など、<br />
            ぜひ気軽に教えてください。
          </p>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-2">🎉 一緒に楽しもう！</h2>
        <p>
          誰かの都合や空気に縛られず、<br />
          自分の“好き”を思いきり鳴らせる場所を。<br />
          一緒に Spark β で、新しい音の火花を作っていきましょう！
        </p>

        <p className="mt-10 text-right text-sm text-white/70">
        — Written by Kosuke Shindo <br />(Acoustic Design, School of Design, <br /> Kyushu University/ Spark β Developer)

        </p>
      </section>

      <div className="mt-10">
        <Link
          href="/"
          className="text-blue-400 underline hover:text-blue-200 transition-colors"
        >
          ホームに戻る
        </Link>
      </div>
    </main>
  );
}
