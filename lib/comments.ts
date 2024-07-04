import graphqlRequest from './graphqlRequest';
import { CreateComment, GetCommentNode } from '@/types/comment';

type ResponseData = {
  data: { createComment: { success: boolean } };
  errors: { message: string }[];
};

export async function createComment(
  body: CreateComment
): Promise<ResponseData> {
  const mutation = {
    query: `mutation CreateComment(
      $author: String = "${body.author}",
      $authorEmail: String = "${body.authorEmail}",
      $clientMutationId: String = "uniqueId",
      $commentOn: Int = ${body.postId},
      $content: String = "${body.content}") {
      createComment(
        input: {
          author: $author,
          authorEmail: $authorEmail,
          content: $content,
          clientMutationId: $clientMutationId,
          commentOn: $commentOn}
      ) {
        success
      }
    }`,
  };

  const resJson = await graphqlRequest(mutation);

  return resJson;
}

export async function getComments(
  slug: string
): Promise<{ commentCount: number; comments: GetCommentNode }> {
  const query = {
    query: `query GetComments {
      post(id: "${slug}", idType: SLUG) {
        commentCount
        comments(where: {parentIn: "null"}) {
          nodes {
            content
            author {
              node {
                name
                avatar {
                  url
                  width
                  height
                }
              }
            }
            id
            date
            parentId
          }
        }
      }
    }`,
  };

  const resJson = await graphqlRequest(query);
  const comments = resJson.data.post.comments;
  const commentCount = resJson.data.post.commentCount;

  return {
    comments,
    commentCount,
  };
}
