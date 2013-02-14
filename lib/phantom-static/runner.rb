module PhantomStatic

  class Runner

    def self.run(webpage, builder_obj)
      file = PhantomStatic.generate_random_file(builder_obj.output)

      path = file.path
      options = builder_obj.bridge_settings

      PhantomStatic.bridge_invoke(webpage, path, options)
      return nil unless File.exists?(file)

      file.open
      file.seek(0)

      file
    end

    def self.as_file(webpage, &block)
      settings = Builder.build(&block)

      self.run(webpage, settings)
    end

    def self.as_str(webpage, &block)
      file = self.as_file(webpage, &block)

      str = file.read

      file.close
      file.unlink

      str
    end
  end

end
