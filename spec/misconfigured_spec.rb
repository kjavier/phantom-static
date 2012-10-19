require File.dirname(__FILE__) + '/spec_helper'

describe PhantomStatic do
  
  describe "when misconfigured" do

    before(:each) do
      PhantomStatic.configure do |conf|
        conf.location = "/tmp/donotcare"
      end
    end

    it "should break invoke_bridge" do
      tmp_file = "/tmp/phantom-static_spec#{Time.now.to_i}.jpg"
      lambda { PhantomStatic.bridge_invoke("http://google.com", "")}.should raise_error
    end

    after(:each) do
      PhantomStatic.config = PhantomStatic::Config.new
    end
  end

end