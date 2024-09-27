import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import imp from "vite-plugin-imp";

export default defineConfig({
  plugins: [
    react(),
    imp({
      libList: [
        {
          libName: "antd",
          style: (name) => `antd/es/${name}/style`,
        },
      ],
    }),
  ],
  server: {
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
});
