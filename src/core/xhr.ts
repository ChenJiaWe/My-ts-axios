import { AxiosRequestConfig, AxiosResponse, AxiosPromise } from "../types";
import { parseHeaders } from "../helpers/headers";
import { createError } from "../helpers/error";
import { isURLSameOrigin } from "../helpers/url";
import cookie from "../helpers/cookie";
import { isFormData } from "../helpers/utils";


export function xhr(config: AxiosRequestConfig): AxiosPromise {
    return new Promise((resolve, reject) => {
        const { data = null, url,
            method, headers = {},
            responseType, timeout,
            cancelToken, withCredentials, xsrfCookieName,
            xsrfHeaderName, onDownloadProgress,
            onUploadProgress, auth
            , validateStatus } = config;
        const request = new XMLHttpRequest();

        request.open(method!.toUpperCase(), url!, true);

        processConfig()

        addEvent()

        processHeaders()

        processCancel()

        request.send(data);

        function handleRespnse(response: AxiosResponse) {
            if (!response.status || validateStatus!(response.status)) {
                resolve(response);
            } else {
                reject(createError(`Request failed with status code ${response.status}`,
                    config, null, request, response));
            }
        }
        function processConfig() {
            if (responseType) {
                request.responseType = responseType;
            }
            if (timeout) {
                request.timeout = timeout;
            }
            if (withCredentials) {
                request.withCredentials = withCredentials;
            }

        }
        function addEvent() {
            request.onreadystatechange = function handleLoad() {
                if (request.readyState !== 4) {
                    return;
                }
                if (request.status === 0) {
                    return
                }
                const responseData = responseType && responseType !== "text" ? request.response : request.responseText;
                const responseHeaders = parseHeaders(request.getAllResponseHeaders());
                const response: AxiosResponse = {
                    status: request.status,
                    statusText: request.statusText,
                    data: responseData,
                    headers: responseHeaders,
                    config,
                    request
                }
                handleRespnse(response);
            }

            request.onerror = function handleError() {
                reject(createError("Network Error", config, null, request));
            }
            request.ontimeout = function handleTimeout() {
                reject(createError(`Timeout of ${timeout} ms exceeded`, config, "Stop", request))
            }
            if (onDownloadProgress) {
                request.onprogress = onDownloadProgress;
            }
            if (onUploadProgress) {
                request.upload.onprogress = onUploadProgress
            }
        }
        function processHeaders() {
            if (isFormData(data)) {
                delete headers["Content-Type"];
            }
            if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
                const xsrfVal = cookie.read(xsrfCookieName);
                if (xsrfVal && xsrfHeaderName) {
                    console.log(xsrfHeaderName);
                    headers[xsrfHeaderName] = xsrfVal;
                }
            }
            if (auth) {
                headers["Authorization"] = "Basic " + btoa(auth.username + ":" + auth.password);
            }
            Object.keys(headers).forEach(name => {
                if (data === null && name.toLowerCase() === "content-type") {
                    delete headers[name];
                } else {
                    request.setRequestHeader(name, headers[name]);
                }
            })
        }
        function processCancel() {
            if (cancelToken) {
                cancelToken.promise.then(reason => {
                    request.abort();
                    reject(reason);
                }).catch(
                    /* istanbul ignore next */
                    () => {
                    // do nothing
                })
            }
        }
    })


}