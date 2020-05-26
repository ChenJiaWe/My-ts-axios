import Cancel  from "./Cancel";
import { CancelExecutor, Canceler, CancelTokenSource } from "../types";

interface ResolvePromise {
    (res?: Cancel): void
}


export class CancelToken {
    promise: Promise<Cancel>
    reason?: Cancel
    constructor(executor: CancelExecutor) {
        let resolvePromise: ResolvePromise;
        this.promise = new Promise<Cancel>(resolve => {
            resolvePromise = resolve
        })
        executor(c => {
            if (this.reason) {
                return
            }
            this.reason = new Cancel(c);
            resolvePromise(this.reason);
        })
    }
    //判断是否调用了CancelToken
    throwIfRequested(): void {
        if (this.reason) {
            throw this.reason;
        }
    }
    static source(): CancelTokenSource {
        let cancel!: Canceler
        let token = new CancelToken(c => {
            cancel = c;
        })
        return {
            token,
            cancel
        }
    }
}