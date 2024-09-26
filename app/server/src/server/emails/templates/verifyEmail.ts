import Config from '../../config'
import { VerifyEmailToken } from 'shared'

export default function verifyEmailTemplate(
    token: VerifyEmailToken,
    recipientName: string,
) {
    return `
        <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #444;">Hi ${recipientName},</h2>
                <p>
                    Welcome to <strong>iArsenic</strong>! Please verify your email address by clicking the link below:
                </p>
                <p>
                    <a href="${Config.baseUrl}/verify-email/${token.id}"
                       style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                        Verify Email Address
                    </a>
                </p>
                <p>
                    If you did not request this, please ignore this email.
                </p>
            </body>
        </html>
    `;
}