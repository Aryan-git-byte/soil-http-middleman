import express from "express";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(express.json());

// Load Supabase credentials
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Root route (for testing)
app.get("/", (req, res) => {
  res.send("🌱 Soil HTTP Middleman is live!");
});

// Main upload endpoint
app.post("/upload", async (req, res) => {
  try {
    const data = req.body;
    console.log("Received data:", data);

    // Insert into Supabase table
    const { error } = await supabase
      .from("soil_data")
      .insert([data]);

    if (error) {
      console.error("❌ Supabase insert failed:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log("✅ Data inserted into Supabase");
    res.json({ success: true });
  } catch (err) {
    console.error("⚠️ Server error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Start server on Render’s port
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
