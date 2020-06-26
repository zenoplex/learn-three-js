import { NextApiRequest, NextApiResponse } from 'next';

const api = (_: NextApiRequest, res: NextApiResponse): void => {
  // eslint-disable-next-line functional/immutable-data
  res.statusCode = 200;
  res.json({ name: 'John Doe' });
};

export default api;
