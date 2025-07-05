import ratelimit from "../config/upstash.js"

const rateLimiter = async (req, res, next) => {
    try {
        const key = req.ip; // or req.user.id if auth is used
        const { success } = await ratelimit.limit(key);

        if (!success) {
            return res.status(429).json({
                message: "Too many requests, please try again later"
            })
        }

        next()

    } catch (error) {
        console.log("Rate limit error", error)
        next(error)
    }
};

export default rateLimiter;