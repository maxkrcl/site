import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

export default function Home() {
  // 1. Читаем все файлы из папки content
  const contentDirectory = path.join(process.cwd(), 'content');
  const filenames = fs.readdirSync(contentDirectory);

  const posts = filenames.map((filename) => {
    const filePath = path.join(contentDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    const slug = filename.replace('.md', '');

    return { slug, ...data };
  });

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ borderBottom: '2px solid #eee', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <h1>Навигация по сайту</h1>
        <p style={{ color: '#666' }}>Ниже представлен список всех найденных Markdown-постов.</p>
      </header>

      <section>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Доступные статьи:</h2>
        
        {posts.length === 0 ? (
          <p>Файлы .md не найдены в папке content/</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {posts.map((post) => (
              <li 
                key={post.slug} 
                style={{ 
                  background: '#f9f9f9', 
                  border: '1px solid #ddd', 
                  borderRadius: '8px', 
                  padding: '1.5rem', 
                  marginBottom: '1rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                {/* Интерактивная ссылка Next.js */}
                <Link 
                  href={`/${post.slug}`} 
                  style={{ 
                    fontSize: '1.3rem', 
                    fontWeight: 'bold', 
                    color: '#0070f3', 
                    textDecoration: 'none' 
                  }}
                >
                  {post.title || post.slug}
                </Link>
                
                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                  <span>📅 Дата публикации: {post.date || 'Не указана'}</span>
                </div>

                {/* Техническая подсказка для проверки пути */}
                <div style={{ marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px dashed #eee', fontSize: '0.85rem', color: '#888' }}>
                  <code>Относительный путь в коде: /{post.slug}</code>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
