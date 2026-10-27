/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Включает генерацию статического HTML [1]
  basePath: '/site', // Путь к вашему репозиторию на GitHub Pages [2]
  trailingSlash: true,
  images: {
    unoptimized: true, // GitHub Pages не поддерживает стандартную оптимизацию изображений Next.js [3]
  },
};

export default nextConfig;
