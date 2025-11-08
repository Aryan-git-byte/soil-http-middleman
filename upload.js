import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    // ✅ Parse JSON manually — required for raw Arduino body
    const rawBody = await new Promise((resolve, reject) => {
      let data = "";
      req.on("data", (chunk) => (data += chunk));
      req.on("end", () => resolve(data));
      req.on("error", (err) => reject(err));
    });

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return res.status(400).json({ error: "Invalid JSON" });
    }

    console.log("Incoming data:", body);

    const { error } = await supabase.from("sensor_data").insert([
      {
        latitude: body.latitude,
        longitude: body.longitude,
        soil_moisture: body.soil_moisture,
        ec: body.ec,
        soil_temperature: body.soil_temperature,
        n: body.n,
        p: body.p,
        k: body.k,
        ph: body.ph,
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error.message);
      return res.status(500).json({ error: error.message });
    }

    console.log("✅ Data inserted successfully");
    return res.status(200).json({ message: "Data stored successfully" });
  } catch (err) {
    console.error("Server error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
