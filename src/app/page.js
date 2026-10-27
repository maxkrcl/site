import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

export default function Home() {
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
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Мой Базовый Блог</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug} style={{ margin: '1rem 0' }}>
            <Link href={`/${post.slug}`} style={{ fontSize: '1.2rem', color: '#0070f3' }}>
              {post.title}
            </Link>
            <span style={{ marginLeft: '10px', color: '#666' }}>({post.date})</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
