import type { NextApiRequest, NextApiResponse } from 'next'
import type { ImagesData, GenericError } from '../../interfaces';
import sql from 'mysql';
import DaoPortfolioImages from '../../dao/images';
import DaoTags from '../../dao/tags';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ImagesData | GenericError>
) {

  if (req.method !== 'GET') {
    return res.status(410).json({message: 'Invalid Method'});
  }

  const connSQL = sql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
  });

  try {
    const daoPortfolioImages = new DaoPortfolioImages(connSQL);
    const daoTags = new DaoTags(connSQL);

    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const rawFilter = req.query.filter as string;

    if (isNaN(page) || isNaN(limit)) {
      return res.status(400).json({
        message: 'Missing page or limit query params',
      });
    }

    const filters = (rawFilter && rawFilter.split(',')) || null;

    const {images, totalCount} = await daoPortfolioImages.getAllByTags(
      page,
      limit,
      filters,
    );
    const tags = await daoTags.getAll();

    return res.status(200).json({
      images,
      totalCount,
      tags: tags,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Something went wrong' })
  } finally {
    connSQL.destroy();
  }
};
