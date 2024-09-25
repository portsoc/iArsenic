import Config from '../../config'
import { VerifyEmailToken } from 'shared'

export default function verifyEmailTemplate(
    token: VerifyEmailToken,
    recipientName: string,
) {
    return `
        Hi ${recipientName},
        ${Config.baseUrl}/verify-email/token=${token.id}
    `
}