require File.dirname(__FILE__) + '/spec_helper'

describe PhantomStatic::Builder do
  
  describe "as standard" do

    before(:each) do
      @builder = PhantomStatic::Builder.new
    end

    it "should support A4, A3, A5" do

      @builder.A3
      @builder.paper_size_options[:format].should == "A3"

      @builder.A4
      @builder.paper_size_options[:format].should == "A4"

      @builder.A5
      @builder.paper_size_options[:format].should == "A5"

    end

    it "should support Legal, Letter, Tabloid" do

      @builder.legal
      @builder.paper_size_options[:format].should == "Legal"

      @builder.letter
      @builder.paper_size_options[:format].should == "Letter"

      @builder.tabloid
      @builder.paper_size_options[:format].should == "Tabloid"

    end

    it "should support Portrait and Landscape" do

      @builder.portrait
      @builder.paper_size_options[:orientation].should == "portrait"

      @builder.landscape
      @builder.paper_size_options[:orientation].should == "landscape"

    end

    it "should allow manual paper size" do
      @builder.width = "200"
      @builder.height = "300"

      @builder.paper_size_options[:width].should == "200"
      @builder.paper_size_options[:height].should == "300"
    end

    it "should disable paper size format when manual sizes are given" do
      @builder.A3
      @builder.paper_size_options[:format].should == "A3"

      @builder.width = "200"
      @builder.height = "300"

      @builder.paper_size_options[:width].should == "200"
      @builder.paper_size_options[:height].should == "300"
    end
  end

end