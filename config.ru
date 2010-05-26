#\ -p 4000

gem 'activesupport', '2.3.5'
gem 'serve', '0.11.2'

require 'serve'
require 'serve/rack'

root = File.dirname(__FILE__)

use Rack::CommonLogger
use Rack::ShowStatus
use Rack::ShowExceptions
run Serve::RackAdapter.new(root)
