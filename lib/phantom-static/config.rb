module PhantomStatic
  class Config

    attr_accessor :location
    attr_accessor :temp_directory

    def initialize(args = {})
      self.temp_directory = "/tmp/phantom-static"
      args.each do |key, value|
        symbol = :"#{key}="
        self.send(symbol, value) if self.respond_to?(symbol)
      end
    end

  end
end