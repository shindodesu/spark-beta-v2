/** @type {import('tailwindcss').Config} */
module.exports = {
  important : true,
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}', // src/pages 以下のすべてのJS/TS/JSX/TSXファイルをスキャン
    './src/components/**/*.{js,ts,jsx,tsx}', // src/components 以下のすべてのJS/TS/JSX/TSXファイルをスキャン
    // もし、src/ディレクトリ以外（例: public/index.htmlなど）でTailwindクラスを直接使用している場合は、ここに追加します。
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
