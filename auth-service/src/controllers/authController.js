const User = require('../models/users');
const jwt = require('jsonwebtoken');
const { hashPassword } = require('../utils/hashPassword');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');


// Register function
const register = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, email, password, address, role } = req.body;

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = new User({
      firstName,
      lastName,
      phoneNumber,
      email,
      password: hashedPassword,
      address,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Login function
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return user details and token (excluding password)
    const { _id, firstName, lastName, phoneNumber, address, role } = user;

    res.status(200).json({
      message: 'Login successful',
      user: {
        _id,
        firstName,
        lastName,
        phoneNumber,
        email,
        address,
        role,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Forgot Password function
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Save hashed token and expiration in the database
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes
    await user.save();

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

    // Send email with the reset link
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <p>You have requested a password reset. Please click on the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 10 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Reset link sent to email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const decodedToken = decodeURIComponent(req.params.token);
    const hashedToken = crypto.createHash('sha256').update(decodedToken).digest('hex');

    // GET Request - Show Form
    if (req.method === 'GET') {
      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).send(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Password Reset Error</title>
            <style>
              /* Reuse CSS from success message */
              body { 
                min-height: 100vh; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                padding: 20px;
              }
              .error-container {
                background: white;
                padding: 2.5rem;
                border-radius: 15px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                max-width: 400px;
                text-align: center;
              }
              .error-icon {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background: #e53e3e;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 1.5rem;
                color: white;
                font-size: 2.5rem;
              }
              h2 { color: #2c3e50; margin-bottom: 1rem; }
              p { color: #4a5568; margin-bottom: 2rem; }
              .retry-link {
                display: inline-block;
                padding: 1rem 2rem;
                background: #4299e1;
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
              }
            </style>
          </head>
          <body>
            <div class="error-container">
              <div class="error-icon">✕</div>
              <h2>Invalid Reset Link</h2>
              <p>This password reset link is either invalid or has expired.</p>
              <a href="/api/auth/forgot-password" class="retry-link">Get New Reset Link</a>
            </div>
          </body>
          </html>
        `);
      }

      return res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Password - Hospital Management</title>
          <style>
            body {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
              padding: 20px;
              margin: 0;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            .reset-card {
              background: white;
              padding: 2rem;
              border-radius: 12px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              width: 100%;
              max-width: 400px;
            }
            h1 {
              color: #2c3e50;
              margin-bottom: 1.5rem;
              text-align: center;
            }
            .password-form {
              display: flex;
              flex-direction: column;
              gap: 1.5rem;
            }
            input {
              padding: 1rem;
              border: 2px solid #e2e8f0;
              border-radius: 8px;
              font-size: 1rem;
              transition: border-color 0.3s ease;
            }
            input:focus {
              outline: none;
              border-color: #4299e1;
              box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
            }
            button {
              padding: 1rem;
              background: #4299e1;
              color: white;
              border: none;
              border-radius: 8px;
              font-size: 1rem;
              font-weight: 600;
              cursor: pointer;
              transition: background 0.3s ease;
            }
            button:hover {
              background: #3182ce;
            }
          </style>
        </head>
        <body>
          <div class="reset-card">
            <h1>Create New Password</h1>
            <form class="password-form" method="POST">
              <input 
                type="password" 
                name="newPassword" 
                placeholder="Enter new password"
                required
                minlength="8"
              >
              <button type="submit">Reset Password</button>
            </form>
          </div>
        </body>
        </html>
      `);
    }

    // POST Request - Process Password
    if (req.method === 'POST') {
      const { newPassword } = req.body;
      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).send(`
          <div class="error-container">
            <div class="error-icon">✕</div>
            <h2>Reset Failed</h2>
            <p>The password reset link has expired. Please request a new one.</p>
            <a href="/api/auth/forgot-password" class="retry-link">Get New Link</a>
          </div>
        `);
      }

      user.password = await hashPassword(newPassword);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Password Reset Success</title>
          <style>
            body {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
              padding: 20px;
              margin: 0;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            .success-card {
              background: white;
              padding: 2.5rem;
              border-radius: 12px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              text-align: center;
              max-width: 400px;
            }
            .checkmark {
              width: 80px;
              height: 80px;
              background: #38a169;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 1.5rem;
              color: white;
              font-size: 2.5rem;
            }
            h2 {
              color: #2c3e50;
              margin-bottom: 1rem;
            }
            p {
              color: #4a5568;
              margin-bottom: 2rem;
            }
            .login-link {
              display: inline-block;
              padding: 1rem 2rem;
              background: #4299e1;
              color: white;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              transition: background 0.3s ease;
            }
            .login-link:hover {
              background: #3182ce;
            }
          </style>
        </head>
        <body>
          <div class="success-card">
            <div class="checkmark">✓</div>
            <h2>Password Updated!</h2>
            <p>Your password has been successfully reset.</p>
            <a href="#" class="login-link">OK</a>
          </div>
        </body>
        </html>
      `);
    }
  } catch (err) {
    console.error('Reset Password Error:', err);
    res.status(500).send(`
      <div class="error-container">
        <div class="error-icon">!</div>
        <h2>Server Error</h2>
        <p>We encountered an unexpected error. Please try again later.</p>
        <a href="/" class="retry-link">Return Home</a>
      </div>
    `);
  }
};

module.exports = { register, login, forgotPassword, resetPassword };