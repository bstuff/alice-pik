/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ['**/.*'],
  server: './app/server.ts',
  serverBuildPath: 'functions/[[path]].js',
  serverConditions: ['workerd', 'worker', 'browser'],
  serverDependenciesToBundle: 'all',
  serverMainFields: ['browser', 'module', 'main'],
  serverMinify: true,
  serverModuleFormat: 'esm',
  serverPlatform: 'neutral',
  browserNodeBuiltinsPolyfill: {
    modules: {
      events: true,
    },
  },
  serverNodeBuiltinsPolyfill: {
    modules: {
      fs: 'empty',
      child_process: 'empty',
      http: 'node:http',
      https: 'node:https',
      net: 'node:net',
      os: 'node:os',
      querystring: 'node:querystring',
      tls: 'node:tls',
      url: 'node:url',

      assert: false,
      async_hooks: false,
      buffer: false,
      crypto: false,
      diagnostics_channel: false,
      events: false,
      path: false,
      process: false,
      stream: false,
      'stream/promises': false,
      'stream/consumers': false,
      string_decoder: false,
      util: false,
      // jws: "empty",
      // util: 'node:util',
    },
    globals: {
      process: true,
      Buffer: true,
    },
  },
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
};
