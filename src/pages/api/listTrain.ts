import { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
    ssl: {
        rejectUnauthorized: false,
    },
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const client = await pool.connect();

    try {
        const result = await client.query(
            `SELECT train_id, train_name, arrival_time, duration, price FROM trains`
        );
        console.log("Query Result:", result.rows);

        // Send response back
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Database query error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        client.release();
    }
}
