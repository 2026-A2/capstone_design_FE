module.exports = {
  apps: [
    {
      name: "cd-ai",
      cwd: "./CD_AI",
      script: "index.js",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
