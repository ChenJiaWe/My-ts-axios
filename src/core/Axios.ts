import { AxiosRequestConfig, AxiosPromise, METHOD, AxiosResponse, ResolveFn, RejectedFn } from "../types";
import dispatchRequest, { transformURL } from "./dispatchRequest";
import { InterceptorManager } from "./InterceptorManager";
import { mergeConfig } from "./mergeConfig";

interface Interceptors {
    //请求拦截器
    request: InterceptorManager<AxiosRequestConfig>
    //响应拦截器
    response: InterceptorManager<AxiosResponse>
}

interface PromiseChain<T> {
    resolve: ResolveFn<T> | ((conifg: AxiosRequestConfig) => AxiosPromise)

    rejected?: RejectedFn
}


export default class Axios {
    //默认配置
    defaults: AxiosRequestConfig
    interceptors: Interceptors
    constructor(initConfig: AxiosRequestConfig) {
        this.interceptors = {
            //创建请求拦截器实例
            request: new InterceptorManager(),
            //创建响应拦截器实例
            response: new InterceptorManager()
        }
        this.defaults = initConfig;
    }
    request(url: any, config?: any): AxiosPromise {
        //判断第一个参数传入的是配置还是url
        if (typeof url === "string") {
            if (!config) {
                config = {}
            }
            config.url = url
        } else {
            config = url
        }
        //将默认配置与用户设置的配置合并
        config = mergeConfig(this.defaults, config);
        config.method = config.method.toLowerCase();
        //存放多个拦截器的数组
        let chain: PromiseChain<any>[] = [{
            resolve: dispatchRequest,
            rejected: undefined
        }]
        //请求拦截器先放入后调用
        this.interceptors.request.forEach(interceptor => {
            chain.unshift(interceptor);
        })
        //响应拦截器先放入先调用
        this.interceptors.response.forEach(interceptor => {
            chain.push(interceptor);
        })
        let promise = Promise.resolve(config);
        //依次将拦截器中的调用的函数传入到下一个拦截器，直到传入到最后一个中
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
