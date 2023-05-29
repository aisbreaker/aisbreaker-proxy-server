import { AIsAPI, AIsBreaker, Request, ResponseFinal, TrivialProxyProps } from "aisbreaker-api"

export class ProxyServiceAPI implements AIsAPI {
    serviceId: string = 'TrivialProxy' /* TODO: TrivialProxyProps -> ProxyProps*/

    props: TrivialProxyProps

    constructor(props: TrivialProxyProps/* TODO: TrivialProxyProps -> ProxyProps*/) {
        this.props = props
    }

    async sendMessage(request: Request): Promise<ResponseFinal> {
        const aisBaseAPI = AIsBreaker.getInstance().createAIsAPI(this.props.forward2RemoteService)

        console.log(`ProxyServiceAPI.sendMessage(name=${this.props.name}) forward to ${aisBaseAPI.serviceId} START`)
        const result = await aisBaseAPI.sendMessage(request)
        console.log(`ProxyServiceAPI.sendMessage(name=${this.props.name}) forward to ${aisBaseAPI.serviceId} END`)

        return result
    }
}
