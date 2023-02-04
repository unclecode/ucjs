from chalice import Chalice
import os, json

app = Chalice(app_name='uci')

filename = os.path.join(os.path.dirname(__file__), 'chalicelib', 'tasks.json')
with open(filename) as f:
    config = json.load(f)

@app.route('/', cors=True)
def index():
    return {'hello': 'world', 'data': config}