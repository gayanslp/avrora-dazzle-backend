import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
    const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
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