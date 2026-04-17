const nodemailer = require('nodemailer');

exports.inviteUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Use Ethereal for testing purposes since we don't have real SMTP credentials.
    // In production, you would use a real SMTP service (ex: Gmail, SendGrid).
    const testAccount = await nodemailer.createTestAccount();
    
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    const signupUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/signup?email=${encodeURIComponent(email)}`;

    const info = await transporter.sendMail({
      from: '"TaskFlow Team" <noreply@taskflow.local>',
      to: email,
      subject: 'You have been invited to TaskFlow!',
      text: `Hello! You've been invited to join the team on TaskFlow. Sign up here: ${signupUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #6366f1;">Welcome to TaskFlow</h2>
          <p>You have been invited to collaborate with your team on TaskFlow, a real-time task management system.</p>
          <div style="margin: 30px 0;">
            <a href="${signupUrl}" style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Accept Invitation
            </a>
          </div>
          <p style="font-size: 12px; color: #888;">If the button above does not work, copy and paste this link into your browser: <br/> ${signupUrl}</p>
        </div>
      `,
    });

    console.log('--- Invitation Sent ---');
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    console.log('-----------------------');

    res.status(200).json({
      success: true,
      message: 'Invitation sent successfully. Check your terminal for the Ethereal link.',
    });
  } catch (error) {
    console.error('Invite Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send invitation.',
    });
  }
};
