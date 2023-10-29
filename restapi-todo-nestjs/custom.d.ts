import { User as CustomUser } from '@prisma/client';

// declare global {
//   namespace Express {
//     export interface Request {
//       user: CustomUser;
//     }
//   }
// }

declare module 'express-serve-static-core' {
  interface Request {
    user?: Omit<User, 'hashedPassword'>;
  }
}
