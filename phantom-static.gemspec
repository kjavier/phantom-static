# encoding: utf-8
lib = File.expand_path('../lib/', __FILE__)
$:.unshift lib unless $:.include?(lib)

Gem::Specification.new do |s|
  s.name        = "phantom-static"
  s.version     = "0.1"
  s.platform    = Gem::Platform::RUBY
  s.authors     = ["Callum Jones"]
  s.email       = ["callum@callumj.com"]
  s.homepage    = "http://callumj.com"
  s.summary     = "Generate static images and PDFs of webpages using Phantom.js"
                  
  s.description = "Generate static images and PDFs of webpages using Phantom.js"
  
  s.required_rubygems_version = ">= 1.3.6"

  s.add_dependency("activesupport")
 
  s.files        = Dir.glob("lib/**/*") +
    %w(README.md Rakefile)
  s.require_path = 'lib'
end
