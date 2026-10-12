import type { Types } from 'mongoose'

declare global {
    namespace Express {
        interface Request {
            // Set by authenticate before protected controllers run.
            userId?: Types.ObjectId
        }
    }
}
