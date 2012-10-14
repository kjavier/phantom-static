var system = require('system');

if (system.args.length <= 1) {
  console.log("Usage: url output_file [json_arg]");
  phantom.exit();
} else {

  var page = require('webpage').create();
  var page_address = system.args[1];
  var output_file = system.args[2];
  var options = {};
  if (system.args[3]) {
    options = JSON.parse(system.args[3]);
  }

  if (options.paperSize === undefined)
    options.paperSize = { format: 'A4', orientation: 'portrait', border: '1cm' }

  // push options in
  Object.keys(options).forEach(function(key, index) {
    page[key] = options[key];
  });

  page.open(page_address, function () {
    console.log("Saving " + page_address + " to " + output_file);
    page.render(output_file);
    phantom.exit();
  });
}
