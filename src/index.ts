import { Application } from 'express'
import { expressApp } from './app'
import config from './config'
import logger from './utils/logger'

// eslint-disable-next-line @typescript-eslint/no-floating-promises
;(async function startServer(): Promise<void> {
    try {
        // Starting the server
        const httpServer = expressApp()

        // Connect to the database (if necessary)

        // Listen to the server
        const appAddress = await listenServer(httpServer)
        logger.info(`Server is running on ${appAddress.address}:${appAddress.port}`)
    } catch (error) {
        logger.error(`APPLICATION_ERROR`, { meta: error })
        process.exit(1)
    }
})()

/* listen to the server */
function listenServer(expressApp: Application): Promise<{ address: string; port: number }> {
    const serverPort = config.PORT || 3000 // Default to 3000 if config doesn't provide PORT

    return new Promise((resolve, reject) => {
        const connection = expressApp.listen(serverPort, () => {
            const serverAddress = connection.address()

            if (typeof serverAddress === 'string' || serverAddress === null) {
                reject(new Error('Invalid server address'))
            } else {
                resolve({ address: serverAddress.address, port: serverAddress.port })
            }
        })

        // Handle any potential errors with the connection
        connection.on('error', (err) => {
            reject(err)
        })
    })
}
