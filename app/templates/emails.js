const { email } = require('../../config').common;

exports.welcomeEmail = user => ({
  from: email.fromAddress,
  to: user.email,
  subject: 'Welcome to the most amazing api in the wo... lox!',
  text: `Welcome, ${user.firstName}!`,
  html: `<b>Welcome, ${user.firstName}!</b>`
});
