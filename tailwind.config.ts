/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',      // src/pages ディレクトリ以下のすべての .js, .ts, .jsx, .tsx ファイル
    './src/components/**/*.{js,ts,jsx,tsx}', // src/components ディレクトリ以下のすべての .js, .ts, .jsx, .tsx ファイル
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;