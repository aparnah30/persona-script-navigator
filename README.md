
# Handwriting Personality Analyzer

This application analyzes handwriting samples to predict personality traits and provide career guidance.

## Project Structure
- `/src`: React frontend code
- `/api`: Python backend API

## Setup Instructions

### 1. Frontend Setup
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### 2. Backend Setup
```bash
# Navigate to API directory
cd api

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Make sure you have your model file
# Place personality_classifier_colab.pth in the api directory

# Run the Flask API server
python app.py
```

## Using the Application
1. Start both the frontend and backend servers
2. Open your browser to the frontend URL (usually http://localhost:3000)
3. Upload a handwriting image
4. View your personality analysis and career recommendations

## System Requirements
- Python 3.8+ with pip
- Node.js and npm
- PyTorch and other Python dependencies (see requirements.txt)

## Note on Model File
You need to have the PyTorch model file `personality_classifier_colab.pth` in the `/api` directory. This file contains the trained neural network for personality prediction.
