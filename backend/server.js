// This is the entry point for the backend server
import dotenv from 'dotenv';
dotenv.config(
    { path: './.env' }
);

import app from "./src/app.js"; // ✅ Updated path

const PORT = process.env.PORT||3000 ; 

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
