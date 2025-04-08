
from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from torch import nn
from torchvision import transforms, models
from PIL import Image
import cv2
import numpy as np
import io
from langchain_mistralai import ChatMistralAI
from langchain.schema import HumanMessage, SystemMessage

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set up the device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load the model
model = models.vgg16(weights=None)
model.classifier[6] = nn.Linear(model.classifier[6].in_features, 5)

try:
    model.load_state_dict(torch.load("personality_classifier_colab.pth", map_location=device))
    model.to(device)
    model.eval()
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")

# Define transformations
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
])

class_names = ['Agreeableness', 'Conscientiousness', 'Extraversion', 'Neuroticism', 'Openness']

# Initialize Mistral AI
api_key = "Ebdj7eOzAo9uwZCNBtTTfiddwSVOlq5q"
llm = ChatMistralAI(
    model="mistral-large-latest",
    api_key=api_key,
    temperature=0.7
)

def get_letter_size(thresh_img):
    contours, _ = cv2.findContours(thresh_img, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    heights = [cv2.boundingRect(c)[3] for c in contours if cv2.contourArea(c) > 50]
    avg_height = np.mean(heights) if heights else 0
    if avg_height > 50:
        return "Large Letters"
    elif avg_height < 20:
        return "Small Letters"
    else:
        return "Average Letters"

def get_slant(thresh_img):
    coords = np.column_stack(np.where(thresh_img > 0))
    if len(coords) > 50:
        angle = cv2.fitLine(coords, cv2.DIST_L2, 0, 0.01, 0.01)[1][0]
        if angle > 0.3:
            return "Right Slant"
        elif angle < -0.3:
            return "Left Slant"
        else:
            return "Vertical Slant"
    return "Unknown Slant"

def get_pen_pressure(gray_img):
    mean_intensity = np.mean(gray_img)
    return "Heavy Pen Pressure" if mean_intensity < 100 else "Light Pen Pressure"

def get_baseline(thresh_img):
    h, w = thresh_img.shape
    lines = [np.mean(np.where(thresh_img[y, :] > 0)[0]) if np.any(thresh_img[y, :] > 0) else w / 2 for y in range(h)]
    z = np.polyfit(range(len(lines)), lines, 1)
    slope = z[0]
    if slope > 0.5:
        return "Rising Baseline"
    elif slope < -0.5:
        return "Falling Baseline"
    elif abs(slope) <= 0.1:
        return "Straight Baseline"
    else:
        return "Erratic Baseline"

def get_word_spacing(thresh_img):
    horizontal_sum = np.sum(thresh_img, axis=0)
    space_gaps = np.where(horizontal_sum == 0)[0]
    avg_gap = np.mean(np.diff(space_gaps)) if len(space_gaps) > 1 else 0
    return "Far Spaced Words" if avg_gap > 15 else "Close Spaced Words"

@app.route('/analyze', methods=['POST'])
def analyze_handwriting():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400

    try:
        # Get the image file
        file = request.files['image']
        img = Image.open(io.BytesIO(file.read())).convert("RGB")
        img_np = np.array(img)
        img_cv = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)
        
        # Analyze with the neural network
        input_tensor = transform(img).unsqueeze(0).to(device)
        
        with torch.no_grad():
            output = model(input_tensor)
            predicted_class = torch.argmax(output, dim=1).item()
        
        result = class_names[predicted_class]
        
        # Analyze handwriting features
        gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
        thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]
        
        letter_size = get_letter_size(thresh)
        letter_slant = get_slant(thresh)
        pen_pressure = get_pen_pressure(gray)
        baseline = get_baseline(thresh)
        word_spacing = get_word_spacing(thresh)
        
        # Generate prompt for Mistral AI
        prompt = f"""
        The neural network has identified the individual's dominant personality trait as **{result}**.

        Below is a brief overview of the Big Five personality traits:
        - **Agreeableness**: Cooperative, empathetic, and nurturing; values harmony in relationships.
        - **Conscientiousness**: Organized, detail-oriented, reliable; thrives on structure and planning.
        - **Extraversion**: Outgoing, energetic, people-oriented; draws energy from social interaction.
        - **Neuroticism**: Emotionally sensitive, introspective; may excel in deeply analytical or empathetic roles.
        - **Openness**: Imaginative, curious, intellectually driven; embraces innovation and creativity.

        Using this trait as a foundation, provide a **career counseling analysis**. Recommend **suitable career paths** or work environments where someone with this trait would likely thrive.

        Support your analysis using the following handwriting characteristics:

        - Letter Size: {letter_size}
        - Letter Slant: {letter_slant}
        - Pen Pressure: {pen_pressure}
        - Baseline: {baseline}
        - Word Spacing: {word_spacing}

        Explain how the handwriting style either reinforces or complements the predicted personality trait. Then offer a final recommendation, summarizing ideal professions, strengths, and work styles suited for this personality type.
        """
        
        # Generate career analysis with Mistral AI
        messages = [
            SystemMessage(content="You are a personality analyst who evaluates handwriting."),
            HumanMessage(content=prompt)
        ]
        
        response = llm(messages)
        career_analysis = response.content
        
        return jsonify({
            "personalityTrait": result,
            "letterSize": letter_size,
            "letterSlant": letter_slant,
            "penPressure": pen_pressure,
            "baseline": baseline,
            "wordSpacing": word_spacing,
            "careerAnalysis": career_analysis
        })
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
