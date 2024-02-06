#!/usr/bin/env node
"use strict";

// @TODO - turn into cli tool to run any exported function in the system.

// module.exports.init = function () {
//   console.log('hi');
// };

// node -e 'require("./db").init()'

// could this also be something defined in npm scripts?

// apiRunner 'src/users/usersDAL' getUserById sdadfjka-asdfajsd-asdfads-asd <...>
// ^              ^                   ^                    ^
// |              |                   |                    |
// |__the file containing the function that will take the following arguments
//                |                   |                    |
//                |                   |                    |
//                |__the path to the file with the function that apiRunner will run
//                                    |                    |
//                                    |____________________|
// 	                        		|
// 	                        		|__the function, and the list of arguments

// 1.  get arg from command line
// 2.  throw an error if first argument isn't a path to a file with js functions exported.
// 3.  throw an error if the second argument isn't a function available at the path from argument one.
// 4.  execute the line require("${first_arg}").${second_arg}(${...args})

import path, { join } from "path";

const args = process.argv;
const argApiPath = join(__dirname, args[2]);
const argApiFunction = args[3];

const apiPath = require(argApiPath);
const apiFunction = apiPath[argApiFunction];
const apiFunctionArgs = args.filter(function (arg) {
  switch (typeof arg === "string" && args.indexOf(arg)) {
    case -1:
    case 0:
    case 1:
    case 2:
    case 3:
      return false;
    default:
      return true;
  }
});

// throw error if the 1st arg isn't a valid module
if (!apiPath)
  throw new Error(`APIRUNNER ERROR: module ${apiPath} doesn't exist.`);

// throw error if the module dones't have: function module[2nd argument]
if (typeof apiPath[apiFunction] === undefined)
  throw new Error(`APIRUNNER ERROR: function ${apiFunction} doesn't exist`);

runApiFunction();

//**************************************/
async function runApiFunction() {
  try {
    const results = await apiFunction(...apiFunctionArgs);
    console.log(
      `API RUNNER: results from ${path}.${apiFunction} with args: [${[
        ...apiFunctionArgs,
      ]}]`
    );
    console.log(JSON.stringify(results, null, 2));
    return results;
  } catch (err) {
    console.error("APIRUNNER ERROR:");
    throw new Error(err);
  }
}
