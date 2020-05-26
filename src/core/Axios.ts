import { AxiosRequestConfig, AxiosPromise, METHOD, AxiosResponse, ResolveFn, RejectedFn } from "../types";
import dispatchRequest, { transformURL } from "./dispatchRequest";
import { InterceptorManager } from "./InterceptorManager";
import { mergeConfig } from "./mergeConfig";

interface Interceptors {
    request: InterceptorManager<AxiosRequestConfig>
    response: InterceptorManager<AxiosResponse>
}

interface PromiseChain<T> {
    resolve: ResolveFn<T> | ((conifg: AxiosRequestConfig) => AxiosPromise)

    rejected?: RejectedFn
}


export default class Axios {
    defaults: AxiosRequestConfig
    interceptors: Interceptors
    constructor(initConfig: AxiosRequestConfig) {
        this.interceptors = {
            request: new InterceptorManager(),
            response: new InterceptorManager()
        }
        this.defaults = initConfig;
    }
    request(url: any, config?: any): AxiosPromise {
        if (typeof url === "string") {
            if (!config) {
                config = {}
            }
            config.url = url
        } else {
            config = url
        }
        config = mergeConfig(this.defaults, config);
        config.method = config.method.toLowerCase();
        let chain: PromiseChain<any>[] = [{
            resolve: dispatchRequest,
            rejected: undefined
        }]
        this.interceptors.request.forEach(interceptor => {
            chain.unshift(interceptor);
        })
        this.interceptors.response.forEach(interceptor => {
            chain.push(interceptor);
        })
        let promise = Promise.resolve(config);

        while (chain.length) {
            const { resolve, rejected } = chain.shift()!;
            promise = promise.then(resolve, rejected)
        }

        return promise;
    }

    getUri(config: AxiosRequestConfig): string {
        config = mergeConfig(this.defaults, config);
        return transformURL(config);
    }

    get(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestWithNoData(url, "get", config);
    }
    options(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestWithNoData(url, "options", config);
    }
    delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestWithNoData(url, "delete", config);
    }
    head(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestWithNoData(url, "head", config);
    }

    post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestWithData(url, "post", data, config);
    }
    put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestWithData(url, "put", data, config);
    }
    patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestWithData(url, "patch", data, config);
    }


    _requestWithNoData(url: string, method: METHOD, config?: AxiosRequestConfig): AxiosPromise {
        return this.request(Object.assign(config || {}, {
            url,
            method
        }))
    }

    _requestWithData(url: string, method: METHOD, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this.request(Object.assign(config || {}, {
            url,
            method,
            data
        }))
    }
}
