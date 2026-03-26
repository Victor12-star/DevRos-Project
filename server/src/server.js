import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
console.log(`🚀 DevRos API running at http://localhost:${PORT}`);
});