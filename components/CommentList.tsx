'use client';

import useSWR from 'swr';
import { getComments } from '@/lib/comments';
import Date from '@/components/Date';

export default function CommnetList({
  initialCommentData,
  postSlug,
}: {
  initialCommentData: any;
  postSlug: string;
}) {
  const { data: commentData } = useSWR(
    postSlug,
    (key: string) => getComments(key),
    { fallbackData: initialCommentData }
  );

  if (!commentData) return <div>Loading...</div>;

  const { commentCount, comments } = commentData;

  return (
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
  );
}
