import { SiteHeader } from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { getPostSlugs, getSinglePost } from '@/lib/posts';
import { SinglePost } from '@/types/post';
import Date from '@/components/Date';
import CommentForm from '@/components/CommentForm';
import { getComments } from '@/lib/comments';
import { GetCommentNode } from '@/types/comment';
import useSWR from 'swr';
import { AppConfig } from '@/config/const';
import { Rubik, Roboto_Slab } from 'next/font/google';
import { getSeo } from '@/lib/seo';
import { SeoPost } from '@/types/seo';
import { getImageUrl } from '@/utils/utils';
import SeoHead from '@/components/SeoHead';

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

export async function getStaticProps({
  params,
}: {
  params: { postSlug: string };
}) {
  const staticPostData = await getSinglePost(params.postSlug);
  const staticCommentData = await getComments(params.postSlug);
  const seoData = await getSeo('post', params.postSlug);

  return {
    props: {
      staticPostData,
      staticCommentData,
      seoData,
      params,
    },
    revalidate: AppConfig.REVALIDATE_1HOUR,
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
    fallback: 'blocking',
  };
}

export default function Post({
  staticPostData,
  staticCommentData,
  seoData,
  params,
}: {
  staticPostData: SinglePost;
  staticCommentData: {
    commentCount: number;
    comments: GetCommentNode;
  };
  seoData: SeoPost;
  params: { postSlug: string };
}) {
  const fetcherPost = ([_, slug1]: [string, string]) => getSinglePost(slug1);
  const fetcherComment = ([_, slug2]: [string, string]) => getComments(slug2);

  // post
  const { data: postData } = useSWR(['post', params.postSlug], fetcherPost, {
    fallbackData: staticPostData,
  });

  // comment
  const { data: commentData } = useSWR(
    ['comment', [params.postSlug]],
    fetcherComment,
    {
      fallbackData: staticCommentData,
    }
  );

  // featureImageUrl
  const imgUrl = getFeatureImageUrl(postData);
  const featureImageUrl = `url(${imgUrl})`;

  // comment
  const { commentCount, comments } = commentData;

  if (!postData || !commentData) return <div>Loading...</div>;

  return (
    <>
      <SeoHead pathname='/blog' seoData={seoData}>
        <style>
          {`
              .post-content ul {
                font-family: ${roboto_slub.style.fontFamily}
              }
            `}
        </style>
      </SeoHead>
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
        <CommentForm postId={postData.databaseId}></CommentForm>
      </div>

      <div className='container mx-auto lg:max-w-4xl'>
        <section>
          <h3 className='text-xl py-2 my-4 pl-4 border-l-4 border-l-lime-300'>
            {commentCount ? commentCount : 'No'} comments on this Post so far:
          </h3>
          <ul>
            {comments.nodes.map((comment) => (
              <li key={comment.id} className='pb-4 border-b'>
                <div className='comment-header flex justify-start items-center'>
                  <div className='py-4'>
                    <img
                      src={comment.author.node.avatar.url}
                      alt={comment.author.node.name}
                      className='rounded-full max-w-[50px] mr-4'
                    />
                  </div>
                  <div>
                    <div className='font-bold'>{comment.author.node.name}</div>
                    <div className='text-sm'>
                      <Date dateString={comment.date} />
                    </div>
                  </div>
                </div>
                <div className='comment-body pl-[66px]'>
                  <div dangerouslySetInnerHTML={{ __html: comment.content }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
