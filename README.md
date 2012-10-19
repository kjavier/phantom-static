# Phantom Static

A library for obtaining static items from PhantomJS, such as images or a PDF document.

```ruby

# use default options
file = PhantomStatic.as_file "http://google.com"

string = PhantomStatic.as_str "http://google.com" do |o|
  o.output = :pdf
end
```

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

## Default settings

Default settings can be provided so that all calls to PhantomStatic inherit these options.

```ruby

PhantomStatic.config.set_defaults do |settings|

  settings.A3
  settings.landscape
  settings.output = :pdf

end
```

set_defaults yields on a new or existing PhantomStatic::Builder object, which exposes the following methods

* output=(extension)
 * Can be :jpg, :png, :gif or :pdf
* A3()
 * Output must equal :pdf
* A4()
 * Output must equal :pdf
* A5()
 * Output must equal :pdf
* legal()
 * Output must equal :pdf
* letter()
 * Output must equal :pdf
* tabloid()
 * Output must equal :pdf
* border=(val)
 * Output must equal :pdf
* landscape()
 * Output must equal :pdf
* portrait()
 * Output must equal :pdf
* width=(val), height=(val)
 * To be used if you don't wish to use PhantomJS' paper size presets
 * Output must equal :pdf

# Running

Two methods will return the data from a PhantomJS render, PhantomStatic.as_file and as_str. As file will provide a Tempfile object, and as_str will provide a string of the read() IO file.

Both take in the address of the page and a optional PhantomStatic::Builder block.

```ruby

# use default options
file = PhantomStatic.as_file "http://google.com"

file2 = PhantomStatic.as_file "http://google.com" do |c|
  c.output = :pdf
  c.A3
  c.landscape
end
```

# Credit

* http://stackoverflow.com/a/5471032/497646: Easy way to use the environment path to locate an executable.