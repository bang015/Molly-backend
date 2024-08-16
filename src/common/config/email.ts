const nodemailer = require('nodemailer');
import config from './index';
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: config.emailAuth,
});
