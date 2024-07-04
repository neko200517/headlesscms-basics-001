import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let slug = req.query.slug;
  let path = '';

  if (req.query.type === 'post') {
    path = '/blog/' + slug;
  } else if (req.query.type === 'page') {
    path = '/' + slug;
  } else if (req.query.type === 'home') {
    path = '/blog';
  }

  if (req.query.secret !== process.env.NEXT_PUBLIC_REVALIDATION_SECRET) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    await res.revalidate(path);
    return res.json({ revalidated: true });
  } catch (err: any) {
    return res.status(500).send(err.message);
  }
}
