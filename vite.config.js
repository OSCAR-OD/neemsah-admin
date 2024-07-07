import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true
  },
  define: {
    // 'process.env': process.env,
    // 'process.env.VITE_REACT_APP_API_URL': process.env.VITE_REACT_APP_API_URL,
  }
  // preview: {
  //   port: 8080,
  // },
});
