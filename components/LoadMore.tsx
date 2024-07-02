import { getPostList } from '@/lib/posts';
import { PostList } from '@/types/post';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export default function LoadMore({
  posts,
  setPosts,
  taxonomy = null,
}: {
  posts: PostList;
  setPosts: Dispatch<SetStateAction<PostList>>;
  taxonomy?: { key: string; value: string } | null;
}) {
  const [buttonText, setButtonText] = useState('Load more posts');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonStyle, setButtonStyle] = useState(
    'bg-blue-400 hover:bg-blue-500'
  );

  const handleClick = async () => {
    setButtonText('Loading...');
    setButtonDisabled(true);

    // フェッチした新しいnodesを前回のnodesに追加
    let updatedPosts = { ...posts };
    const morePosts = await getPostList(posts.pageInfo.endCursor, taxonomy);
    updatedPosts.nodes = [...updatedPosts.nodes, ...morePosts.nodes];
    updatedPosts.pageInfo = morePosts.pageInfo;
    setPosts(updatedPosts);

    setNextButtonStyle(posts.pageInfo.hasNextPage);
  };

  useEffect(() => {
    setNextButtonStyle(posts.pageInfo.hasNextPage);
  }, [posts.pageInfo.hasNextPage]);

  // 次のページの状態でボタンスタイルを変更
  const setNextButtonStyle = (hasNextPage: boolean) => {
    if (hasNextPage) {
      setButtonText('Load more posts');
      setButtonDisabled(false);
      setButtonStyle('bg-blue-400 hover:bg-blue-500');
    } else {
      setButtonText('No more posts to load');
      setButtonDisabled(true);
      setButtonStyle('bg-slate-400 hover:bg-slate-500');
    }
  };

  return (
    <button
      className={`load-more font-bold px-4 py-2 text-slate-900 ${buttonStyle}`}
      onClick={handleClick}
      disabled={buttonDisabled}
    >
      {buttonText}
    </button>
  );
}
