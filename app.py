
import sqlite3
import json
from flask import Flask, render_template, request, jsonify


app = Flask(__name__)


def get_db_connection():

    conn = sqlite3.connect('pixel_art.db')
    conn.row_factory = sqlite3.Row
    return conn


def init():
    conn = get_db_connection()
    conn.execute('''CREATE TABLE IF NOT EXISTS myart(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      gridSize TEXT NOT NULL,
      grid TEXT NOT NULL,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
    ''')
    conn.commit()
    conn.close()


init()


@app.route("/")
@app.route("/home")
def home():
    return render_template("index.html")


@app.route("/save", methods=["POST"])
def save():

    data = request.json
    title = str(data.get("title"))
    gridSize = str(data.get("gridSize"))
    grid = json.dumps(data.get("grid"))

    conn = sqlite3.connect('pixel_art.db')
    cursor = conn.cursor()
    cursor.execute("INSERT INTO myart (title,gridSize,grid) VALUES (?,?,?)", (title, gridSize, grid))
    conn.commit()
    conn.close()

    return jsonify({"message": "Artwork saved!"})


@app.route("/gallery")
def gallery():

    return render_template("myGallery.html")


if __name__ == "__main__":
    app.run(debug=True)
