export type CreateComment = {
  author: string;
  authorEmail: string;
  content: string;
  postId: number;
};

export type GetCommentNode = {
  nodes: {
    content: string;
    author: {
      node: {
        name: string;
        avatar: {
          url: string;
          width: number;
          height: number;
        };
      };
    };
    id: string;
    date: string;
    parentId: string | number | null;
  }[];
};
