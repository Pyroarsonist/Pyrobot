module.exports = {
  apps: [
    {
      name: 'pyrobot',
      script: 'dist/index.js',

      autorestart: true,
      max_memory_restart: '1G',

      merge_logs: true,
      combine_logs: true,
      kill_timeout: 5000,

      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
