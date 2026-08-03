const fs = require("fs");
const path = require("path");
const { sendMail } = require("../utils/mailer");

const htmlTemplate = fs.readFileSync(
  path.join(__dirname, "..", "templates", "contactEmail.html"),
  "utf8"
);

exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const html = htmlTemplate
      .replace(/\{\{NAME\}\}/g, name)
      .replace(/\{\{EMAIL\}\}/g, email)
      .replace(/\{\{SUBJECT\}\}/g, subject)
      .replace(/\{\{MESSAGE\}\}/g, message);

    await sendMail({
      to: process.env.TO_EMAIL || process.env.GMAIL_USER,
      subject: `Contact Form: ${subject}`,
      html: html,
    });

    return res.json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (err) {
    console.error('Contact email error:', err.message);
    return res.status(500).json({
      success: false,
      message: `Failed to send email: ${err.message}`,
    });
  }
};