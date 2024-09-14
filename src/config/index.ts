import dotenvFlow from 'dotenv-flow'
import { z } from 'zod' //  Zod is used for validation
import { ValidConfigurationSchema } from './config.schema' //  Zod schema is exported
// import Logger from '../utils/logger';
dotenvFlow.config()
// Define the types for your configuration
type ConfigType = z.infer<typeof ValidConfigurationSchema>

/** Load and validate config file */
class Config {
    private static instance: Config
    public config: ConfigType

    // Constructor to initialize and validate the configuration
    private constructor() {
        this.config = this.loadAndValidateConfig()
    }

    // Load and validate the configuration files
    private loadAndValidateConfig(): ConfigType {
        if (!ValidConfigurationSchema) {
            throw new Error('Schema file not found')
        }

        const finalConfig: Record<string, unknown> = {}
        for (const key of Object.keys(ValidConfigurationSchema.shape)) {
            if (process.env[key]) {
                finalConfig[key] = process.env[key] // Prioritize environment variables
            }
        }
        // Validate the configuration with Zod
        const validatedConfig = ValidConfigurationSchema.safeParse(finalConfig)
        if (!validatedConfig.success) {
            const missingProperties = validatedConfig.error?.issues.map((error) => error.path.join('.'))
            throw new Error(`Environment variable Config validation error: missing properties ${missingProperties.join(', ')} in .env file`)
        }

        return validatedConfig.data
    }

    // Singleton instance retrieval method
    public static getInstance(): Config {
        if (!Config.instance) {
            Config.instance = new Config()
        }
        // Logger.info(Config.instance)
        return Config.instance
    }
}

// Export the singleton instance's config
export default Config.getInstance().config
