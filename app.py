from flask import Flask, render_template, request, redirect, session, jsonify
import sqlite3
from sqlite3 import Error
import os

app = Flask(__name__)
app.secret_key = 'd652a2c8262ed583d62de8e72588cb2f'  # Replace with a secure secret key

# Connection to the SQLite Database
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
    session['current_id'] = 1  # Reset to the first record when loading the page
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
            # Convert the record to an array
            record_data = list(record)
            return jsonify(record_data)
        else:
            return jsonify(None), 404
    except Exception as e:
        print("Exception in get_data:", e)
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
