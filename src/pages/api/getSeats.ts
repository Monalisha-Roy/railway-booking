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

  const { train_id, station_name } = req.query;

  if (!train_id || !station_name) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Missing 'train_id' or 'station_name' parameter",
      details: "Please provide both 'train_id' and 'station_name' query parameters",
    });
  }

  const trainIdNum = parseInt(train_id as string, 10);

  if (isNaN(trainIdNum)) {
    return res.status(400).json({
      error: "Bad Request",
      message: "train_id must be a valid number",
    });
  }

  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT 
    s.class_type,
    COUNT(*) AS available_seats
FROM seats s
JOIN stations st ON s.station_id = st.station_id
WHERE s.train_id = $1
  AND st.station_name = $2
  AND s.availability = TRUE
GROUP BY s.class_type;

      `,
      [trainIdNum, station_name]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Not Found",
        message: `No available seats found for train_id=${trainIdNum} and station_name=${station_name}`,
      });
    }

    res.status(200).json(
      result.rows.map(row => ({
        classType: row.class_type,
        availableSeats: parseInt(row.available_seats, 10),
      }))
    );
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
