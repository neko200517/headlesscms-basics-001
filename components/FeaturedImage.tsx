import { AppConfig } from '@/config/const';
import { PostNode } from '@/types/post';
import Image from 'next/image';
import Link from 'next/link';

export default function FeaturedImage({ post }: { post: PostNode }) {
  const defaultFeaturedImage = '/next.svg';
  const defaultWidth = 300;
  const defaultHeight = 200;

  let img = {
    src: defaultFeaturedImage,
    width: defaultWidth,
    height: defaultHeight,
  };

  if (post.featuredImage) {
    let size = post.featuredImage.node.mediaDetails.sizes[0];
    img = {
      src: `${
        process.env.NEXT_PUBLIC_WP_BASE_URL
          ? process.env.NEXT_PUBLIC_WP_BASE_URL
          : ''
      }${size.sourceUrl}`,
      width: Number(size.width),
      height: Number(size.height),
    };
  }

  return (
    <Link href={`/blog/${post.slug}`}>
      <Image
        {...img}
        alt={post.title}
        className='h-full object-cover rounded-xl'
      />
    </Link>
  );
}
