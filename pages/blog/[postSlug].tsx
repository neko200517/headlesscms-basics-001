import Head from 'next/head';
import { SiteHeader } from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { getPostSlugs, getSinglePost } from '@/lib/posts';
import { SinglePost } from '@/types/post';
import Date from '@/components/Date';

export async function getStaticProps({
  params,
}: {
  params: { postSlug: string };
}) {
  const postData = await getSinglePost(params.postSlug);

  let featureImageUrl = '/next.svg';

  if (postData.featuredImage) {
    if (postData.featuredImage.node.mediaDetails.sizes[0].sourceUrl) {
      // 高画質の画像を取得
      const largestImage =
        postData.featuredImage.node.mediaDetails.sizes.reduce((prev, current) =>
          parseInt(prev.width) > parseInt(current.width) ? prev : current
        );
      featureImageUrl = `${
        process.env.NEXT_PUBLIC_WP_BASE_URL
          ? process.env.NEXT_PUBLIC_WP_BASE_URL
          : ''
      }${largestImage.sourceUrl}`;
    }
  }

  return {
    props: {
      postData,
      featureImageUrl: `url(${featureImageUrl})`,
    },
  };
}

export async function getStaticPaths() {
  const postSlugs = await getPostSlugs();
  const paths = postSlugs.map((s) => ({
    params: {
      postSlug: s.slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export default function Post({
  postData,
  featureImageUrl,
}: {
  postData: SinglePost;
  featureImageUrl: string;
}) {
  return (
    <>
      <Head>
        <title key={postData.slug}>{postData.title}</title>
        <meta
          name='description'
          content={postData.excerpt}
          key='metadescription'
        />
      </Head>
      <section className='bg-slate-700 bg-opacity-70 absolute w-full z-20'>
        <SiteHeader className='header-single-post z-10 relative' />
      </section>
      <article>
        <section
          className={`hero-area h-[60vh] min-h-[30rem] bg-no-repeat bg-cover bg-center relative`}
          style={{ backgroundImage: featureImageUrl }}
        >
          <div className='absolute inset-0 bg-slate-900 opacity-40' />

          <div className='container mx-auto h-full flex flex-col justify-center lg:max-w-4xl'>
            <h1 className='text-6xl text-center text-slate-100 relative z-10 py-8 mt-12'>
              {postData.title}
            </h1>

            <div className='pb-4 text-slate-100 z-10'>
              Posted by Abhinav, last updated on{' '}
              <Date dateString={postData.modified} />
            </div>

            <div
              dangerouslySetInnerHTML={{ __html: postData.excerpt }}
              className='relative z-10 text-left text-slate-200 text-2xl pl-4 border-l-4 border-lime-200'
            />
          </div>
        </section>
        <section className='content-area py-8'>
          <div
            dangerouslySetInnerHTML={{ __html: postData.content }}
            className='post-content container lg:max-w-4xl mx-auto'
          />
        </section>
      </article>
    </>
  );
}
