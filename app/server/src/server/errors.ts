import { KnownErrorArgs } from 'shared'

export class KnownError extends Error {
    code: number
    name: string

    constructor({ message, code, name }: KnownErrorArgs) {
        super(message)
        this.name = name
        this.code = code
        this.message = message
    }
}