gem 'activesupport', ">= 2.3.2"
require 'active_support'

module ViewHelpers
  # The NavTab Class holds the structure of a navigation tab (including
  # its sub-nav items).
  class NavTab < Array
    attr_reader :name, :proper_name
    
    def initialize(name, proper_name)
      @name, @proper_name = name, proper_name
    end
    
    def [](id)
      unless id.kind_of? Fixnum
        self.find {|subnav_item| subnav_item.name.to_s == id.to_s }
      else
        super
      end
    end
  end
  
  # Simple structure for storing the properties of a tab's sub items.
  class NavSubItem
    attr_reader :name, :proper_name, :url
    
    def initialize(name, proper_name, url = "#")
      @name, @proper_name, @url = name, proper_name, url
    end
  end
  
  def nav_tabs
    content = NavTab.new(:content, "Content")
    content << NavSubItem.new(:pages, "Pages", "/admin/pages/")
    
    design = NavTab.new(:design, "Design")
    design << NavSubItem.new(:layouts, "Layouts", "/admin/layouts/")
    design << NavSubItem.new(:snippets, "Snippets", "/admin/snippets/")
    design << NavSubItem.new(:stylesheets, "Stylesheets", "/admin/stylesheets/")
    design << NavSubItem.new(:javascripts, "Javascripts", "/admin/javascripts/")
    
    assets = NavTab.new(:assets, "Assets")
    assets << NavSubItem.new(:images, "Images", "/admin/images/")
    assets << NavSubItem.new(:files, "Other Files", "/admin/files/")
    
    custom = NavTab.new(:acme, "Acme")
    custom << NavSubItem.new(:acme_intro, "Intro", "/admin/acme/")
    custom << NavSubItem.new(:acme_widgets, "Widgets", "/admin/acme/widgets/")
    custom << NavSubItem.new(:acme_orders, "Orders", "/admin/acme/orders/")
    custom << NavSubItem.new(:acme_shipping, "Shipping", "/admin/acme/shipping/")
    custom << NavSubItem.new(:deprecated, "Deprecated", "/admin/acme/deprecated/")
    
    settings = NavTab.new(:settings, "Settings")
    settings << NavSubItem.new(:general, "General", "/admin/settings/")
    settings << NavSubItem.new(:users, "Users", "/admin/users/")
    settings << NavSubItem.new(:extensions, "Extensions", "/admin/extensions/")
    
    [content, design, assets, custom, settings]
  end
  
  def body_classes
    @body_classes ||= []
  end
  
  def button_to(title, url, html_options={})
    html_options.update(:onclick=>"window.location = '#{url}'")
    content_tag :button, title, html_options
  end
  
  def widget(name, short_description, attributes={})
    fixture(attributes.merge(:name => name, :short_description => short_description), WidgetFixtureMethods)
  end
  
  module WidgetFixtureMethods
  end
  
  module GravatarHelper
    # Returns a Gravatar URL associated with the email parameter.
    # See: http://douglasfshearer.com/blog/gravatar-for-ruby-and-ruby-on-rails
    def gravatar_url(email, options={})
      # Default to highest rating. Rating can be one of G, PG, R X.
      options[:rating] ||= "G"
    
      # Default size of the image.
      options[:size] ||= "32px"
    
      # Default image url to be used when no gravatar is found
      # or when an image exceeds the rating parameter.
      options[:default] ||= "http://localhost:4000/images/admin/avatar_#{([options[:size].to_i] * 2).join('x')}.png"
    
      # Build the Gravatar url.
      url = 'http://www.gravatar.com/avatar.php?'
      url << "gravatar_id=#{Digest::MD5.new.update(email)}" 
      url << "&rating=#{options[:rating]}" if options[:rating]
      url << "&size=#{options[:size]}" if options[:size]
      url << "&default=#{options[:default]}" if options[:default]
      url
    end
  end
  include GravatarHelper
  
  module FixtureHelper
    @@fixture_count = 0
    
    class HashStruct
      def metaclass
        class << self; self; end
      end
      
      def initialize(hash={})
        merge(hash, true)
      end
      
      def merge(hash, force=false)
        hash.each do |(k,v)|
          metaclass.send(:define_method, "#{k}") { instance_variable_get("@#{k}") } if force or !respond_to?("#{k}")
          metaclass.send(:define_method, "#{k}=") { |value| instance_variable_set("@#{k}", value) } if force or !respond_to?("#{k}=")
          send("#{k}=", v)
        end
      end
    end
    
    def fixture(hash={}, extensions=Module.new)
      defaults = {:id => (@@fixture_count += 1)}
      f = HashStruct.new(defaults.merge(hash))
      f.extend(extensions)
      f.initialize_fixture if f.respond_to? :initialize_fixture
      f
    end
  end
  include FixtureHelper
  
  def image(name, options = {})
    image_tag(append_image_extension("/images/admin/#{name}"), options)
  end
  
end

