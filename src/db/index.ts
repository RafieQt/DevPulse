import {Pool} from "pg";

const pool = new Pool({
    connectionString: process.env.NEON_STRING
})