import { RATE_LIMIT_WINDOW } from "../lib/constant";
import { IRateLimitData } from "../lib/interface";

const rateLimiter: { [ip: string]: IRateLimitData } = {};

export const checkRateLimit = (requestData: IRateLimitData): boolean => {
    const { ip, date } = requestData
    const now = Date.now()
    
    if (!rateLimiter[ip]) {
        rateLimiter[ip] = requestData;
        return false
    }
    
    const timeDiff = now - rateLimiter[ip].date
    if (timeDiff >= RATE_LIMIT_WINDOW) {
        rateLimiter[ip] = requestData
        return false
    } else {
        return true
    }
};