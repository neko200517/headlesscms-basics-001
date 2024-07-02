import type { NextApiRequest, NextApiResponse } from 'next';

type RequestData = {
  firstName: string;
  email: string;
  message: string;
};

type ResponseData = {
  data: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const body = req.body as RequestData;

  if (!body.firstName || !body.email || !body.message) {
    return res
      .status(400)
      .json({ data: 'first name, email, and message fields are required!' });
  }

  return res.status(200).json({ data: 'form submitted successfully' });
}
