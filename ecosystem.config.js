module.exports = {
  apps: [
    {
      name: "import-excel-vpdkdd",
      script: "npm",
      args: "start",
      cwd: "./production",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3002,
      },
    },
  ],
};
