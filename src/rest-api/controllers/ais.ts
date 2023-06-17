import * as express from 'express'
import {writeJsonResponse} from '../../utils/expressHelper.js'
//import { ProxyServiceAPI } from '../services/aisService.js'
import logger from '../../utils/logger.js'
import { AIsProps, AIsProxyRequest, DelegateService } from 'aisbreaker-api'
 
export async function task(req: express.Request, res: express.Response): Promise<void> {
    try {
        logger.debug(`task() - started`)

        // get aisProxyRequest
        const json = req.body
        logger.debug(`task() - json=${JSON.stringify(json)}`)
        const aisProxyRequest: AIsProxyRequest = json

        // check and use authentication (bearer header)
        const serviceProps = extractServiceFromRequest(req, aisProxyRequest)

        // get/create requested service
        const service = new DelegateService(serviceProps)

        // call requested service
        const response = await service.sendMessage(req.body.request)

        writeJsonResponse(res, 200, response)
    } catch (err) {
        logger.error(`task() - error: ${err}`, err)
        writeJsonResponse(res, 500, {error: {type: 'server_error', message: `Server Error (sendMessageViaProxy): ${err}`}})
    }
}

function extractServiceFromRequest(req: express.Request, aisProxyRequest: AIsProxyRequest): AIsProps {
    // extract service props
    const service = aisProxyRequest.service
    if (!service) {
        throw new Error(`service missing in request`)
    }

    // extract access token
    const authHeader = req.headers.authorization
    logger.debug("authHeader: "+authHeader) 
    if (!authHeader) {
        throw new Error(`Authorization header missing in request`)
    }
    const bearer = authHeader.split(' ')
    if (bearer.length !== 2) {
        throw new Error(`Authorization header invalid in request`)
    }
    const accessTokenBase64 = bearer[1]
    if (!accessTokenBase64) {
        throw new Error(`Access token missing in request`)
    }
    try {
        // decode base64
        const accessToken = Buffer.from(accessTokenBase64, 'base64').toString('utf-8')

        const accessTokenObj = JSON.parse(accessToken)
        if (!accessTokenObj) {
            throw new Error(`Access token invalid in request`)
        }
        const apiKeys = accessTokenObj.apiKeys
        logger.debug("apiKeys: "+JSON.stringify(apiKeys))


        // copy requires accessKey to service props
        if (service.apiKeyId) {
            service.apiKey = apiKeys[service.apiKeyId]
        }
    } catch (err) {
        logger.warn(`Access token (apiKey) invalid and ignored`, err)
    }

    logger.debug("Requested service: "+JSON.stringify(service)) 
    return service
}
