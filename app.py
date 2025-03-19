
from flask import Flask, render_template, request, jsonify, send_from_directory
import pandas as pd
import os
import json
from werkzeug.utils import secure_filename

app = Flask(__name__, static_folder='static', template_folder='templates')
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Create upload directory if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# In-memory data store (in a real app, you'd use a database)
flashcards = []
mcqs = []
test_questions = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/flashcards')
def flashcards_page():
    return render_template('flashcards.html')

@app.route('/mcqs')
def mcqs_page():
    return render_template('mcqs.html')

@app.route('/tests')
def tests_page():
    return render_template('tests.html')

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({
        'flashcards': flashcards,
        'mcqs': mcqs,
        'test_questions': test_questions
    })

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and (file.filename.endswith('.xlsx') or file.filename.endswith('.xls')):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Process Excel file
            process_excel_file(filepath)
            return jsonify({'message': 'File uploaded successfully'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'File type not allowed'}), 400

def process_excel_file(filepath):
    global flashcards, mcqs, test_questions
    
    # Read the Excel file
    xls = pd.ExcelFile(filepath)
    sheet_names = xls.sheet_names
    
    # Process Flashcards sheet
    if 'Flashcards' in sheet_names:
        df = pd.read_excel(xls, 'Flashcards')
        flashcards = []
        for index, row in df.iterrows():
            status = "unattempted"
            if 'correct' in df.columns and row.get('correct', 0) > 0:
                status = "correct"
            elif 'wrong' in df.columns and row.get('wrong', 0) > 0:
                status = "wrong"
                
            flashcards.append({
                'id': index + 1,
                'question': str(row.get('question', '')),
                'answer': str(row.get('answer', '')),
                'subject': str(row.get('subject', '')),
                'topic': str(row.get('topic', '')),
                'status': status
            })
    
    # Process MCQs sheet
    if 'MCQs' in sheet_names:
        df = pd.read_excel(xls, 'MCQs')
        mcqs = []
        for index, row in df.iterrows():
            # Normalize column names
            row_dict = row.to_dict()
            
            question = ""
            option_a = ""
            option_b = ""
            option_c = ""
            option_d = ""
            key = "a"
            explanation = ""
            subject = ""
            topic = ""
            
            for col, val in row_dict.items():
                col_lower = str(col).lower()
                if col_lower == 'question':
                    question = str(val)
                elif any(x in col_lower for x in ['option a', 'optiona', 'opton a']):
                    option_a = str(val)
                elif any(x in col_lower for x in ['option b', 'optionb', 'opton b']):
                    option_b = str(val)
                elif any(x in col_lower for x in ['option c', 'optionc', 'opton c']):
                    option_c = str(val)
                elif any(x in col_lower for x in ['option d', 'optiond', 'opton d']):
                    option_d = str(val)
                elif col_lower in ['key', 'answer']:
                    key = str(val).lower()
                elif any(x in col_lower for x in ['explanation', 'exp']):
                    explanation = str(val)
                elif col_lower == 'subject':
                    subject = str(val)
                elif col_lower == 'topic':
                    topic = str(val)
            
            mcqs.append({
                'id': index + 1,
                'question': question,
                'optionA': option_a,
                'optionB': option_b,
                'optionC': option_c,
                'optionD': option_d,
                'key': key,
                'explanation': explanation,
                'subject': subject,
                'topic': topic,
                'status': "unattempted"
            })
    
    # Process Test App sheet
    test_sheet_names = ['Test App', 'Test', 'TestApp']
    test_sheet = next((s for s in test_sheet_names if s in sheet_names), None)
    
    if test_sheet:
        df = pd.read_excel(xls, test_sheet)
        test_questions = []
        for index, row in df.iterrows():
            # Normalize column names
            row_dict = row.to_dict()
            
            question = ""
            option_a = ""
            option_b = ""
            option_c = ""
            option_d = ""
            key = "a"
            explanation = ""
            subject = ""
            topic = ""
            test_number = 1
            
            for col, val in row_dict.items():
                col_lower = str(col).lower()
                if col_lower == 'question':
                    question = str(val)
                elif any(x in col_lower for x in ['option a', 'optiona', 'opton a']):
                    option_a = str(val)
                elif any(x in col_lower for x in ['option b', 'optionb', 'opton b']):
                    option_b = str(val)
                elif any(x in col_lower for x in ['option c', 'optionc', 'opton c']):
                    option_c = str(val)
                elif any(x in col_lower for x in ['option d', 'optiond', 'opton d']):
                    option_d = str(val)
                elif col_lower in ['key', 'answer']:
                    key = str(val).lower()
                elif any(x in col_lower for x in ['explanation', 'exp']):
                    explanation = str(val)
                elif col_lower == 'subject':
                    subject = str(val)
                elif col_lower == 'topic':
                    topic = str(val)
                elif any(x in col_lower for x in ['test number', 'testnumber']):
                    test_number = int(val) if isinstance(val, (int, float)) else 1
            
            test_questions.append({
                'id': index + 1,
                'question': question,
                'optionA': option_a,
                'optionB': option_b,
                'optionC': option_c,
                'optionD': option_d,
                'key': key,
                'explanation': explanation,
                'subject': subject,
                'topic': topic,
                'testNumber': test_number,
                'status': "unattempted"
            })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)
