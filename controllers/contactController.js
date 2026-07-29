const fs = require("fs");
const path = require("path");

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

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          email: process.env.BREVO_SENDER_EMAIL || process.env.GMAIL_USER,
          name: 'Westbridge School',
        },
        replyTo: { email, name },
        to: [{ email: process.env.TO_EMAIL || process.env.GMAIL_USER }],
        subject: `Contact Form: ${subject}`,
        htmlContent: html,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `Brevo API error: ${response.status}`);
    }

    return res.json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to send email.",
    });
  }
};