import config from '../config';
import nodemailer from 'nodemailer';
import { z } from 'zod';

const MailConfigSchema = z.object({
    from: z.string(),
    host: z.string(),
    port: z.number(),
    auth: z.object({
        user: z.string(),
        pass: z.string(),
    })
});

const mailConfig = MailConfigSchema.parse({
    from: config.emailFrom,
    host: config.emailHost,
    port: Number(config.emailPort),
    auth: {
        user: config.emailUser,
        pass: config.emailPassword,
    },
});

export default async function sendMail(
    to: string,
    subject: string,
    body: string,
    bcc?: string[]
) {
    const transporter = nodemailer.createTransport(mailConfig);

    const mailOptions = {
        from: config.emailFrom,
        to,
        subject,
        html: body,
        bcc: bcc ? bcc.join(',') : undefined,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email Sent Successfully');
        return
    } catch (error) {
        console.error('Error sending mail:', error);
        throw error;
    }
}
