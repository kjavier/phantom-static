require File.dirname(__FILE__) + '/spec_helper'

describe PhantomStatic::Runner do
  
  describe "when running" do

    it "should dump to png with as_file" do
      file = PhantomStatic::Runner.as_file "http://google.com"

      file.size.should > 0
      File.extname(file.path).should == ".png"
    end

    it "should dump to string of png with as_str" do
      str = PhantomStatic::Runner.as_str "http://google.com"

      str.length.should > 0
    end

    it "should return similar results as a file and string" do
      str = PhantomStatic::Runner.as_str "http://google.com"
      file = PhantomStatic::Runner.as_file "http://google.com"

      data = file.read

      data.should == str
    end
  end

end