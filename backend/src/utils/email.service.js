import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendReminderEmail = async (to, companyName) => {
  const mailOptions = {
    from: '"Job Tracker AI" <noreply@jobtracker.com>',
    to,
    subject: `Follow-up Reminder: ${companyName}`,
    text: `Hi! It's been 7 days since you applied to ${companyName}. Would you like to send a follow-up email to check your status?`,
  };

  await transporter.sendMail(mailOptions);
};