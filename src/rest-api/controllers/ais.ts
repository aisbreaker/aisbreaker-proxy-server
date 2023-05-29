import * as express from 'express'
import {writeJsonResponse} from '../../utils/expressHelper.js'
import { RequestArgs } from '../models/req.js'
import { ProxyServiceAPI } from '../services/aisService.js'
import logger from '../../utils/logger.js'
 
export async function sendMessageViaProxy(req: express.Request, res: express.Response): Promise<void> {
    try {
        logger.debug(`sendMessageViaProxy() - started`)
        const json = req.body
        logger.debug(`sendMessageViaProxy() - json=${JSON.stringify(json)}`)

        const requestArgs: RequestArgs = json

        // get/create requested service
        const service = new ProxyServiceAPI(requestArgs.props)

        // call requested service
        const response = await service.sendMessage(requestArgs.request)

        writeJsonResponse(res, 200, response)
    } catch (err) {
        logger.error(`sendMessageViaProxy() - error: ${err}`, err)
        writeJsonResponse(res, 500, {error: {type: 'server_error', message: `Server Error (sendMessageViaProxy): ${err}`}})
    }
}
