from werkzeug.utils import secure_filename
import os, json
os.environ["PYTHONDONTWRITEBYTECODE"] = "1"

def request_tyoes(request, app):
    print("Query string: " + str(request.args))
    print("Request body: " + str(request.data))
    print("Request headers: " + str(request.headers))
    print("Request method: " + str(request.method))
    print("Request path: " + str(request.path))
    if request.content_type == 'application/json':
        print("Request JSON: " + str(request.json or {}))
    print("Request Form: " + str(request.form and request.form.to_dict() or {}))
    # MAKE A DIC OF ALL above and return it
    response= {
        'status': 'ok',
        'name': 'completion',
        'args': str(request.args),
        'data': str(request.data),
        'headers': str(request.headers),
        'method': str(request.method),
        'path': str(request.path),
        'json': str(request.json) if request.content_type == 'application/json' else "{}",
        'form': str(request.form),
    }
    return response

def tasks(request, app):
    # get tasks from ../uploads/tasks.json
    # return tasks
    filename = os.path.join(os.path.dirname(__file__), '..', 'uploads', 'tasks.json')
    with open(filename) as f:
        config = json.load(f)
    return config



def upload_file(request, app):
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            return "No file part"
        # Handle multiple files
        for file in request.files.getlist('file'):
            if file.filename == '':
                return "No selected file"
            if file:
                # Get the filename
                filename = secure_filename(file.filename)
                # Save the file to the uploads folder
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return "File uploaded successfully"
    return "File upload failed"

def get_upload_page_html(request, app):
    # return html file tht using JS fetch api upload the file to /v1/examples/upload_file
    return """
    <!DOCTYPE html>
    <html>
    <body>
    <form action="/v1/examples/upload_file" method="post" enctype="multipart/form-data">
        Select image to upload:
        <input type="file" name="file" id="file">
        <input type="submit" value="Upload Image" name="submit">
    </form>
    </body>
    </html>
    """


export = [request_tyoes, tasks, upload_file, get_upload_page_html]