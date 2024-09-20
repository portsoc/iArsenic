import { ZodError, ZodSchema } from 'zod';

export default function validateModel(
    model: any,
    schema: ZodSchema<any>,
): { ok: true } | { ok: false, error: ZodError } {
    try {
        schema.parse(model);
        return { ok: true };
    } catch (error) {
        if (error instanceof ZodError) {
            return { ok: false, error: error };
        }

        throw error;
    }
}