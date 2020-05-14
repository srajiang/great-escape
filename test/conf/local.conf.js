exports.config = {
  user: "sarahjiang1",
  key: "s5yXSauqiUo8xAD2zz2F",
  server: "hub-cloud.browserstack.com",

  capabilities: [
    {
      browserName: "chrome",
      name: "local_test",
      build: "cucumber-js-browserstack",
      "browserstack.local": true,
    },
  ],
};
