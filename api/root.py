from flask import Flask, jsonify, request
import os, subprocess
from functools import partial
os.environ["PYTHONDONTWRITEBYTECODE"] = "1"

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
    # Check the first available port after 5050
    port = 5050
    while True:
        result = subprocess.run(['lsof', '-i', 'tcp:' + str(port)], stdout=subprocess.PIPE)
        if not result.stdout:
            break
        port += 1

    # Default config
    config = {
        "DEBUG": True,
        "HOST": "127.0.0.1",
        "PORT": port,
        # Set "UPLOAD_FOLDER" to current directory "uploads" folder
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
            
            # get all functions in the module
            functions = [func for func in dir(module) if callable(getattr(module, func)) and not func.startswith("__")]
            # add the functions to the endpoints dictionary
            endpoints[key][file[:-3]] = []
            for func in functions:
                endpoints[key][file[:-3]].append((func, partial(getattr(module, func), request, app)))
                

# for each key in endpoints add a route to the flask app
for key in endpoints:
    for file in endpoints[key]:
        for func_name, func in endpoints[key][file]:
            # add the route to the flask app
            print('/' + key + '/' + file + '/' + func_name)
            app.add_url_rule('/' + key + '/' + file + '/' + func_name, func_name, func, methods=['GET', 'POST'])

@app.before_request
def before():
    # Check for API key is in header or not, bypass it if it is localhost
    if request.remote_addr not in ['127.0.0.1', 'localhost', '0.0.0.0']:
        if not request.headers.get('API-KEY'):
            return jsonify({"error": "API-KEY is missing in the header"}), 401




if __name__ == '__main__':
    # app.run()
    app.run(host=app.config['HOST'], port=app.config['PORT'], debug=app.config['DEBUG'])