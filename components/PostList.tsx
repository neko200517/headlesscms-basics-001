'use client';

import { PostList as PostListType } from '@/types/post';
import { useEffect, useState } from 'react';
import FeaturedImage from '@/components/FeaturedImage';
import Link from 'next/link';
import Date from '@/components/Date';
import LoadMore from '@/components/LoadMore';

export default function PostList({
  initialPosts,
  taxonomy,
}: {
  initialPosts: PostListType;
  taxonomy?: { key: string; value: string } | null;
}) {
  const [posts, setPosts] = useState(initialPosts);

  // 記事が減らされた場合の対策
  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  return (
    <main>
      <section className='container mx-auto lg:max-w-5xl post-list mt-4'>
        <ul>
          {posts.nodes.map((post) => (
            <li key={post.slug} className='grid grid-cols-5 gap-4 mb-4'>
              <div className='col-span-2'>
                <FeaturedImage post={post} />
              </div>
              <div className='col-span-3'>
                <h2 className='py-4'>
                  <Link
                    href={`/blog/${post.slug}`}
                    className='text-blue-400 text-2xl hover:text-blue-600'
                  >
                    {post.title}
                  </Link>
                </h2>
                <div className='py-4'>
                  Published on <Date dateString={post.date} />
                </div>
                <div
                  className='text-lg'
                  dangerouslySetInnerHTML={{ __html: post.excerpt }}
                />
                <div className='py-4'>
                  Posted under{' '}
                  {post.categories.nodes.map((category) => (
                    <Link
                      className='text-blue-400 hover:text-blue-500'
                      href={`/category/${category.slug}`}
                      key={category.slug}
                    >
                      {category.name}{' '}
                    </Link>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className='py-4 text-center'>
          <LoadMore posts={posts} setPosts={setPosts} taxonomy={taxonomy} />
        </div>
      </section>
    </main>
  );
}
