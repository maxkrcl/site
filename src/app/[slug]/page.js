import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

// ИСПРАВЛЕНО: функция должна быть четко синхронной для чтения из файловой системы при экспорте
export function generateStaticParams() {
  const contentDirectory = path.join(process.cwd(), 'content');
  
  // Проверяем, существует ли папка, чтобы избежать падения сборщика
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }
  
  const filenames = fs.readdirSync(contentDirectory);
  return filenames.map((filename) => ({
    slug: filename.replace('.md', ''),
  }));
}

// Рендерим саму страницу (params обязательно разворачиваем через await)
export default async function Post({ params }) {
  const { slug } = await params;
  
  const filePath = path.join(process.cwd(), 'content', `${slug}.md`);
  
  // Проверяем физическое существование файла
  if (!fs.existsSync(filePath)) {
    return (
      <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>Статья не найдена</h1>
      </main>
    );
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  
  // Переводим Markdown в HTML-строку
  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return (
    <article style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <a href="../" style={{ color: '#0070f3', textDecoration: 'none' }}>← На главную</a>
        <h1 style={{ fontSize: '2.5rem', marginTop: '1rem', marginBottom: '0.5rem' }}>{data.title || slug}</h1>
        <p style={{ color: '#666', margin: 0 }}>{data.date || 'Дата не указана'}</p>
      </header>
      <hr style={{ border: '0', borderTop: '1px solid #eee', marginBottom: '2rem' }} />
      <div 
        style={{ lineHeight: '1.6', fontSize: '1.1rem' }} 
        dangerouslySetInnerHTML={{ __html: contentHtml }} 
      />
    </article>
  );
}
