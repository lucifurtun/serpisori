"""
Entry point for Tornado.
"""

import logging
import tornado.escape
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.websocket
import os.path
import uuid

from tornado.options import define, options

define("port", default=8888, help="run on the given port", type=int)


class Application(tornado.web.Application):
    def __init__(self):
        handlers = self.get_handlers()
        settings = self.get_settings()
        tornado.web.Application.__init__(self, handlers, **settings)

    def get_settings(self):
        settings = dict(
            cookie_secret="PHuh1653-909lksnbv1!-ppPllkahutnVVb=U",
            template_path=os.path.join(os.path.dirname(__file__), "templates"),
            static_path=os.path.join(os.path.dirname(__file__), "static"),
            xsrf_cookies=True,
        )
        return settings

    def get_handlers(self):
        handlers = [
            (r"/", MainHandler),
            (r"/client", ClientHandler),
            (r"/chatsocket", ChatSocketHandler),
            (r"/player", PlayerHandler),
            (r"/spectator", SpectatorHandler),
        ]
        return handlers


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html", messages=ChatSocketHandler.cache)


class ClientHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("client.html", messages=ChatSocketHandler.cache)


class PlayerHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("player.html", messages=ChatSocketHandler.cache)


class SpectatorHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("spectator.html", messages=ChatSocketHandler.cache)


class ChatSocketHandler(tornado.websocket.WebSocketHandler):
    waiters = set()
    cache = []
    cache_size = 200

    def get_compression_options(self):
        # Non-None enables compression with default options.
        return {}

    def open(self):
        ChatSocketHandler.waiters.add(self)

    def on_close(self):
        ChatSocketHandler.waiters.remove(self)

    @classmethod
    def update_cache(cls, chat):
        cls.cache.append(chat)
        if len(cls.cache) > cls.cache_size:
            cls.cache = cls.cache[-cls.cache_size:]

    @classmethod
    def send_updates(cls, chat):
        logging.info("sending message to %d waiters", len(cls.waiters))
        for waiter in cls.waiters:
            try:
                waiter.write_message(chat)
            except:
                logging.error("Error sending message", exc_info=True)

    def on_message(self, message):
        logging.info("got message %r", message)

        ChatSocketHandler.update_cache(message)
        ChatSocketHandler.send_updates(message)


def main():
    tornado.options.parse_command_line()
    app = Application()
    app.listen(options.port)
    tornado.ioloop.IOLoop.current().start()


if __name__ == "__main__":
    main()
