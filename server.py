import os
from flask import Flask, render_template

app = Flask(__name__)


project_folder = os.path.dirname(os.path.abspath(__file__))

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)