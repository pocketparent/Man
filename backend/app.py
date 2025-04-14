import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)

# Simple in-memory database for demonstration
entries = [
    {
        "id": "1",
        "title": "First steps!",
        "content": "Baby took their first steps today!",
        "date": "2023-04-15T00:00:00.000Z",
        "images": []
    },
    {
        "id": "2",
        "title": "New word",
        "content": "Baby said \"mama\" for the first time!",
        "date": "2023-04-10T00:00:00.000Z",
        "images": []
    }
]

@app.route('/', methods=['GET'])
def home():
    return jsonify({"status": "ok", "message": "Hatchling API is running"})

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"})

@app.route('/api/entries', methods=['GET'])
def get_entries():
    return jsonify(entries)

@app.route('/api/entries', methods=['POST'])
def add_entry():
    entry = request.json
    entry["id"] = str(len(entries) + 1)
    entries.append(entry)
    return jsonify(entry), 201

@app.route('/api/entries/<entry_id>', methods=['GET'])
def get_entry(entry_id):
    for entry in entries:
        if entry["id"] == entry_id:
            return jsonify(entry)
    return jsonify({"error": "Entry not found"}), 404

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
