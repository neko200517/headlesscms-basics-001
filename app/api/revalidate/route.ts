import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type');
  const secret = req.nextUrl.searchParams.get('secret');
  const slug = req.nextUrl.searchParams.get('slug');
  let path = '';

  switch (type) {
    case 'post':
      path = '/blog/' + slug;
      break;
    case 'page':
      path = '/' + slug;
      break;
    case 'home':
      path = '/blog';
      break;
  }

  if (secret !== process.env.NEXT_PUBLIC_REVALIDATION_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  try {
    await revalidatePath(path);
    return NextResponse.json({
      revalidated: true,
      path: path,
      time: Date.now(),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        revalidated: false,
        message: err.message,
      },
      { status: 500 }
    );
  }
}
