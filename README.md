What is this?
=============

This is a simple HTML prototype of Radiant written in HAML that is designed
to be viewed with serve.

What is Serve? Serve is an open-source rapid prototyping framework for Web
applications. It makes it easy to prototype functionality without writing a
single line of backend code.


Can I contribute?
-----------------

Sure! We welcome contributions to the prototype. If you have an idea for a
new feature this is the perfect place to get the action rolling. Once you
have it prototyped using serve, create a ticket on the dev site and attach
your patch. Then give us a holler on the dev mailing list and we can debate
the merits of your idea there.


How do I install and run Serve?
-------------------------------

Serve is distributed as a Ruby gem to make it easy to get up and running. You
must have Ruby installed in order to download and use Serve. The Ruby download
page provides instructions for getting Ruby setup on different platforms:

<http://www.ruby-lang.org/en/downloads/>

After you have Ruby installed, open up the command prompt and type:

    gem install serve

(OSX and Unix users may need to prefix the command with `sudo`.)

After Serve is installed, you can start it up in a given directory like this:

    serve

This will start Serve on port 4000. You can now view the prototype in your
Web browser at this URL:

<http://localhost:4000>


Compass and Sass
----------------

This prototype uses Compass and Sass to generate CSS. Both are distributed as
Ruby gems and can be easily installed from the command prompt. Since the
Compass gem depends on Sass, you can install them both with one command:

    gem install compass

Learn more about Sass:

<http://sass-lang.org>

Learn more about Compass:

<http://compass-style.org>


Rack and Passenger
------------------

Astute users may notice that this project is also a simple Rack application.
This means that it is easy to deploy it on Passenger or in any other
Rack-friendly environment. Rack it up with the `rackup` command. For more
information about using Serve and Passenger see:

<http://bit.ly/serve-and-passenger>


Exporting
---------

To export your project, use the new "export" command:

    serve export <project> <output>

Where "project" is the path to the project and "output" is the path to the
directory where you would like your HTML and CSS generated.


Learning More
-------------

You can learn more about Serve on the GitHub project page:

<http://github.com/jlong/serve>
