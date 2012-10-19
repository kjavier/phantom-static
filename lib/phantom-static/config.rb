module PhantomStatic
  class Config

    attr_accessor :location
    attr_accessor :default_config

    def initialize(args = {})
      self.default_config = Builder.new
      args.each do |key, value|
        symbol = :"#{key}="
        self.send(symbol, value) if self.respond_to?(symbol)
      end
    end

    def set_defaults(&block)
      base = self.default_config || Builder.new

      yield base
    end
  end
end