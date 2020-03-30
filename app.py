# import necessary libraries
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
import os

# create instance of Flask app
app = Flask(__name__)

# create route that renders index.html template
@app.route("/")
def echo():
    return render_template("index.html", text="Serving up cool text from the Flask server!!")

if __name__ == "__main__":
    app.run(debug=True)