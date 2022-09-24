import type { NextApiRequest, NextApiResponse } from 'next';
import type { GenericError } from 'interfaces';
import aws from 'aws-sdk';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<undefined | GenericError>,
) {
  if (req.method !== 'POST') {
    return res.status(410).json({message: 'Invalid Method'});
  }

  try {
    const {FromName, FromEmail, MessageBody, ReCaptchaToken} = req.body;
    if (!FromName || !FromEmail || !MessageBody) {
      return res.status(400).json({message: 'Missing Body Parameter(s)'});
    }

    let recaptchaIsValid = false;
    try {
      const recaptchaResponse = await axios({
        method: 'POST',
        url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${ReCaptchaToken}`
      });

      if (recaptchaResponse.data?.success) {
        recaptchaIsValid = true;
      }
    } catch (err) {
      console.log('recaptcha req error:', err);
    }

    if (!ReCaptchaToken || !recaptchaIsValid) {
      return res.status(401).json({message: 'Unable To Validate Recaptcha'});
    }

    const rawTemplate = fs.readFileSync(
      path.resolve('./templates', 'contact.handlebars'),
      'utf-8',
    );
    const html = Handlebars.compile(rawTemplate)({
      FromName,
      FromEmail,
      MessageBody,
    });

    const sesClient = new aws.SES({
      region: 'eu-west-1',
      accessKeyId: process.env.AWSAccessKeyId,
      secretAccessKey: process.env.AWSSecretKey,
    });

    try {
      await sesClient.sendEmail({
        Destination: {
          ToAddresses: ['reuben.luke.p@gmail.com', 'azulilah.art@gmail.com'],
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
            Data: `Message From ${FromName} via Azulilah Website!`
          },
        },
        Source: 'azulilah.art@gmail.com',
      }).promise();
    } catch (err) {
      console.log('SES error', err);
      return res.status(500).json({message: 'Failed to send email'});
    }

    return res.status(204).send(undefined);
  } catch (err) {
    console.log(err);
    return res.status(500).json({message: 'Unknown Server Error'});
  }
}
