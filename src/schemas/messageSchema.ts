import { z } from 'zod'


export const messageSchema = z.object({
    context: z.string()
        .min(5, { message: "Context must be a minimum of 5 characters." })
        .max(300, { message: "Context must be a maximum of 300 characters." }),
})