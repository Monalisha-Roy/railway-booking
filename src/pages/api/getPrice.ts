import { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method Not Allowed",
      message: "Only GET requests are allowed",
    });
  }

  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Missing 'from' or 'to' parameter",
      details: "Please provide both 'from' and 'to' query parameters",
    });
  }

  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT DISTINCT 
          t.train_id, 
          t.train_name, 
          s1.station_name AS from_station,
          s2.station_name AS to_station,
          tr1.departure_time,
          tr2.arrival_time,
          t.base_price,
          ROUND(t.base_price * (tr2.price_factor - tr1.price_factor), 2) AS final_price
       FROM trains t
       JOIN train_routes tr1 ON t.train_id = tr1.train_id
       JOIN train_routes tr2 ON t.train_id = tr2.train_id
       JOIN stations s1 ON tr1.station_id = s1.station_id
       JOIN stations s2 ON tr2.station_id = s2.station_id
       WHERE s1.station_name = $1  
         AND s2.station_name = $2  
         AND tr1.stop_number < tr2.stop_number  
       ORDER BY tr1.departure_time;`,
      [from, to]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Not Found",
        message: `No trains found between ${from} and ${to}`,
        details: "Ensure the station names are correct and available in the database",
      });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Database query error:", error);

    return res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while querying the database",
      details: (error as Error).message || "Unexpected error in SQL execution",
    });
  } finally {
    client.release();
  }
}
