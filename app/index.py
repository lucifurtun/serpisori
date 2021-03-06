"""
Entry point for Tornado.
"""

import logging
import uuid

import os.path
import tornado.escape
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.websocket
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
            (r"/", PlayerHandler),
            (r"/chatsocket", ChatSocketHandler),
            (r"/player", PlayerHandler),
            (r"/spectator", SpectatorHandler),
            (r"/player-interface", PlayerInterfaceHandler),
        ]
        return handlers


class PlayerHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("player.html", messages=ChatSocketHandler.cache)


class SpectatorHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("spectator.html", messages=ChatSocketHandler.cache)


class PlayerInterfaceHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("player_interface.html", messages=ChatSocketHandler.cache)


class ChatSocketHandler(tornado.websocket.WebSocketHandler):
    waiters = set()
    cache = []
    cache_size = 200
    client_id = None
    client_count = 0

    def get_compression_options(self):
        # Non-None enables compression with default options.
        return {}

    def open(self):
        self.set_client_id()
        message_dict = {
            "type": "join",
            "id": self.get_client_id(),
        }
        self.write_message(message_dict)
        ChatSocketHandler.waiters.add(self)

    def on_close(self):
        logging.debug("On close fired for id %s", self.client_id)
        ChatSocketHandler.waiters.remove(self)

    @classmethod
    def update_cache(cls, message):
        cls.cache.append(message)
        if len(cls.cache) > cls.cache_size:
            cls.cache = cls.cache[-cls.cache_size:]

    @classmethod
    def send_updates(cls, message):
        logging.info("sending message to %d waiters", len(cls.waiters))
        for waiter in cls.waiters:
            try:
                cls.write_message_for_waiter(waiter, message)
            except:
                logging.error("Error sending message", exc_info=True)

    @classmethod
    def write_message_for_waiter(cls, waiter, message):
        """
        Placeholder to inject more data in the message.
        """
        message_dict = tornado.escape.json_decode(message)
        waiter.write_message(message_dict)

    def on_message(self, message):
        logging.info("got message %r", message)

        ChatSocketHandler.send_updates(message)

    def set_client_id(self):
        self.client_id = str(uuid.uuid4())

    def get_client_id(self):
        return self.client_id


def main():
    tornado.options.parse_command_line()
    app = Application()
    app.listen(options.port)
    tornado.ioloop.IOLoop.current().start()


if __name__ == "__main__":
    main()
