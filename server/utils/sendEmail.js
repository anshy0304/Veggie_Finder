import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  try {
    // Check if email configuration exists
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      // If email is not configured, log to console for development
      console.log('\n========================================');
      console.log('📧 EMAIL NOT CONFIGURED - LOGGING TO CONSOLE');
      console.log('========================================');
      console.log('To:', options.email);
      console.log('Subject:', options.subject);
      console.log('Message:', options.message);
      console.log('========================================\n');
      return; // Don't try to send email
    }

    // 1. Create a transporter using your environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 2. Define the email options
    const mailOptions = {
      from: `VeggieFinder <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    // 3. Send the email
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${options.email}`);
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    // Log the OTP to console as fallback
    console.log('\n========================================');
    console.log('📧 EMAIL FAILED - LOGGING TO CONSOLE');
    console.log('========================================');
    console.log('To:', options.email);
    console.log('Subject:', options.subject);
    console.log('Message:', options.message);
    console.log('========================================\n');
  }
};

export default sendEmail;
