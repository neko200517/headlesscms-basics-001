export type PostNode = {
  date: string;
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: {
    node: {
      mediaDetails: {
        file: string;
        sizes: {
          sourceUrl: string;
          width: string;
          height: string;
        }[];
      };
    };
  };
  categories: {
    nodes: {
      name: string;
      slug: string;
    }[];
  };
};

export type PostList = {
  nodes: PostNode[];
  pageInfo: {
    startCursor: string;
    endCursor: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export type SinglePost = {
  content: string;
  date: string;
  excerpt: string;
  modified: string;
  slug: string;
  title: string;
  featuredImage: {
    node: {
      mediaDetails: {
        sizes: {
          sourceUrl: string;
          width: string;
          height: string;
        }[];
      };
    };
  };
  categories: {
    nodes: {
      name: string;
      slug: string;
    };
  }[];
};

export type CategoryDetail = {
  count: number;
  name: string;
  slug: string;
};
