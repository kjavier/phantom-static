require File.dirname(__FILE__) + '/spec_helper'

describe PhantomStatic do
  
  describe "when provided default settings" do

    it "should honour those default settings" do
      PhantomStatic.config.set_defaults do |d|
        d.output = :jpg
      end

      file = PhantomStatic.as_file "http://google.com"

      File.extname(file).should == ".jpg"

      file2 = PhantomStatic.as_file "http://google.com" do |op|

      end

      File.extname(file2).should == ".jpg"
    end

    it "should be overrided in run block" do
      PhantomStatic.config.set_defaults do |d|
        d.output = :jpg
      end

      file = PhantomStatic.as_file "http://google.com" do |op|
        op.output = :pdf
      end

      File.extname(file).should == ".pdf"
    end

    after(:each) do
      PhantomStatic.config = PhantomStatic::Config.new
    end
  end

end