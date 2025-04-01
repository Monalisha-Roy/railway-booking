import { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
    ssl: {
        rejectUnauthorized: false,
    }
});

interface RequestBody {
    user_id: string;
    name: string;
    email: string;
    phone_number: string;
    password: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        const {
            user_id,
            name,
            email,
            phone_number,
            password,
        }: RequestBody = req.body;

        if (!user_id || !name || !email || !phone_number || !password ) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const client = await pool.connect();

        try {
            await client.query(
                `
                INSERT INTO users(user_id, name, email, phone_number, password)
                VALUES($1, $2, $3, $4, $5)
                `,
                [user_id, name, email, phone_number, password]
            );

            res.status(201).json({ message: "User inserted successfully." });
        } catch (error) {
            console.error("Error inserting user:", error);
            res.status(500).json({ error: "Internal Server Error" });
        } finally {
            client.release();
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}