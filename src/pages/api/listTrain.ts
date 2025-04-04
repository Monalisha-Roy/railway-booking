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
            `SELECT 
                t.train_id, 
                t.train_name, 
                COALESCE((
                    SELECT arrival_time 
                    FROM train_routes 
                    WHERE train_id = t.train_id 
                    ORDER BY stop_number DESC LIMIT 1
                ), '00:00:00') AS arrival_time,  
                COALESCE((
                    SELECT departure_time 
                    FROM train_routes 
                    WHERE train_id = t.train_id 
                    ORDER BY stop_number ASC LIMIT 1
                ), '00:00:00') AS departure_time,
                s1.station_name AS start_station_name, 
                s2.station_name AS end_station_name, 
                t.days_of_operation, 
                t.base_price
            FROM trains t
            JOIN stations s1 ON t.start_station_id = s1.station_id
            JOIN stations s2 ON t.end_station_id = s2.station_id;
            `
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
