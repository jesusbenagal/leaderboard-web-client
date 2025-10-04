import type { Config } from "tailwindcss";
import lineClamp from "@tailwindcss/line-clamp";

export default {
  content: ["index.html", "src/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: [lineClamp],
} satisfies Config;
