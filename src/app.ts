import express, { Application } from 'express'

export function expressApp() {
    const app: Application = express()
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    return app
}
