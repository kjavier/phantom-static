var system = require('system');
var fs = require('fs');
var $ = require('jquery');

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



  function log(msg) {
    //fs.write('phantomjs.log', msg + '\n', 'a');
  }
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

  /**
   *  Wait until the test condition is true or a timeout occurs. Useful for waiting
   *  on a server response or for a ui change (fadeIn, etc.) to occur.
   *
   *  @param testFx javascript condition that evaluates to a boolean,
   *  it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
   *  as a callback function.
   *  @param onReady what to do when testFx condition is fulfilled,
   *  it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
   *  as a callback function.
   *  @param timeOutMillis the max amount of time to wait. If not specified, 3 sec
   *  is used.
   */
  function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, //< Default Max Timout is 3s
      start = new Date().getTime(),
      condition = false,
      interval = setInterval(function() {
        if ((new Date().getTime() - start < maxtimeOutMillis) && !condition) {
          // If not time-out yet and condition not yet fulfilled
          condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
        } else {
          if (!condition) {
            // If condition still not fulfilled (timeout but condition is 'false')
            console.log("'waitFor()' timeout");
            phantom.exit(1);
          } else {
            // Condition fulfilled (timeout and/or condition is 'true')
            console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
            typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
            clearInterval(interval); //< Stop this interval
          }
        }
      }, 250); //< repeat check every 250ms
  }

  msgSink = {};
  msgSink.currentNumEvents = 0;
  msgSink.previousNumEvents = 0;
  msgSink.numNonEventPeriods = 0;
  msgSink.total_resource_requests = 0;
  msgSink.total_resource_received = 0;

  function handleAsyncScripts() {
      var checkFrequency = 500;
      var numNonEventForCompletion = 20;

      var interval = setInterval(function() {
        msgSink.previousNumEvents = msgSink.currentNumEvents;
        msgSink.currentNumEvents = msgSink.total_resource_received;

        // If true add to non event period.
        if((msgSink.currentNumEvents - msgSink.previousNumEvents) <= 0) {
          msgSink.numNonEventPeriods = msgSink.numNonEventPeriods + 1;
        } else {
          // Otherwise reset it.
          msgSink.numNonEventPeriods = 0;
        }

        // If true invoke completion
        if (msgSink.numNonEventPeriods >= numNonEventForCompletion) {
          // Check for elements that have to be rendered ajaxically
          handleAsyncElements();
        }
      }, checkFrequency);
  };

  function handleAsyncElements() {
    waitFor(function() {
      return page.evaluate(function() {
        if ($('.js-LoadingWrap').length) return !$('.js-LoadingWrap').is(":visible");

        return true;
      });
    }, function() {
      console.log("The loading wrapper should be invisible now.");
      console.log("Saving " + msgSink.page_address + " to " + msgSink.output_file);
      page.render(msgSink.output_file);
      phantom.exit();
    });
  }

  function printArgs() {
    var i, ilen;
    for (i = 0, ilen = arguments.length; i < ilen; ++i) {
      console.log("    arguments[" + i + "] = " + JSON.stringify(arguments[i]));
    }
    console.log("");
  }


  page.onInitialized = function() {
        console.log("page.onInitialized");
  };
  page.onLoadStarted = function() {
        console.log("page.onLoadStarted");
  };
  page.onLoadFinished = function() {
        console.log("page.onLoadFinished");
  };

  page.onResourceRequested = function(info) {
    console.log("page.onResourceRequested", info.url);
    msgSink.total_resource_requests = msgSink.total_resource_requests + 1;

  };
  page.onResourceReceived = function(info) {
    console.log("page.onResourceReceived", info.url);
    msgSink.total_resource_received = msgSink.total_resource_received + 1;
  };



  msgSink.page_address = page_address;
  msgSink.output_file = output_file;

  page.open(page_address, function () {
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

    handleAsyncScripts();
  });
}
