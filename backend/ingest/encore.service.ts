import { Service } from "encore.dev/service";
import { CorsPolicy } from "encore.dev/config";

const cors = new CorsPolicy({
  allow_origins: ["https://dispute-defense-engine-ui.vercel.app", "http://localhost:5173", "http://localhost:3000"],
  allow_methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allow_headers: ["Content-Type", "Authorization"],
  expose_headers: ["Content-Type"],
  max_age: 3600,
});

export default new Service("ingest", { cors });
