import { createClient } from "redis"

const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        reconnectStrategy: function (retries) {
            if (retries > 20) {
                console.log(
                    "Too many attempts to reconnect. Redis connection was terminated"
                )
                return new Error("Too many retries.")
            } else {
                return retries * 500
            }
        },
    },
})

client.on("error", (err) => console.log("Redis Client Error", err))
client.on("connect", () =>
    console.log("Redis Client Connected Successfully.....".bold.red)
)

await client.connect()


export default client