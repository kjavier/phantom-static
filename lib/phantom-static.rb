require 'phantom-static/config'
require 'phantom-static/builder'
require 'phantom-static/runner'

require 'json'
require 'open3'
require 'tempfile'

require 'active_support/all'

module PhantomStatic

  def self.config
    @config ||= Config.new
    @config
  end

  def self.config=(val)
    @config = val
  end

  def self.configure(&block)
    @config ||= Config.new
    yield @config
  end

  def self.executable_location
    config.location || locate_executable
  end

  def self.locate_executable
    # props to mislav @ http://stackoverflow.com/a/5471032/497646
    exts = ENV['PATHEXT'] ? ENV['PATHEXT'].split(';') : ['']
    ENV['PATH'].split(File::PATH_SEPARATOR).each do |path|
      exts.each { |ext|
        exe = "#{path}#{File::SEPARATOR}phantomjs#{ext}"
        return exe if File.executable? exe
      }
    end
    return nil
  end

  def self.js_support_path
    File.expand_path File.join(File.dirname(__FILE__), "phantom-static", "support")
  end

  def self.bridge_path
    File.expand_path File.join(js_support_path, "bridge.js")
  end

  def self.bridge_invoke(webpage, output, options = {})
    bin = executable_location
    raise "No valid PhantomJS executable available" if (executable_location.nil? || executable_location.empty?)
    raise "A webpage must be specified" if (webpage.nil? || webpage.empty?)
    raise "A output must be specified" if (output.nil? || output.empty?)
    switches = '--ssl-protocol=any --ignore-ssl-errors=true '

    args = [bin, switches, bridge_path, webpage, output, options.to_json]

    Open3.popen3(*args) do |stdin, stdout, stderr, thread|
      Rails.logger.debug stdout.read()
      Rails.logger.debug stderr.read()
    end

  end

  def self.generate_random_file(format = :png)
    Tempfile.new(["file",".#{format.to_s}"])
  end

  def self.as_file(webpage, &block)
    Runner.as_file(webpage, &block)
  end

  def self.as_str(webpage, &block)
    Runner.as_str(webpage, &block)
  end
end
