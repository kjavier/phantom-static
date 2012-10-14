# Phantom Static

A library for obtaining static items from PhantomJS, such as images or a PDF document.

# Requirements

* PhantomJS binary
* Ruby
* An internet connection

# Configuration

PhantomStatic supports a configuration block (useful for initializers) which accepts the following arguments

* location: The location to the PhantomJS bin.

```ruby

PhantomStatic.configure do |config|

  config.location = "/my/own/special/bin/phantomjs"

end
```

If no location is specified, the location will automatically be determined from PATH.