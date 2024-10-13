from flask import Flask, request, jsonify
from flask_cors import CORS
import ollama  # Import the ollama library
import logging
import nltk
import re

# Download necessary NLTK data
nltk.download('punkt')

def bold_key_terms(text):
    # Define the key terms we want to bold
    key_terms = ['step', 'due date', 'assignment', 'complete', 'finish', 'submit', 'Total estimated time:']
    
    # Use regex to search for the terms and surround them with <b> tags for bold in HTML
    text = re.sub(r'(step\s*\d+)', r'<b>\1</b>', text, flags=re.IGNORECASE)
    
    # Use regex to search for the remaining key terms and surround them with <b> tags
    for term in key_terms:
        # Match terms in case-insensitive mode (excluding "step" because it's already handled)
        if term != 'step':
            pattern = re.compile(rf'\b({term})\b', re.IGNORECASE)
            text = pattern.sub(r'<b>\1</b>', text)
    
    return text

# Set up logging for debug statements
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/process-text', methods=['POST'])
def process_text():
    # Get the JSON data from the request
    data = request.get_json()
    logging.debug(f"Received JSON data: {data}")

    text = data.get('text', '')
    logging.debug(f"Extracted text: {text}")

    # Prepare the chat request to the Ollama model with the text included in the prompt
    prompt = f"Given the following instructions, please generate 5-6 detailed and actionable steps, along with an estimated time for each step, designed for a beginner to intermediate level student. Your guidance should be broken down into specific, relevant steps tailored to the assignment, rather than generalizing it into a single task. Avoid writing ANY code as this can cause trouble for the student but ensure that each step is clear and can be followed logically. At the top, state the assignment name or number, and if available, include the due date beneath. Each step description must begin with '-' and be one concise, descriptive line. Do not use the word 'step' in this description. Provide enough detail to guide the student through each stage of the process. DO NOT write any code for the student. Steps must be in the following format: 'Step (Step Number) - (Step Title) (Amount of time to complete)' {text}"
    logging.debug(f"Generated prompt for Ollama model: {prompt}")
    
    try:
        response = ollama.chat(model='llama3.1', messages=[
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
        logging.error(f"Error during Ollama chat call: {e}")
        return jsonify({'error': 'Error processing text with Ollama'}), 500
    
    # Insert a newline (\n) before every occurrence of ***
    formatted_text = generated_text.replace('***', '\n***')
    logging.debug(f"Formatted text after adding newlines before ***: {formatted_text}")

    # Bold the key terms in the generated text
    modified_text_with_bold = bold_key_terms(formatted_text)
    logging.debug(f"Text after bolding key terms: {modified_text_with_bold}")
    
    # Return the modified text with bolded terms as a JSON response
    return jsonify({'modifiedText': modified_text_with_bold})

if __name__ == '__main__':
    app.run(port=3000)  # Run the app on port 3000
