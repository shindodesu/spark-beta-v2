import Link from "next/link";

export default function About() {
  return (
    <main className="max-w-3xl mx-auto p-6 text-white">
      <h1 className="text-4xl font-bold mb-4 drop-shadow-md">Spark β について</h1>

      <section className="space-y-4 text-lg leading-relaxed text-white/90">
        <p>
          Spark β は、
          「もっと気軽に、でもちゃんと本気で、音を楽しめる仲間を見つけたい」
          そんな思いから生まれました。
        </p>

        <p>
          これまでの音楽コミュニティには、
          「内輪ノリ」や「空気を読む」みたいなルールが多くて、
          本当に面白い出会いが埋もれてしまうことがありました。
        </p>

        <p>
          それなら、仕組みで火花を起こしてしまおう！
          というのが Spark β の始まりです。
        </p>

        <h2 className="text-2xl font-bold mt-6">Spark β とは？</h2>
        <p>
          Spark β は、音を楽しみたい人同士が、
          もっと自然に繋がれる小さなマッチングプラットフォームです。
        </p>
        <p>
          最初は「シャッフルバンド自動生成」からスタートしていますが、
          今後は性格や価値観で繋がれる機能も準備中です。
        </p>
        <p>
          アカペラだけじゃなく、音楽や音文化全体を楽しむ人にとって、
          便利な“出会いのきっかけ”にしていきます。
        </p>

        <h2 className="text-2xl font-bold mt-6">これから</h2>
        <p>
          まだまだ β 版なので、
          みなさんの声を聞きながら育てていきます。
        </p>
        <p>
          「こういう機能が欲しい」「もっとこうしたら面白い！」など、
          ぜひ気軽に教えてください。
        </p>

        <h2 className="text-2xl font-bold mt-6">一緒に楽しもう！</h2>
        <p>
          誰かの都合や空気に縛られず、
          自分の“好き”を思いきり鳴らせる場所を。
          一緒に Spark β で、新しい音の火花を作っていきましょう！
        </p>
      </section>

      <div className="mt-8">
        <Link href="/" className="text-blue-400 underline hover:text-blue-200">
          ホームに戻る
        </Link>
      </div>
    </main>
  );
}
