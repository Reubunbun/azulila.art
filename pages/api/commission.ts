import type { NextApiRequest, NextApiResponse } from 'next';
import type {
  CommissionData,
  GenericError,
  CommissionType,
  CommissionPost,
} from 'interfaces';
import aws from 'aws-sdk';
import sql from 'mysql';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import DaoCommissionSpaces from 'dao/commissions';
import DaoCommissionBaseType from 'dao/CommissionBaseType';
import DaoCommissionBackgroundType from 'dao/CommissionBackgroundType';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<void | CommissionData | GenericError>,
) {

  if (req.method === 'GET') {
    const connSQL = sql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT),
    });

    try {
      const daoCommissionSpaces = new DaoCommissionSpaces(connSQL);
      const daoCommissionBaseType = new DaoCommissionBaseType(connSQL);
      const daoCommissionBackgroundType = new DaoCommissionBackgroundType(connSQL);

      let numSpaces: number = 0;
      const commissionBaseTypes: CommissionType[] = [];
      const commissionBackgroundTypes: CommissionType[] = [];

      await Promise.all([
        daoCommissionSpaces.getNumSpaces().then(res => numSpaces = res),
        daoCommissionBaseType.getAll().then(res => commissionBaseTypes.push(...res)),
        daoCommissionBackgroundType.getAll().then(res => commissionBackgroundTypes.push(...res)),
      ]);

      return res.status(200).json({
        spaces: numSpaces,
        baseTypes: commissionBaseTypes,
        backgroundTypes: commissionBackgroundTypes,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({message: 'Unknown Server Error'});
    } finally {
      connSQL.destroy();
    }
  }

  if (req.method === 'POST') {
    const {
      totalPrice,
      baseType,
      backgroundType,
      backgroundDescription,
      userName,
      userContactEmail,
      userPaypalEmail,
      characters,
      postPermissionGiven,
      userSocials,
      failedImages,
    }: CommissionPost = req.body;

    const rawTemplate = fs.readFileSync(
      path.resolve('./templates', 'commission.handlebars'),
      'utf-8',
    );
    const html = Handlebars.compile(rawTemplate)({
      BaseTypeName: baseType.display,
      BaseTypeInitCost: baseType.price,
      BaseTypeOffer: baseType.offer,
      BaseTypeActualCost: baseType.actualPrice,

      BackgroundTypeName: backgroundType.display,
      BackgroundTypeInitCost: backgroundType.price,
      BackgroundTypeOffer: backgroundType.offer,
      BackgroundTypeActualCost: backgroundType.actualPrice,
      BackgroundDescription: backgroundDescription,

      ExtraCharacters: characters.length - 1,
      ExtraCharactersCost: ((characters.length - 1) * baseType.actualPrice).toFixed(2),

      CommissionTotalCost: totalPrice,

      ImagesFailed: failedImages,
      Characters: characters.map((character, i) => ({
        CharacterName: i === 0
          ? 'First Character'
          : i === 1
            ? 'Second Character'
            : 'Third Character',
        VisualDescription: character.visualDescription,
        PersonalityDescription: character.personalityDescription,
        Images: character.imageURLs.map(
          fileName => fileName === 'Failed'
            ? ''
            : `https://tam-portfolio-uploads.s3.eu-west-1.amazonaws.com/${fileName}`,
        ),
      })),

      UserName: userName,
      UserEmail: userContactEmail,
      PaypalEmail: userPaypalEmail,
      PermissionGiven: postPermissionGiven,
      UserSocials: userSocials,
    });

    const sesClient = new aws.SES({
      region: 'eu-west-1',
      accessKeyId: process.env.AWSAccessKeyId,
      secretAccessKey: process.env.AWSSecretKey,
    });

    try {
      await sesClient.sendEmail({
        Destination: {
          ToAddresses: ['azulilah.art@gmail.com'],
        },
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: html,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: `New Commission Request via Azulilah Website!`,
          },
        },
        Source: 'azulilah.art@gmail.com',
      }).promise();
    } catch (err) {
      console.log('SES error:', err);
      return res.status(500).json({message: 'Failed to send commission request'});
    }

    return res.status(204).send();
  }

  return res.status(410).json({message: 'Inavlid Method'});
};
