export type METHOD = "get" | "GET"
    | "post" | "POST"
    | "put" | "PUT"
    | "delete" | "Delete"
    | "patch" | "PATCH"
    | "options" | "OPTIONS"
    | "head" | "HEAD"

export interface AxiosRequestConfig {
    url?: string;
    method?: METHOD;
    data?: any;
    params?: any;
    headers?: any
    responseType?: XMLHttpRequestResponseType
    timeout?: number
    transformRequest?: AxiosTransformer | AxiosTransformer[]
    transformResponse?: AxiosTransformer | AxiosTransformer[]
    cancelToken?: CancelToken
    withCredentials?: boolean
    xsrfCookieName?: string
    xsrfHeaderName?: string
    onUploadProgress?: (e: ProgressEvent) => void
    onDownloadProgress?: (e: ProgressEvent) => void
    auth?: AxiosAuth
    validateStatus?: (status: number) => boolean
    paramsSerializer?: (params: any) => string
    baseURL?: string
    [propName: string]: any

}

export interface AxiosResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: AxiosRequestConfig;
    request: any
}

export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {

}

export interface AxiosError extends Error {
    isAxiosError: boolean;
    config: AxiosRequestConfig;
    code?: string | null;
    request?: any
    response?: AxiosResponse
}


export interface Axios {
    defaults: AxiosRequestConfig
    interceptors: {
        request: AxiosInterceptorManager<AxiosRequestConfig>
        response: AxiosInterceptorManager<AxiosResponse>
    }
    request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>
    get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
    options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
    delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
    head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
    
    getUri: (config: AxiosRequestConfig) => string
}

export interface AxiosInstance extends Axios {
    <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
    <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosClassStaic {
    new(config: AxiosRequestConfig): Axios
}

export interface AxiosStaic extends AxiosInstance {
    create(config?: AxiosRequestConfig): AxiosInstance

    CancelToken: CancelTokenStaic
    Cancel: CancelStatic
    isCancel: (val: any) => boolean
    all<T>(promise: Array<T | Promise<T>>): Promise<T[]>
    spread<T, R>(callback: (...args: T[]) => R): (arr: T[]) => R
    Axios: AxiosClassStaic
}

export interface AxiosInterceptorManager<T> {
    use(resolve: ResolveFn<T>, rejected?: RejectedFn): number

    eject(id: number): void


}

export interface ResolveFn<T> {
    (val: T): T | Promise<T>
}


export interface RejectedFn {
    (error: any): any
}

export interface AxiosTransformer {
    (data: any, headers?: any): any
}


export interface CancelToken {
    promise: Promise<Cancel>
    reason?: Cancel

    throwIfRequested(): void;
}

export interface Canceler {
    (message?: string): void
}

export interface CancelTokenSource {
    token: CancelToken
    cancel: Canceler
}

export interface Cancel {
    message?: string
}

export interface CancelExecutor {
    (executor: Canceler): void
}


export interface CancelTokenStaic {

    new(executor: CancelExecutor): CancelToken
    source(): CancelTokenSource
}

export interface CancelStatic {
    new(message?: string): void
}

export interface AxiosAuth {
    username: string
    password: string
}