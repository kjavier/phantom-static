require File.dirname(__FILE__) + '/spec_helper'

describe PhantomStatic do
  
  describe "as standard" do

    it "should be able to locate the JS bridge" do
      File.exists?(PhantomStatic.bridge_path).should == true
    end

    it "should be able to locate PhantomJS" do
      PhantomStatic.locate_executable.should_not == nil
    end

    it "should be able to perform a basic call to the bridge" do
      tmp_file = "/tmp/phantom-static_spec#{Time.now.to_i}.jpg"
      PhantomStatic.bridge_invoke "http://www.google.com", tmp_file

      File.exists?(tmp_file).should == true
      File.unlink(tmp_file)
    end

    it "should raise an exception if a invalid webpage is specified" do
      tmp_file = "/tmp/phantom-static_spec#{Time.now.to_i}.jpg"
      lambda { PhantomStatic.bridge_invoke("", tmp_file)}.should raise_error
    end

    it "should raise an exception if a invalid output is specified" do
      tmp_file = "/tmp/phantom-static_spec#{Time.now.to_i}.jpg"
      lambda { PhantomStatic.bridge_invoke("http://google.com", "")}.should raise_error
    end
  end

end