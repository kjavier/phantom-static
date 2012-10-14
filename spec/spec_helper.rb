require 'rubygems'
require 'bundler'

Bundler.setup(:default)

require 'phantom-static'

RSpec.configure do |config|
  config.mock_framework = :rspec
end