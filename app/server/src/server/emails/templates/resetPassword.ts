import Config from '../../config';
import { ResetPasswordToken } from 'shared';

export default function resetPasswordTemplate(
    token: ResetPasswordToken,
    recipientName: string,
) {
    return `
        <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #444;">Hi ${recipientName},</h2>
                <p>
                    We received a request to reset the password for your <strong>iArsenic</strong> account.
                </p>
                <p>
                    You can reset your password by clicking the link below:
                </p>
                <p>
                    <a href="${Config.baseUrl}/reset-password/${token.id}"
                       style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                        Reset Password
                    </a>
                </p>
                <p>
                    If you did not request a password reset, please ignore this email or contact support if you have concerns.
                </p>
            </body>
        </html>
    `;
}
