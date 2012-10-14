module PhantomStatic
  class Config

    attr_accessor :location

    def initialize(args = {})
      args.each do |key, value|
        symbol = :"#{key}="
        self.send(symbol, value) if self.respond_to?(symbol)
      end
    end

  end
end