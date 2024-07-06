import SiteHeader from '@/components/SiteHeader';
import { getPostSlugs, getSinglePost } from '@/lib/posts';
import { getComments } from '@/lib/comments';
import { getSeo } from '@/lib/seo';
import CommentList from '@/components/CommentList';
import { getImageUrl } from '@/utils/utils';
import Date from '@/components/Date';
import { SinglePost } from '@/types/post';
import { Roboto_Slab, Rubik } from 'next/font/google';
import CommentForm from '@/components/CommentForm';

const rubik = Rubik({
  subsets: ['latin'],
  display: 'swap',
});

const roboto_slub = Roboto_Slab({
  subsets: ['latin'],
  display: 'swap',
});

const getFeatureImageUrl = (postData: SinglePost) => {
  let featureImageUrl = '/next.svg';

  if (postData.featuredImage) {
    if (postData.featuredImage.node.mediaDetails.sizes[0].sourceUrl) {
      // 高画質の画像を取得
      const largestImage =
        postData.featuredImage.node.mediaDetails.sizes.reduce((prev, current) =>
          parseInt(prev.width) > parseInt(current.width) ? prev : current
        );
      featureImageUrl = getImageUrl(largestImage.sourceUrl);
    }
  }
  return featureImageUrl;
};

export async function generateStaticParams() {
  const postSlugs = await getPostSlugs();
  const paths = postSlugs.map((s) => ({ postSlug: s.slug }));

  return paths;
}

export async function generateMetadata({
  params,
}: {
  params: { postSlug: string };
}) {
  const seoData = await getSeo('post', params.postSlug);

  let ogImage = '';
  if (seoData.opengraphImage) {
    ogImage = getImageUrl(seoData.opengraphImage.mediaItemUrl);
  }

  let ogUrl = seoData.opengraphUrl.replaceAll(
    process.env.NEXT_PUBLIC_WP_BASE_URL!,
    `${process.env.NEXT_PUBLIC_FRONT_BASE_URL}/blog`
  );

  return {
    title: seoData?.title,
    description: seoData?.metaDesc,
    openGraph: {
      title: seoData?.opengraphTitle,
      description: seoData?.metaDesc,
      images: [ogImage],
      url: ogUrl,
      locale: 'ja',
      type: seoData?.opengraphType,
      site_name: seoData?.opengraphSiteName,
    },
  };
}

export default async function Post({
  params,
}: {
  params: { postSlug: string };
}) {
  const postData = await getSinglePost(params.postSlug);
  const comentData = await getComments(params.postSlug);

  const imgUrl = getFeatureImageUrl(postData);
  const featureImageUrl = `url(${imgUrl})`;

  return (
    <>
      <section className='bg-slate-700 bg-opacity-70 absolute w-full z-20'>
        <SiteHeader className='header-single-post z-10 relative' />
      </section>

      <article className={`${rubik.className}`}>
        <section
          className={`hero-area h-[60vh] min-h-[30rem] bg-no-repeat bg-cover bg-center relative`}
          style={{ backgroundImage: featureImageUrl }}
        >
          <div className='absolute inset-0 bg-slate-900 opacity-40' />

          <div className='container mx-auto h-full flex flex-col justify-center lg:max-w-4xl'>
            <h1
              className={`text-6xl text-center text-slate-100 relative z-10 py-8 mt-12 ${roboto_slub.className}`}
            >
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

      <div className='container mx-auto lg:max-w-4xl'>
        <CommentForm
          postId={postData.databaseId}
          slug={postData.slug}
        ></CommentForm>
      </div>

      <CommentList initialCommentData={comentData} postSlug={params.postSlug} />
    </>
  );
}
