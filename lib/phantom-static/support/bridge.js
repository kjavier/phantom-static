var system = require('system');


if (system.args.length <= 1) {
  console.log("Usage: url output_file [json_arg]");
  phantom.exit();
} else {

  var page = require('webpage').create();
  var page_address = system.args[1];
  var output_file = system.args[2];
  var options = {};

  console.log(system.args[3]);
  if (system.args[3]) {
    options = JSON.parse(system.args[3]);
  }

  // Load options.
  if (options.paperSize === undefined)
    options.paperSize = { format: 'A4', orientation: 'portrait', border: '1cm' }

  if (options.custom_data === undefined) { 
    options.custom_data = {};
  }

  // Object merge function http://stackoverflow.com/a/383245
  var merge = function(obj1, obj2) {
    for (var p in obj2) {
      try {
        // Property in destination object set; update its value.
        if ( obj2[p].constructor==Object ) {
          obj1[p] = merge(obj1[p], obj2[p]);
        } else {
          obj1[p] = obj2[p];
        }
      } catch(e) {
        // Property in destination
        // object not set; create it
        //  and set its value.
        obj1[p] = obj2[p];
      }
    }
    return obj1;
  }

  // Custom data defaults to ensure 
  // structure.
  var custom_data_defaults = {
    footer: { 
      title_left: "",
      title_center: "",
      title_right: "",
      pageNum: 0,
      numPages: 0
    },
    header: {
      title_left: "",
      title_center: "",
      title_right: "",
      pageNum: 0,
      numPages: 0
    }
  }

  // Clone json object (ignores functions etc)
  var custom_data = JSON.parse(JSON.stringify(custom_data_defaults));


  // push options in
  Object.keys(options).forEach(function(key, index) {
    page[key] = options[key];
  });


  // Merge in any new settings.
  page.custom_data = merge(custom_data, options.custom_data);

  // Load third party libraries / helpers
  var Util = require('./helpers');
  var Templates = require('./templates');
  var Mustache = require('./mustache');


  // Route "console.log()" calls from within the Page context to the main Phantom context (i.e.
  // current "this")
  page.onConsoleMessage = function(msg) {
    console.log(msg);
  };

  page.onAlert = function(msg) {
    console.log(msg);
  };

  page.paperSize = {
    format: 'A4',
    margin: "1cm",
    /* default header/footer for pages that don't have custom
     * overwrites (see below) */
    header: {
      height: "1cm",
      contents: phantom.callback(function(pageNum, numPages) {
        if (pageNum == 1) {
          return "";
        }

        console.log("Drawing Header");
        // Update custom_data atttributes
        page.custom_data.header.pageNum = (pageNum - 1);
        page.custom_data.header.numPages = (numPages - 1);

        return Mustache.render(Templates.header(), page);
      })
    },
    footer: {
      height: "1cm",
      contents: phantom.callback(function(pageNum, numPages) {
        if (pageNum == 1) {
          return "";
        }

        console.log("Drawing Footer");
        // Update custom_data atttributes
        page.custom_data.footer.pageNum = (pageNum - 1);
        page.custom_data.footer.numPages = (numPages - 1);

        return Mustache.render(Templates.footer(), page);
      })
    }
  };

  page.paperSize = merge(page.paperSize, options.paperSize);

  console.log("Paper Size:");
  Util.inspect(page.paperSize);
  console.log("Custom Data:");
  Util.inspect(page.custom_data);


  page.open(page_address, function () {
    console.log("Saving " + page_address + " to " + output_file);
    if (page.evaluate(function(){return typeof PhantomJSPrinting == "object";})) {

      // Inject thirdparty libraries

      paperSize = page.paperSize;
      paperSize.header.height = page.evaluate(function() {
        return PhantomJSPrinting.header.height;
      });
      paperSize.header.contents = phantom.callback(function(pageNum, numPages) {
        return page.evaluate(function(pageNum, numPages){return PhantomJSPrinting.header.contents(pageNum, numPages);}, pageNum, numPages);
      });
      paperSize.footer.height = page.evaluate(function() {
        return PhantomJSPrinting.footer.height;
      });
      paperSize.footer.contents = phantom.callback(function(pageNum, numPages) {
        return page.evaluate(function(pageNum, numPages){return PhantomJSPrinting.footer.contents(pageNum, numPages);}, pageNum, numPages);
      });
      page.paperSize = paperSize;
    }

    page.render(output_file);
    phantom.exit();
  });
}
