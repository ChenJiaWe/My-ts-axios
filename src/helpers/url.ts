
import {isDate,isPlainObject, isURLSearchParams } from "./utils";


function encode(val: any): string {
    return encodeURIComponent(val).
        replace(/%40/gi, '@').
        replace(/%3A/gi, ':').
        replace(/%24/g, '$').
        replace(/%2C/gi, ',').
        replace(/%20/g, '+').
        replace(/%5B/gi, '[').
        replace(/%5D/gi, ']');
}


export function buildURL(url: string, params?: any, paramsSerializer?: (params: any) => string): string {
    if (!params) {
        return url;
    }
    let serializedParams = "";
    if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
    } else if (isURLSearchParams(params)) {
        serializedParams = params.toString();
    } else {
        const parts: string[] = [];
        Object.keys(params).forEach(key => {
            let vals = [];
            let val = params[key];
            if (!val) {
                return
            }
            if (Array.isArray(val)) {
                vals = val;
                key += "[]";
            } else {
                vals = [val];
            };
            vals.forEach(val => {
                if (isDate(val)) {
                    val = val.toISOString();
                }
                if (isPlainObject(val)) {
                    val = JSON.stringify(val);
                }
                parts.push(`${encode(key)}=${encode(val)}`);
            })
        })
        serializedParams = parts.join("&");
    }

    if (serializedParams) {
        const markIndex = url.indexOf("#");
        if (markIndex !== -1) {
            url = url.slice(0, markIndex);
        }
        url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
    }
    return url;
}


interface ResolveURL {
    protocol: string,
    host: string
}

const urlParsingNode = document.createElement("a");

const currentURL = resolveURL(window.location.href);

function resolveURL(url: string): ResolveURL {
    urlParsingNode.setAttribute("href", url);
    const { protocol, host } = urlParsingNode;
    return {
        protocol,
        host
    }
}

export function isURLSameOrigin(url: string) {
    const parseURL = resolveURL(url);
    return parseURL.protocol === currentURL.protocol
        && parseURL.host === currentURL.host;
}


export function isAbsoluteURL(url: string): boolean {
    // /(^[a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}


export function combineURL(baseurl: string, currenturl: string): string {
    return currenturl ? baseurl.replace(/\/+$/, "") + "/" +
        currenturl.replace(/^\/+/, "") : baseurl;
}