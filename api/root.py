from flask import Flask, jsonify, request
import os, subprocess
from os.path import join, dirname
from functools import partial
from dotenv import load_dotenv
load_dotenv(join(dirname(__file__), 'config.env'))
os.environ["PYTHONDONTWRITEBYTECODE"] = "1"
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

app = Flask(__name__)

# Endable CORS
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Set the config
# Check if there if a file called config.py in the current directory. If there is import it and update the config, and if not then use the default config
try:
    # dynamically import the the file
    module = __import__("config", fromlist=["config"])
    app.config.update(module.config)
except:    
    # Default config
    config = {
        "DEBUG": os.environ.get('DEBUG', True),
        "HOST": "0.0.0.0",
        "PORT": int(os.environ.get('PORT', 9000)),
        "UPLOAD_FOLDER": os.path.join(os.path.dirname(__file__), "uploads"), 
        'API_KEY': '1234',
    }
    # update the config
    app.config.update(config)


endpoints = {
    "v1": {}
}

# for each key in endpoints retrive all .py files in the directory. For each file using refactoring extract all functions and add them to the endpoints dictionary
for key in endpoints:
    for file in os.listdir(os.path.join(os.path.dirname(__file__), key)):
        if file.endswith(".py"):
            # dynamically import the the file
            module = __import__(key + "." + file[:-3], fromlist=[file[:-3]])

            # check if module has a variable called export
            if hasattr(module, 'export'):
                functions = getattr(module, 'export')
                # add the functions to the endpoints dictionary
                endpoints[key][file[:-3]] = []
                for func in functions:
                    endpoints[key][file[:-3]].append((func.__name__, partial(func, request, app)))
                

# for each key in endpoints add a route to the flask app
endpoint_urls = []
for key in endpoints:
    for file in endpoints[key]:
        for func_name, func in endpoints[key][file]:
            # add the route to the flask app
            # print('/' + key + '/' + file + '/' + func_name)
            endpoint_urls.append('/' + key + '/' + file + '/' + func_name)
            app.add_url_rule('/' + key + '/' + file + '/' + func_name, func_name, func, methods=['GET', 'POST'])

# Creat an end point to return API documentation
@app.route('/')
def index():
    return jsonify({"endpoints": endpoint_urls})


@app.before_request
def before():
    # Check for API key is in header or not, bypass it if it is localhost
    if request.remote_addr not in ['127.0.0.1', 'localhost', '0.0.0.0']:
        if not request.headers.get('Authorization'):
            return jsonify({"error": "Authorization is missing in the header"}), 401




if __name__ == '__main__':
    # app.run()
    app.run(host=app.config['HOST'], port=app.config['PORT'], debug=app.config['DEBUG'])