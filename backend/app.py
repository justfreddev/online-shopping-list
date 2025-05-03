from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
app.debug = True
CORS(
    app,
    resources={
        r"/hello": {"origins": "localhost"}
    }
)
app.config["CORS_HEADERS"] = "Content-Type"


@app.route("/hello", methods=["GET"])
def root():
    return jsonify({"status": 200, "message": "Hello World"})


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8080, debug=True)