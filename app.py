# import necessary libraries
from flask import Flask, render_template

# from flask_sqlalchemy import SQLAlchemy
import os

# create instance of Flask app
app = Flask(__name__)

# create route that renders index.html template
@app.route("/")
def index():
    return render_template("index.html", text="Serving up cool text from the Flask server!!")

@app.route("/industry")
def industry():
    return render_template("industry.html", text="industry page")

@app.route("/stock-index")
def stocks():
    return render_template("stock-index.html", text="industry page")
  

if __name__ == "__main__":
    app.run(debug=True, extra_files='index.html')