import { NextRequest, NextResponse } from 'next/server';
import { createComment } from '@/lib/comments';

type RequestData = {
  author: string;
  authorEmail: string;
  content: string;
  postId: number;
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as RequestData;

  if (
    !body.author ||
    !body.authorEmail ||
    !body.content ||
    body.postId === undefined
  ) {
    return NextResponse.json(
      { message: 'Required fields missing', body },
      { status: 400 }
    );
  }

  const resJson = await createComment(body);

  if (resJson.errors) {
    return NextResponse.json(
      { message: resJson.errors[0].message, body },
      { status: 401 }
    );
  } else if (
    resJson.data.createComment !== null &&
    resJson.data.createComment.success === true
  ) {
    return NextResponse.json({ message: 'Your comment is awaiting approval' });
  }

  return NextResponse.json({ message: 'Some error occurred' }, { status: 500 });
}
