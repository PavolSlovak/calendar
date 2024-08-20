npm create vite@latest my-project -- --template react-ts
cd my-project

npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

#tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

#index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

#package.json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "serve": "vite preview"
  }
}
#  Start the development server
npm run dev