import { ResolveFn, RejectedFn } from "../types";


export interface Interceptor<T> {
    resolve: ResolveFn<T>
    rejected?: RejectedFn
}

//拦截器管理
export class InterceptorManager<T> {
    private interceptors: Array<Interceptor<T> | null>

    constructor() {
        this.interceptors = [];
    }

    use(resolve: ResolveFn<T>, rejected: RejectedFn): number {
        this.interceptors.push({
            resolve,
            rejected
        });
        return this.interceptors.length - 1;
    }

    forEach(fn: (interceptor: Interceptor<T>) => void): void {
        this.interceptors.forEach(interceptor => {
            if (interceptor !== null) {
                fn(interceptor);
            }
        })
    }

    eject(id: number): void {
        if (this.interceptors[id]) {
            this.interceptors[id] = null;
        }
    }
}