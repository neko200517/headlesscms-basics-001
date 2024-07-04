// import { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   let slug = req.query.slug;
//   let path = '';

//   if (req.query.type === 'post') {
//     path = '/blog/' + slug;
//   } else if (req.query.type === 'page') {
//     path = '/' + slug;
//   } else if (req.query.type === 'home') {
//     path = '/blog';
//   }

//   if (req.query.secret !== process.env.NEXT_PUBLIC_REVALIDATION_SECRET) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }

//   try {
//     await res.revalidate(path);
//     return res.json({ revalidated: true });
//   } catch (err: any) {
//     return res.status(500).send(err.message);
//   }
// }

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    body: { paths, postId },
    method,
  } = req;

  if (
    req.headers.authorization !== `Bearer ${process.env.REVALIDATE_SECRET_KEY}`
  ) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (method !== 'PUT') {
    return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }

  if (!paths) {
    return res.status(412).json({ message: 'No paths' });
  }

  const correctPaths = paths.filter((path: string) => path.startsWith('/'));

  try {
    const revalidatePaths = correctPaths.map((path: string) =>
      res.revalidate(path, { unstable_onlyGenerated: false })
    );

    await Promise.all(revalidatePaths);

    // Logging for debugging purposes only
    console.log(
      `${new Date().toJSON()} - Paths revalidated: ${correctPaths.join(', ')}`
    );

    return res.json({
      revalidated: true,
      message: `Paths revalidated: ${correctPaths.join(', ')}`,
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
}
