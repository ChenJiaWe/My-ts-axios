import { isPlainObject, deepMerge } from "./utils";
import { METHOD } from "../types";


function normalizeHeadersName(headers: any, normalizeName: string): any {
    if (!headers) {
        return;
    }
    Object.keys(headers).forEach(name => {
        if (name !== normalizeName && name.toUpperCase() === normalizeName.toUpperCase()) {
            headers[normalizeName] = headers[name];
            delete headers[name];
        }
    })
}


export function processHeaders(headers: any, data: any, ): any {
    normalizeHeadersName(headers, "Content-Type");
    if (isPlainObject(data)) {
        if (headers && !headers["Content-Type"]) {
            headers["Content-Type"] = "application/json;charset=utf-8";
        }
    }
    return headers;
}


export function parseHeaders(headers: string) {
    let result = Object.create(null);
    if (!headers) {
        return result;
    }
    headers.split("\r\n").forEach(line => {
        let [key, ...vals] = line.split(":");
        if (!key) {
            return;
        }
        key = key.trim().toLowerCase();
        const val = vals.join(':').trim()
        result[key] = val
    })
    return result;
}


export function flattenHeaders(headers: any, method: METHOD): any {
    if (!headers) {
        return headers;
    }
    if (typeof headers.common === "undefined") {
        headers.common = {}
    }
    headers = deepMerge(headers.common, headers[method], headers);
    const methodToDelete = ["head", "get", "options",
        "delete", "post", "put", "patch", "common"];

    methodToDelete.forEach(method => {
        delete headers[method];
    })
    return headers
}