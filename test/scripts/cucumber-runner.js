#!/usr/bin/env node
var os = require("os");
var child_process = require("child_process");
var config_file =
  "../conf/" + (process.env.CONFIG_FILE || "parallel") + ".conf.js";
var config = require(config_file).config;
var command = "/usr/bin/env";

process.argv[1] = "./node_modules/cucumber/bin/cucumber.js"; 

for (var i in config.capabilities) {  
  var env = Object.create(process.env);
  env.TASK_ID = i.toString();

  var p = child_process.spawn(command, process.argv, { env: env });
  
  p.stdout.pipe(process.stdout);
}