
import sqlite3
import json
from flask import Flask, render_template, request, jsonify


app = Flask(__name__,
            template_folder='../templates',
            static_folder='../static')


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
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      img TEXT NOT NULL)
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
    img = data.get("img")
    conn = sqlite3.connect('pixel_art.db')
    cursor = conn.cursor()
    cursor.execute("INSERT INTO myart (title,gridSize,grid,img) VALUES (?,?,?,?)", (title, gridSize, grid, img))
    conn.commit()
    conn.close()

    return jsonify({"message": "Artwork saved!"})


@app.route("/gallery")
def gallery():

    conn = sqlite3.connect('pixel_art.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id,title,date,img from myart')
    rows = cursor.fetchall()
    conn.close()
    art_List = []
    for row in rows:
        art_List.append({"id": row[0],
                         "title": row[1],
                         "date": row[2],
                         "img": row[3]})
    return jsonify(art_List)


@app.route("/api/trashwork/<int:id>", methods=['DELETE'])
def trashwork(id):
    conn = sqlite3.connect('pixel_art.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM myart WHERE id=?', (id,))
    conn.commit()
    conn.close()
    return{'msg': 'artwork is deleted'}, 200


if __name__ == "__main__":
    app.run(debug=True)
