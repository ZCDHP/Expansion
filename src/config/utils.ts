export type Service = {
    host: string,
    port: number
}

export const HttpUrl = (service: Service) => `http://${service.host}:${service.port}`;

