# https://github.com/benoitc/gunicorn/blob/master/examples/example_config.py
import multiprocessing, os
import subprocess
from dotenv import load_dotenv
from os.path import join, dirname
load_dotenv(join(dirname(__file__), 'config.env'))

port = os.environ.get('PORT', None)
if not port:
    # Check the first available port after 9000
    port = 9000
    print("No port specified, using default port: " + str(port))
    while True:
        result = subprocess.run(['lsof', '-i', 'tcp:' + str(port)], stdout=subprocess.PIPE)
        if not result.stdout:
            break
        port += 1

bind = f"0.0.0.0:{port}"
workers = multiprocessing.cpu_count() * 2 + 1
threads = multiprocessing.cpu_count() * 2 + 1
reload = True
worker_class = "gevent"
worker_connections = 1000
spew = False
raw_env = []

def post_fork(server, worker):
    server.log.info("Worker spawned (pid: %s)", worker.pid)

def pre_fork(server, worker):
    pass

def pre_exec(server):
    server.log.info("Forked child, re-executing.")

def when_ready(server):
    server.log.info("Server is ready. Spawning workers")

def worker_int(worker):
    worker.log.info("worker received INT or QUIT signal")

    ## get traceback info
    import threading, sys, traceback
    id2name = {th.ident: th.name for th in threading.enumerate()}
    code = []
    for threadId, stack in sys._current_frames().items():
        code.append("\n# Thread: %s(%d)" % (id2name.get(threadId,""),
            threadId))
        for filename, lineno, name, line in traceback.extract_stack(stack):
            code.append('File: "%s", line %d, in %s' % (filename,
                lineno, name))
            if line:
                code.append("  %s" % (line.strip()))
    worker.log.debug("\n".join(code))

def worker_abort(worker):
    worker.log.info("worker received SIGABRT signal")


# gunicorn root:app -c gunicorn.config.py  