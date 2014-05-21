module PhantomStatic
  class Builder

    attr_accessor :format
    attr_accessor :orientation

    attr_accessor :view_port_height
    attr_accessor :view_port_width

    attr_accessor :zoom_factor

    attr_accessor :border

    attr_accessor :output

    def self.build(&block)
      base = PhantomStatic.config.default_config || self.new

      begin
        yield base
      rescue
      end

      base
    end

    def initialize()
      self.output = :png
    end

    # Settings for formatish paper size

    def A3
      self.format = "A3"
      self
    end

    def A4
      self.format = "A4"
      self
    end

    def A5
      self.format = "A5"
      self
    end

    def legal
      self.format = "Legal"
      self
    end

    def letter
      self.format = "Letter"
      self
    end

    def tabloid
      self.format = "Tabloid"
      self
    end

    def landscape
      self.A3
      self.orientation = "landscape"
      self
    end

    def portrait
      self.A4
      self.orientation = "portrait"
      self
    end

    # Settings for manual paper size

    def width
      @width ||= nil
      @width
    end

    def height
      @height ||= nil
      @height
    end

    def width=(val)
      self.format = nil
      @width = val
    end

    def height=(val)
      self.format = nil
      @height = val
    end

    def custom_data=(val)
      @custom_data = val
    end

    def custom_data
      @custom_data ||= nil
      @custom_data
    end

    #

    # Query points used by Runner

    def paper_size_options
      if format.present?
        {
          :format => self.format,
          :orientation => self.orientation || "portrait",
          :border => self.border || "1cm"
        }
      elsif self.width.present? && self.height.present?
        {
          :width => self.width,
          :height => self.height,
          :border => self.border || "1cm"
        }
      else
        nil
      end
    end

    def view_port_options
      if self.view_port_width.present? && self.view_port_height.present?
        {
          :width => self.view_port_width,
          :height => self.view_port_height
        }
      else
        nil
      end
    end

    def bridge_settings
      paper_size = self.paper_size_options
      view_port = self.view_port_options

      opts = {}
      opts[:"paperSize"] = paper_size unless paper_size.nil?
      opts[:"viewportSize"] = view_port unless view_port.nil?
      opts[:"zoomFactor"] = self.zoom_factor unless self.zoom_factor.nil?
      opts[:"custom_data"] = self.custom_data unless self.custom_data.nil?
      opts[:"ignoreSslErrors"] = true

      opts
    end


  end
end
