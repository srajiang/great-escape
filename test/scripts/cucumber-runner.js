#!/usr/bin/env node
console.log('CUCUMBER RUNNER ACTIVE')
var os = require("os");
var child_process = require("child_process");
var config_file =
  "../conf/" + (process.env.CONFIG_FILE || "parallel") + ".conf.js";
var config = require(config_file).config;
var command = "/usr/bin/env";


console.log('os', os);
console.log('config file path', config_file)

process.argv[0] = "node";
// process.argv[1] = "./node_modules/cucumber/bin/cucumber.js";
process.argv[1] = "node_modules/cucumber/bin/cucumber.js";
// process.argv[1] = "/Users/sarahjiang/.jenkins/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/NodeJS/lib/node_modules/cucumber/bin/cucumber.js";

// Check if os is windows
if (os.platform() == "win32") {
  command = process.argv.shift();
}

for (var i in config.capabilities) {
  console.log("PROCESS", config.capabilities[i].browserName);
  var env = Object.create(process.env);
  env.TASK_ID = i.toString();
  var p = child_process.spawn(command, process.argv, { env: env });
  p.stdout.pipe(process.stdout);
}