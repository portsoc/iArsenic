// import { z } from 'zod';

// function validateRequest(schema: z.ZodSchema<any>) {
//   return (req: express.Request, res: express.Response, next: express.NextFunction) => {
//     const result = schema.safeParse(req.body);
//     if (!result.success) {
//       return res.status(400).json(result.error.errors);
//     }
//     req.body = result.data;
//     next();
//   };
// }

// const UserSchema = z.object({
//   id: z.number(),
//   name: z.string(),
//   email: z.string().email(),
// });

// // Usage
// app.post('/user', validateRequest(UserSchema), (req, res) => {
//   const user: User = req.body;  // Now type-checked and validated
//   // Proceed with processing
// });