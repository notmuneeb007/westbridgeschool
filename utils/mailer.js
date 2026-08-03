const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function sendMail({ to, subject, html }) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error('GMAIL_USER and GMAIL_APP_PASSWORD are required.');
  }

  return transporter.sendMail({
    from: `Westbridge School <${process.env.GMAIL_USER}>`,
    to,
    replyTo: process.env.TO_EMAIL || process.env.GMAIL_USER,
    subject,
    html,
  });
}

module.exports = { sendMail };
