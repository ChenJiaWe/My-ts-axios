
import { AxiosResponse } from "../types";
import { isPlainObject } from "./utils";




export function transformRequest(data: any): string {
    if (isPlainObject(data)) {
        data = JSON.stringify(data);
    }
    return data
}


export function transformResponse(data: any): AxiosResponse {
    if (typeof data === "string") {
        try {
            data = JSON.parse(data);
        } catch (error) {
            // do nothing
        }
    }
    return data
}