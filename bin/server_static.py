#!/usr/bin/env python3

import http.server

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_my_headers()
        http.server.SimpleHTTPRequestHandler.end_headers(self)

    def send_my_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")


if __name__ == '__main__':

    import argparse
    import os
    
    parser = argparse.ArgumentParser()
    parser.add_argument('--bind', '-b', metavar='ADDRESS',
                        help='Specify alternate bind address '
                             '[default: all interfaces]')
    parser.add_argument('--directory', '-d', default=os.getcwd(),
                        help='Specify alternative directory '
                        '[default:current directory]')
    parser.add_argument('port', action='store',
                        default=8000, type=int,
                        nargs='?',
                        help='Specify alternate port [default: 8000]')
    args = parser.parse_args()

    handler_class = http.server.partial(MyHTTPRequestHandler, directory=args.directory)

    # ensure dual-stack is not disabled; ref #38907
    #class DualStackServer(ThreadingHTTPServer):
    #    def server_bind(self):
    #        # suppress exception when protocol is IPv4
    #        with contextlib.suppress(Exception):
    #            self.socket.setsockopt(
    #                socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
    #        return super().server_bind()

    http.server.test(
        HandlerClass=handler_class,
    #    ServerClass=DualStackServer,
        port=args.port,
        bind=args.bind,
    )
