import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Avrora Dazzle <noreply@pnforders.me>',
            to,
            subject,
            text: text || '',
            html,
        });

        if (error) {
            console.error("Resend error:", error);
            throw new Error(error.message || 'Failed to send email via Resend');
        }

        console.log("Email dispatched via Resend:", data);
        return data;
    } catch (err) {
        console.error("sendEmail utility error:", err);
        throw err;
    }
};

export default sendEmail;