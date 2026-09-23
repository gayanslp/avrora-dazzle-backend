import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
    return await resend.emails.send({
        from: 'Avrora Dazzle <noreply@pnforders.me>',
        to,
        subject,
        html,
    });

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export default sendEmail;