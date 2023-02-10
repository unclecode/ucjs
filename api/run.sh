#!/bin/bash
# Change current working directory to /home/ubuntu/gpt3plus/
# cd /home/ubuntu/gpt3plus/
# Activate virtual environment
# source /home/ubuntu/gpt3plus/venv/bin/activate
gunicorn root:app -c gunicorn.config.py