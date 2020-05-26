import { AxiosRequestConfig } from "../types";
import { isPlainObject, deepMerge } from "../helpers/utils";

function defaultStrat(val1: any, val2: any): any {
    return typeof val2 !== "undefined" ? val2 : val1;
}

function StratFromVal2(val1: any, val2: any): any {
    if (typeof val2 !== "undefined") {
        return val2;
    }
}

function deepMergeConfig(val1: any, val2: any): any {
    if (isPlainObject(val2)) {
        return deepMerge(val1, val2);
    } else if (typeof val2 !== "undefined") {
        return val2;
    } else if (isPlainObject(val1)) {
        return deepMerge(val1);
    } else {
        return val1;
    }
}
const strats = Object.create(null);

const StartKeyFromval2 = ["url", "params", "data"];
StartKeyFromval2.forEach(key => {
    strats[key] = StratFromVal2;
})
const StartKeydeepMerge = ["headers", "auth"];
StartKeydeepMerge.forEach(key => {
    strats[key] = deepMergeConfig;
})




export function mergeConfig(config1: AxiosRequestConfig, config2?: AxiosRequestConfig) {
    let config = Object.create(null);
    if (!config2) {
        config2 = {}
    }
    for (const key in config2) {
        mergeField(key);
    }

    for (const key in config1) {
        if (!config2[key]) {
            mergeField(key);
        }
    }


    function mergeField(key: string): void {
        const strat = strats[key] || defaultStrat;
        config[key] = strat(config1[key], config2![key]);
    }
    return config
}