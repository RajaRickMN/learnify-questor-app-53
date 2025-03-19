
# Learning App

A Python web application for flashcards, multiple choice questions, and test preparation.

## Project info

This is a Flask-based web application that allows users to upload Excel files containing study materials and practice with flashcards, multiple choice questions, and tests.

## Features

- Upload Excel files with study materials
- Practice with flashcards
- Answer multiple choice questions
- Take full tests
- Track your progress
- Dark/light mode

## How to run locally

### Prerequisites

Make sure you have Python 3.7+ installed on your system.

### Installation

1. Clone this repository:
```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Create a virtual environment (recommended):
```sh
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```sh
pip install -r requirements.txt
```

4. Run the application:
```sh
python app.py
```

5. Open your browser and navigate to:
```
http://localhost:8080
```

## Using the application

1. Upload an Excel file using the "Upload Excel" button in the header.
2. The Excel file should contain the following worksheets:
   - `Flashcards` - For review with front/back cards
   - `MCQs` - For multiple choice practice questions
   - `Test App` - For creating full tests with questions
3. Navigate to the different sections using the links on the homepage.
4. Start studying and tracking your progress!

## Excel file format

### Flashcards worksheet
Should contain columns:
- `question` - The front of the flashcard
- `answer` - The back of the flashcard
- `subject` - The subject category
- `topic` - The specific topic

### MCQs worksheet
Should contain columns:
- `question` - The question text
- `option a`, `option b`, `option c`, `option d` - Multiple choice options
- `key` - The correct answer (a, b, c, or d)
- `explanation` - Explanation of the answer
- `subject` - The subject category
- `topic` - The specific topic

### Test App worksheet
Should contain the same columns as MCQs, plus:
- `test number` - To group questions into specific tests

## License

This project is open source and available under the MIT License.
