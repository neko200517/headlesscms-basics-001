import { NextRequest, NextResponse } from 'next/server';

type RequestData = {
  firstName: string;
  email: string;
  message: string;
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as RequestData;

  if (!body.firstName || !body.email || !body.message) {
    return NextResponse.json(
      { message: 'first name, email, and message fields are required!' },
      { status: 400 }
    );
  }

  return NextResponse.json({ message: 'form submitted successfully' });
}

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<ResponseData>
// ) {
//   const body = req.body as RequestData;

//   if (!body.firstName || !body.email || !body.message) {
//     return res
//       .status(400)
//       .json({ data: 'first name, email, and message fields are required!' });
//   }

//   return res.status(200).json({ data: 'form submitted successfully' });
// }
