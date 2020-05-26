import { AxiosRequestConfig } from "./types";
import { processHeaders } from "./helpers/headers";
import { transformRequest, transformResponse } from "./helpers/data";


const defaults: AxiosRequestConfig = {
    method: "get",

    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    validateStatus(status: number): boolean {
        return status >= 200 && status < 300;
    },
    transformRequest: [function (data: any, headers: any) {
        processHeaders(headers, data);
        return transformRequest(data);
    }],
    transformResponse: [function (data: any) {
        return transformResponse(data);
    }],
    headers: {
        common: {
            Accept: "application/json, text/plain, */*"
        }
    }
}


const methodNoData = ["head", "get", "options", "delete"];
methodNoData.forEach(method => {
    defaults.headers[method] = {}
})

const methodWithData = ["post", "put", "patch"];

methodWithData.forEach(method => {
    defaults.headers[method] = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
})


export default defaults;