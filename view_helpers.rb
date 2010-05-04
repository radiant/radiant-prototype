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
    
    assets = NavTab.new(:assets, "Assets")
    assets << NavSubItem.new(:images, "Images", "/admin/images/")
    assets << NavSubItem.new(:stylesheets, "Stylesheets", "/admin/stylesheets/")
    assets << NavSubItem.new(:javascripts, "Javascripts", "/admin/javascripts/")
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
  
  module EscapeHelper
    HTML_ESCAPE = { '&' => '&amp;',  '>' => '&gt;',   '<' => '&lt;', '"' => '&quot;' }
    JSON_ESCAPE = { '&' => '\u0026', '>' => '\u003E', '<' => '\u003C' }
    
    # A utility method for escaping HTML tag characters.
    # This method is also aliased as <tt>h</tt>.
    #
    # In your ERb templates, use this method to escape any unsafe content. For example:
    #   <%=h @person.name %>
    #
    # ==== Example:
    #   puts html_escape("is a > 0 & a < 10?")
    #   # => is a &gt; 0 &amp; a &lt; 10?
    def html_escape(s)
      s.to_s.gsub(/[&"><]/) { |special| HTML_ESCAPE[special] }
    end
    alias h html_escape
    
    # A utility method for escaping HTML entities in JSON strings.
    # This method is also aliased as <tt>j</tt>.
    #
    # In your ERb templates, use this method to escape any HTML entities:
    #   <%=j @person.to_json %>
    #
    # ==== Example:
    #   puts json_escape("is a > 0 & a < 10?")
    #   # => is a \u003E 0 \u0026 a \u003C 10?
    def json_escape(s)
      s.to_s.gsub(/[&"><]/) { |special| JSON_ESCAPE[special] }
    end
    
    alias j json_escape
  end
  include EscapeHelper
  
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
  
  module FlashHelper
    def flash
      @flash ||= {}
    end
  end
  include FlashHelper
  
  module ParamsHelper
    
    # Key based access to query parameters. Keys can be strings or symbols.
    def params
      @params ||= begin
        q = request.query.dup
        q.each { |(k,v)| q[k.to_s.intern] = v }
        q
      end
    end
    
    # Extract the value for a bool param. Handy for rendering templates in
    # different states.
    def boolean_param(key, default = false)
      key = key.to_s.intern
      value = params[key]
      return default if value.nil?
      case value.strip.downcase
      when 'true'
        true
      when 'false'
        false
      else
        raise 'Invalid value'
      end
    end

  end
  include ParamsHelper
  
  module TagHelper
    def content_tag(name, content, html_options={})
      %{<#{name}#{html_attributes(html_options)}>#{content}</#{name}>}
    end
    
    def tag(name, html_options={})
      %{<#{name}#{html_attributes(html_options)} />}
    end
    
    def image_tag(src, html_options = {})
      tag(:img, html_options.merge({:src=>src}))
    end

    def image(name, options = {})
      image_tag(append_image_extension("/images/admin/#{name}"), options)
    end
    
    def javascript_tag(content = nil, html_options = {})
      content_tag(:script, javascript_cdata_section(content), html_options.merge(:type => "text/javascript"))
    end
    
    def link_to(name, href, html_options = {})
      html_options = html_options.stringify_keys
      confirm = html_options.delete("confirm")
      onclick = "if (!confirm('#{html_escape(confirm)}')) return false;" if confirm
      content_tag(:a, name, html_options.merge(:href => href, :onclick=>onclick))
    end
    
    def link_to_function(name, *args, &block)
      html_options = {}
      html_options = args.pop if args.last.is_a? Hash
      function = args[0] || ''
      onclick = "#{"#{html_options[:onclick]}; " if html_options[:onclick]}#{function}; return false;"
      href = html_options[:href] || '#'
      content_tag(:a, name, html_options.merge(:href => href, :onclick => onclick))
    end
    
    def mail_to(email_address, name = nil, html_options = {})
      html_options = html_options.stringify_keys
      encode = html_options.delete("encode").to_s
      cc, bcc, subject, body = html_options.delete("cc"), html_options.delete("bcc"), html_options.delete("subject"), html_options.delete("body")
      
      string = ''
      extras = ''
      extras << "cc=#{CGI.escape(cc).gsub("+", "%20")}&" unless cc.nil?
      extras << "bcc=#{CGI.escape(bcc).gsub("+", "%20")}&" unless bcc.nil?
      extras << "body=#{CGI.escape(body).gsub("+", "%20")}&" unless body.nil?
      extras << "subject=#{CGI.escape(subject).gsub("+", "%20")}&" unless subject.nil?
      extras = "?" << extras.gsub!(/&?$/,"") unless extras.empty?
      
      email_address = email_address.to_s
      
      email_address_obfuscated = email_address.dup
      email_address_obfuscated.gsub!(/@/, html_options.delete("replace_at")) if html_options.has_key?("replace_at")
      email_address_obfuscated.gsub!(/\./, html_options.delete("replace_dot")) if html_options.has_key?("replace_dot")
      
      if encode == "javascript"
        "document.write('#{content_tag("a", name || email_address_obfuscated, html_options.merge({ "href" => "mailto:"+email_address+extras }))}');".each_byte do |c|
          string << sprintf("%%%x", c)
        end
        "<script type=\"#{Mime::JS}\">eval(decodeURIComponent('#{string}'))</script>"
      elsif encode == "hex"
        email_address_encoded = ''
        email_address_obfuscated.each_byte do |c|
          email_address_encoded << sprintf("&#%d;", c)
        end
        
        protocol = 'mailto:'
        protocol.each_byte { |c| string << sprintf("&#%d;", c) }
        
        email_address.each_byte do |c|
          char = c.chr
          string << (char =~ /\w/ ? sprintf("%%%x", c) : char)
        end
        content_tag "a", name || email_address_encoded, html_options.merge({ "href" => "#{string}#{extras}" })
      else
        content_tag "a", name || email_address_obfuscated, html_options.merge({ "href" => "mailto:#{email_address}#{extras}" })
      end
    end
    
    private
    
      def cdata_section(content)
        "<![CDATA[#{content}]]>"
      end
      
      def javascript_cdata_section(content) #:nodoc:
        "\n//#{cdata_section("\n#{content}\n//")}\n"
      end
      
      def html_attributes(options)
        unless options.blank?
          attrs = []
          options.each_pair do |key, value|
            if value == true
              attrs << %(#{key}="#{key}") if value
            else
              attrs << %(#{key}="#{value}") unless value.nil?
            end
          end
          " #{attrs.sort * ' '}" unless attrs.empty?
        end
      end
      
      def append_image_extension(name)
        unless name =~ /\.(.*?)$/
          name + '.png'
        else
          name
        end
      end
  end
  include TagHelper
end

