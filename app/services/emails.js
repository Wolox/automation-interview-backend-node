const nodemailer = require('nodemailer');
const { welcomeEmail } = require('../templates/emails');
const { emailSendError } = require('../errors');
const logger = require('../logger');
const { email } = require('../../config').common;

exports.sendWelcomeEmail = user => {
  const transporter = nodemailer.createTransport({ ...email });
  return transporter
    .sendMail(welcomeEmail(user))
    .then(() => logger.info(`email sent to ${user.email}`))
    .catch(error => {
      logger.error(error);
      logger.error(emailSendError('Unable to send user email'));
    });
};
