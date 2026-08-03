const User = require('../models/User');
const Otp = require('../models/Otp');
const { sendMail } = require('../utils/mailer');

function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function sendOTPEmail(email, otp, name) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"/></head>
    <body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:#f4f7fa;">
      <div style="max-width:480px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.08);">
        <div style="background:linear-gradient(135deg,#1a3a6b,#0d5e3a);padding:32px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:1.5rem;">Westbridge School</h1>
          <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:0.9rem;">Email Verification</p>
        </div>
        <div style="padding:32px;text-align:center;">
          <p style="color:#333;font-size:1rem;margin-bottom:8px;">Hello <strong>${name}</strong>,</p>
          <p style="color:#666;font-size:0.95rem;margin-bottom:24px;">Your 6-digit verification code is:</p>
          <div style="background:#f0f7ff;border:2px dashed #1a3a6b;border-radius:12px;padding:20px;margin:0 auto 24px;display:inline-block;">
            <span style="font-size:2.5rem;font-weight:800;letter-spacing:12px;color:#1a3a6b;font-family:monospace;">${otp}</span>
          </div>
          <p style="color:#999;font-size:0.82rem;margin-top:16px;">This code expires in 10 minutes.</p>
          <p style="color:#999;font-size:0.82rem;">If you didn't create an account, please ignore this email.</p>
        </div>
        <div style="background:#f9fafb;padding:16px;text-align:center;border-top:1px solid #eee;">
          <p style="color:#aaa;font-size:0.75rem;margin:0;">Westbridge Junior &amp; Upper School &copy; 2025</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendMail({
    to: email,
    subject: 'Your Verification Code - Westbridge School',
    html: htmlContent,
  });
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: password,
      avatar: avatar || null,
      verified: false,
    });

    const otp = generateOTP();
    await Otp.create({ email: email.toLowerCase(), otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });

    try {
      await sendOTPEmail(email, otp, name);
    } catch (e) {
      console.error('Failed to send OTP email:', e.message);
    }

    return res.json({
      success: true,
      message: 'Registration successful! Please check your email for the verification code.',
      email: email.toLowerCase(),
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
    }

    const record = await Otp.findOne({
      email: email.toLowerCase(),
      otp,
      expiresAt: { $gt: new Date() },
    });

    if (!record) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification code.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found.' });
    }

    user.verified = true;
    await user.save();

    await Otp.deleteOne({ _id: record._id });

    return res.json({
      success: true,
      message: 'Email verified successfully!',
      user: { name: user.name, email: user.email, avatar: user.avatar },
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.verified) {
      const otp = generateOTP();
      await Otp.create({ email: email.toLowerCase(), otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });

      try {
        await sendOTPEmail(email, otp, user.name);
      } catch (e) {
        console.error('Failed to send OTP email:', e.message);
      }

      return res.json({
        success: false,
        needsVerification: true,
        message: 'Please verify your email first. A new code has been sent.',
        email: email.toLowerCase(),
      });
    }

    return res.json({
      success: true,
      message: 'Login successful!',
      user: { name: user.name, email: user.email, avatar: user.avatar },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found.' });
    }

    if (user.verified) {
      return res.json({ success: true, message: 'Email is already verified.' });
    }

    const recentOtp = await Otp.findOne({ email: email.toLowerCase() }).sort({ createdAt: -1 });
    if (recentOtp) {
      const otpCreatedAt = recentOtp.expiresAt.getTime() - 10 * 60 * 1000;
      if (Date.now() - otpCreatedAt < 60000) {
        return res.status(429).json({ success: false, message: 'Please wait 60 seconds before requesting a new code.' });
      }
    }

    const otp = generateOTP();
    await Otp.create({ email: email.toLowerCase(), otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });

    try {
      await sendOTPEmail(email, otp, user.name);
    } catch (e) {
      console.error('Failed to send OTP email:', e.message);
    }

    return res.json({ success: true, message: 'Verification code sent! Check your email.' });
  } catch (err) {
    console.error('Resend OTP error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.updateAvatar = async (req, res) => {
  try {
    const { email, avatar } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found.' });
    }

    user.avatar = avatar || null;
    await user.save();

    return res.json({
      success: true,
      message: 'Avatar updated!',
      user: { name: user.name, email: user.email, avatar: user.avatar },
    });
  } catch (err) {
    console.error('Update avatar error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};
