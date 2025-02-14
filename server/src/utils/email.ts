import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

type EmailOptions = {
  email: string;
  subject: string;
  html: string;
};

const sendEmail = async (options: EmailOptions) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    form: `"PhotoFlow" Share Your Imagination`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
