"""
Entry point for Tornado.
"""

import tornado.escape
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.websocket
from tornado.options import options

from index import Application


class DebugApplication(Application):
    def get_settings(self):
        settings = super(DebugApplication, self).get_settings()
        settings['debug'] = True

        return settings


def main():
    tornado.options.parse_command_line()
    app = DebugApplication()
    app.listen(options.port)
    tornado.ioloop.IOLoop.current().start()


if __name__ == "__main__":
    main()
