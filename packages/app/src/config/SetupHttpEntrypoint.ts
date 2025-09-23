import {
    BuildHTTPEntrypoint,
    HTTPContext,
    HTTPEntrypoint,
    HTTPEntrypointHandler,
    HTTPRouteMap
} from 'lakutata/com/entrypoint'
import {Module} from 'lakutata'
import express, {Express, NextFunction, Request, RequestHandler, Response} from 'express'
import {RouteNotFoundException} from '../exceptions/RouteNotFoundException'
import {As} from 'lakutata/helper'
import bodyParser from 'body-parser'
import compression from 'compression'
import {createServer} from 'node:http'

type APIResponse = {
    errno: string | null
    errMsg: string | null
    data: any
}

const expressApp: Express = express()
expressApp.use(compression())
expressApp.use(bodyParser.json({limit: '100mb'}))
expressApp.use(bodyParser.urlencoded({extended: true}))

/**
 * Success handler
 * @param data
 */
function successHandler(data: any): APIResponse {
    return {
        errno: null,
        errMsg: null,
        data: data
    }
}

/**
 * Error Handler
 * @param errMsg
 * @param errno
 */
function errorHandler(errMsg: string, errno?: string): APIResponse {
    return {
        errno: errno ? errno : null,
        errMsg: errMsg,
        data: null
    }
}

/**
 * Setup entrypoints
 * @constructor
 */
export function SetupHttpEntrypoint(port: number): HTTPEntrypoint {
    return BuildHTTPEntrypoint(async (module: Module, routeMap: HTTPRouteMap, handler: HTTPEntrypointHandler): Promise<void> => {
        routeMap.forEach((methods: Set<string>, route: string): void => {
            const authRequestHandler: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
                /**
                 * Authenticate request here
                 **/
                return next()
            }
            methods.forEach((method: string): void => {
                expressApp[method](route, authRequestHandler, (req: Request, res: Response): void => {
                    const params: Record<string, string> = req.params ? req.params : {}
                    const query: Record<string, string> = req.query ? As<Record<string, string>>(req.query) : {}
                    const body: Record<string, any> = req.body ? req.body : {}
                    handler(new HTTPContext({
                        route: route,
                        method: method,
                        request: req,
                        response: res,
                        data: {
                            ...params,
                            ...query,
                            ...body
                        }
                    }))
                        .then((result: any): Response => res.send(successHandler(result)))
                        .catch((err: Error): Response => {
                            res.statusCode = 200
                            const errno: string = err['errno'] ? err['errno'] : 'E_UNKNOWN'
                            return res.send(errorHandler(err.message, errno))
                        })
                })
            })
        })
        expressApp.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
            const errno: string = err['errno'] ? err['errno'] : 'E_UNKNOWN'
            res.statusCode = err['statusCode'] ? err['statusCode'] : 500
            res.send(errorHandler(err.message, errno))
        })
        expressApp.all(/.*/, (req: Request, res: Response): void => {
            res.statusCode = 404
            const routeNotFoundException: RouteNotFoundException = new RouteNotFoundException('Route {route} not found', {route: req.url})
            res.send(errorHandler(routeNotFoundException.message, routeNotFoundException.err))
        })
        createServer({
            keepAlive: true,
            keepAliveTimeout: 60000,
            headersTimeout: 65000
        }, expressApp)
            .listen(port, '0.0.0.0')
    })
}
