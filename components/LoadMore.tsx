'use client';

import { getPostList } from '@/lib/posts';
import { PostList } from '@/types/post';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

function useButtonState(initialState: 'loading' | 'disabled' | 'enabled') {
  let [state, setState] = useState(initialState);
  let buttonText, buttonStyle, buttonDisabled;

  switch (state) {
    case 'loading':
      buttonText = 'Loading...';
      buttonStyle = 'bg-yellow-400 hover:bg-yellow-500';
      buttonDisabled = true;
      break;
    case 'disabled':
      buttonText = 'No more posts to load';
      buttonStyle = 'bg-slate-400 hover:bg-slate-500';
      buttonDisabled = true;
      break;
    case 'enabled':
      buttonText = 'Load more posts';
      buttonStyle = 'bg-blue-400 hover:bg-blue-500';
      buttonDisabled = false;
      break;
  }

  return { state, setState, buttonText, buttonStyle, buttonDisabled };
}

export default function LoadMore({
  posts,
  setPosts,
  taxonomy = null,
}: {
  posts: PostList;
  setPosts: Dispatch<SetStateAction<PostList>>;
  taxonomy?: { key: string; value: string } | null;
}) {
  const {
    setState: setButtonState,
    buttonText,
    buttonStyle,
    buttonDisabled,
  } = useButtonState('loading');

  const handleClick = async () => {
    setButtonState('loading');

    // フェッチした新しいnodesを前回のnodesに追加
    let updatedPosts = { ...posts };
    const morePosts = await getPostList(posts.pageInfo.endCursor, taxonomy);
    updatedPosts.nodes = [...updatedPosts.nodes, ...morePosts.nodes];
    updatedPosts.pageInfo = morePosts.pageInfo;
    setPosts(updatedPosts);

    setButtonState(posts.pageInfo.hasNextPage ? 'enabled' : 'disabled');
  };

  useEffect(() => {
    setButtonState(posts.pageInfo.hasNextPage ? 'enabled' : 'disabled');
  }, [posts.pageInfo.hasNextPage]);

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
