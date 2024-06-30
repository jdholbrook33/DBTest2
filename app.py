# app.py

from flask import Flask, render_template, request, redirect, session, jsonify
import sqlite3
from sqlite3 import Error
import os

app = Flask(__name__)
app.secret_key = 'd652a2c8262ed583d62de8e72588cb2f'

def connect_db():
    database = os.path.join('data', 'CNC_DB.db')
    try:
        conn = sqlite3.connect(database)
        conn.row_factory = sqlite3.Row
        return conn
    except Error as e:
        print("Error connecting to SQLite database:", str(e))
        raise e

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/employee')
def employee():
    session['current_id'] = 1
    return render_template('employee.html')

@app.route('/dbData', methods=['GET'])
def get_data():
    try:
        table_name = request.args.get('table')
        primary_key = request.args.get('id', type=int)

        print(f"Received request for table: {table_name}, primary key: {primary_key}")
        
        if not table_name or not primary_key:
            return jsonify({"error": "Missing required parameters", "status": "failure"}), 400
        
        conn = connect_db()
        cursor = conn.cursor()
        cursor.execute(f"SELECT * FROM {table_name} WHERE id = ?", (primary_key,))
        record = cursor.fetchone()
        conn.close()

        if record:
            record_data = dict(record)
            return jsonify(record_data)
        else:
            return jsonify(None), 404
    except Exception as e:
        print("Exception in get_data:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/search', methods=['GET'])
def search():
    try:
        table = request.args.get('table')
        search_term = request.args.get('term')
        if not table or not search_term:
            return jsonify({"error": "Missing table or search term"}), 400

        conn = connect_db()
        cursor = conn.cursor()

        # Get column names for the specified table
        cursor.execute(f"PRAGMA table_info({table})")
        columns = [column[1] for column in cursor.fetchall()]

        # Construct a dynamic query based on the table's columns
        search_conditions = " OR ".join([f"{col} LIKE ?" for col in columns])
        query = f"SELECT * FROM {table} WHERE {search_conditions}"
        
        # Execute the query with search term for each column
        cursor.execute(query, tuple(f'%{search_term}%' for _ in columns))
        
        records = cursor.fetchall()
        conn.close()

        records_data = [dict(zip(columns, record)) for record in records]
        return jsonify(records_data)

    except Exception as e:
        print("Exception in search:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)