import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

// 1. Говорим Next.js, какие именно страницы (slug) нужно сгенерировать при сборке [4]
export async function generateStaticParams() {
  const contentDirectory = path.join(process.cwd(), 'content');
  const filenames = fs.readdirSync(contentDirectory);
  return filenames.map((filename) => ({
    slug: filename.replace('.md', ''),
  }));
}

// 2. Рендерим саму страницу
export default async function Post({ params }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'content', `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  
  const { data, content } = matter(fileContents);
  
  // Переводим Markdown в HTML-строку
  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return (
    <article style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>{data.title}</h1>
      <p style={{ color: '#666' }}>{data.date}</p>
      <hr />
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </article>
  );
}
