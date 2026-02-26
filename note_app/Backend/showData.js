import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL || MONGO_URL.includes("<username>")) {
    console.error("Error: Valid MONGO_URL not found in .env file.");
    process.exit(1);
}

const noteSchema = new mongoose.Schema({
    title: String,
    content: String
}, { timestamps: true });

const Note = mongoose.model("Note", noteSchema);

async function showData() {
    try {
        console.log("Connecting to MongoDB Atlas...");
        await mongoose.connect(MONGO_URL);
        console.log("Connected successfully.\n");

        const notes = await Note.find({});

        if (notes.length === 0) {
            console.log("No notes found in the database.");
        } else {
            console.log(`Found ${notes.length} notes:`);
            console.table(notes.map(n => ({
                ID: n._id.toString(),
                Title: n.title,
                Content: n.content,
                CreatedAt: n.createdAt
            })));
        }
    } catch (error) {
        console.error("Error fetching data:", error.message);
    } finally {
        await mongoose.disconnect();
        console.log("\nDisconnected from MongoDB.");
    }
}

showData();
