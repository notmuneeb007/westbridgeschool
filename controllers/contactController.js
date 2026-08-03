const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const htmlTemplate = fs.readFileSync(
  path.join(__dirname, "..", "templates", "contactEmail.html"),
  "utf8"
);

function brevoRequest(payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const options = {
      hostname: 'api.brevo.com',
      port: 443,
      path: '/v3/smtp/email',
      method: 'POST',
      timeout: 10000,
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
        'content-length': Buffer.byteLength(data),
      },
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, body: JSON.parse(body) });
        } catch {
          resolve({ ok: false, status: res.statusCode, body: { message: body } });
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Brevo API timeout')); });
    req.write(data);
    req.end();
  });
}

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

    const result = await brevoRequest({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL || process.env.GMAIL_USER,
        name: 'Westbridge School',
      },
      replyTo: { email, name },
      to: [{ email: process.env.TO_EMAIL || process.env.GMAIL_USER }],
      subject: `Contact Form: ${subject}`,
      htmlContent: html,
    });

    if (!result.ok) {
      console.error('Brevo error:', result.body);
      return res.status(500).json({ success: false, message: result.body.message || `API error: ${result.status}` });
    }

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