from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import re
import os
import openai
from dotenv import load_dotenv
# Set up logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app)
load_dotenv()

# Configure OpenAI API Key
openai.api_key = os.getenv('OPENAI_API_KEY')

def bold_key_terms(text):
    """
    Adds HTML <b> tags around key terms for better emphasis.
    """
    key_terms = ['step', 'due date', 'assignment', 'complete', 'finish', 'submit', 'Total estimated time:']
    text = re.sub(r'(step\s*\d+)', r'<b>\1</b>', text, flags=re.IGNORECASE)
    for term in key_terms:
        if term.lower() != 'step':
            pattern = re.compile(rf'\b({term})\b', re.IGNORECASE)
            text = pattern.sub(r'<b>\1</b>', text)
    return text

@app.route('/process-text', methods=['POST'])
def process_text():
    """
    Processes a text input and generates step-by-step instructions using OpenAI's GPT-4.
    """
    try:
        # Extract text from the request
        data = request.get_json()
        logging.debug(f"Received JSON data: {data}")
        text = data.get('text', '')

        if not text:
            return jsonify({'error': 'No text provided in the request'}), 400

    # Prepare the chat request to the Ollama model with the text included in the prompt
    prompt = f"""
    Given the following assignment, please generate 5-6 detailed and actionable steps, along with an estimated time for each step, designed for a beginner-intermediate level student. Your guidance should be broken down into specific, relevant steps tailored to the assignment, rather than generalizing it into a single task. Avoid writing ANY code as this can cause trouble for the student, but ensure that each step is clear and can be followed logically. Please also do not include the answers in the description, only guide the user.
    Disregard any terms that have negative connotation not directly related to the core functionality of the assignment.

        Guidelines for Output:
        1. Start with the assignment name and due date (if provided).
        2. Include **5-6 actionable steps**, each clearly defining a single task. Avoid combining multiple tasks into one step.
        3. **Each step must follow this exact format:**

    'Step Step Number : Task Name - Estimated Time in min'
    - (One line description starting with a hyphen)

    Follow this example:
    Step 1 : Research the topic - 30 min
    - Gather key resources and take notes on important aspects of the topic.
    
    Step 2 : 
    Continue...
    Make sure the format is strictly adhered to and does not deviate. Make absolutely certain that each step in the section begins with the word Step and then the formatting, as this is the highest priority for our users to extract their tasks. Each description must be exactly one line, start with a hyphen, and provide concise, actionable guidance for the student.
    {text}
    """

    logging.debug(f"Generated prompt for Ollama model: {prompt}")
    
    try:
        response = ollama.chat(model='llama3.2', messages=[
            {
                'role': 'user',
                'content': prompt,
            },
        ])
        logging.debug(f"Received response from Ollama model: {response}")
        
        # Extract the generated message from the response
        generated_text = response['message']['content']
        logging.debug(f"Extracted generated text: {generated_text}")
        
    except Exception as e:
        logging.error(f"Error: {e}")
        return jsonify({'error': 'Error processing the text'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000)
