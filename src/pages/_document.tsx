// src/pages/_document.tsx

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ja"> {/* 言語設定もここでできます */}
      <Head>
        {/* 汎用的なファビコン (通常は.ico形式が推奨) */}
        <link rel="icon" href="/spark-beta-logo.png" sizes="any" />
        {/* モダンブラウザ用のSVGアイコン (推奨) */}
        <link rel="icon" href="/spark-beta-logo.png" type="image/svg+xml" />

        {/* 必要であれば、その他のメタタグやフォントなどもここに追加できます */}
        {/* <meta name="description" content="Spark β - アカペラシャッフルバンドマッチング" /> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}