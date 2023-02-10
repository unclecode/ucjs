#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd $DIR
source venv/bin/activate
GUNICORN_DIR = $(which gunicorn)
$GUNICORN_DIR/gunicorn root:app -c gunicorn.config.py
