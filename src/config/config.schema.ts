import { z } from 'zod'

export const ValidConfigurationSchema = z
    .object({
        ENV: z.enum(['development', 'staging', 'production']).default('development'),
        PORT: z.coerce.number().describe('port value is missing')
    })
    .passthrough() // allows unknown keys to pass through without validation errors
