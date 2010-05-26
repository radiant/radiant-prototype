#\ -p 4000

gem 'activesupport', '2.3.5' # Serve currently requires this version
gem 'serve'

require 'serve'
require 'serve/rack'

# Middleware
use Rack::ShowStatus      # Nice looking 404s and other messages
use Rack::ShowExceptions  # Nice looking errors

# The project root directory
root = File.dirname(__FILE__)

# Rack Application
if ENV['SERVER_SOFTWARE'] =~ /passenger/i
  # Passenger only needs the adapter
  run Serve::RackAdapter.new(root + '/views')
else
  # We use Rack::Cascade and Rack::Directory on other platforms to
  # handle static assets
  run Rack::Cascade.new([
    Serve::RackAdapter.new(root + '/views'),
    Rack::Directory.new(root + '/public')
  ])
end