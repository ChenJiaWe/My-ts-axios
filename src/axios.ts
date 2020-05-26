import { AxiosInstance, AxiosRequestConfig, AxiosStaic } from "./types";
import  Axios  from "./core/Axios";
import { extend } from "./helpers/utils";
import defaults from "./defaults";
import Cancel, { isCancel } from "./cancel/Cancel";
import { CancelToken } from "./cancel/CancelToken";
import { mergeConfig } from "./core/mergeConfig";

function createInstance(config: AxiosRequestConfig): AxiosStaic {
    const context = new Axios(config);
    const instance = Axios.prototype.request.bind(context);
    extend(instance, context);
    return instance as AxiosStaic;
}
let axios = createInstance(defaults);
axios.create = function create(config: AxiosRequestConfig): AxiosInstance {
    return createInstance(mergeConfig(defaults, config));
}
axios.isCancel = isCancel

axios.CancelToken = CancelToken

axios.Cancel = Cancel

axios.all = function all(params) {
    return Promise.all(params)
}


axios.spread = function (callback) {
    return function (arr) {
        return callback.apply(null, arr);
    }
}

export default axios;
