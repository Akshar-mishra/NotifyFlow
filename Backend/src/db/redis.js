import Redis from "ioredis";

let redisInstance = null;

const getRedisInstance = () => {
    if (!redisInstance) {
        redisInstance = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null });
        
        redisInstance.on("connect", () => console.log("Redis Connected Successfully!"));
        redisInstance.on("error", (err) => console.error("Redis Connection Error:", err));
    }
    return redisInstance;
};

export { getRedisInstance };