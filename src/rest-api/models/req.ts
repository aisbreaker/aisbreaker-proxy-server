import { Request, TrivialProxyProps } from 'aisbreaker-api'

/**
* Send a message to the AI service and get the response.
*/
export type RequestArgs = {
    /**
     * The proxy context
     */
    props: TrivialProxyProps   // TODO: TrivialProxyProps -> ProxyProps

    /**
     * the actual request
     */
    request: Request
}
