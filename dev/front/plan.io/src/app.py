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

        # Construct a highly detailed and strict prompt
        prompt = f"""
        Please generate a **step-by-step guide** based on the following assignment description. Each step must be clear, specific, and actionable for a beginner-intermediate level student. The generated steps must strictly adhere to the format below, with **no deviations**.

        Guidelines for Output:
        1. Start with the assignment name and due date (if provided).
        2. Include **5-6 actionable steps**, each clearly defining a single task. Avoid combining multiple tasks into one step.
        3. **Each step must follow this exact format:**

           **Step [Step Number] : [Task Name] - [Estimated Time in min]**  
            - [One concise, actionable description starting with a hyphen.]

        Example:
        Step 1 : Research the topic - 30 min  
        - Gather resources and identify important aspects of the topic for further understanding.

        Step 2 : Prepare tools - 20 min  
        - Ensure all necessary hardware and software components are ready for use.

        Additional Guidelines:
        - Maintain uniform formatting for every step.
        - Ensure the description begins with a hyphen and does not exceed one sentence.
        - Do not include any code or direct answers to the assignment.
        - Avoid unnecessary generalizations or extraneous information that isn't directly relevant to the task.

        Assignment: {text}

        ### Output Format:
        The output must consist only of:
        1. Assignment name or number and due date at the top (if available).
        2. Steps written in the exact format described above.
        
        DO NOT ask the user for further clarification. Do not continue the conversation. Work with the information presented and simply present your best estimate of what the steps may look like for that particular labs. If steps are not readily apparent, please make some to guide the user.
        """

        logging.debug(f"Generated prompt: {prompt}")

        # Call OpenAI's GPT-4 API
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        # Extract and format response content
        generated_text = response['choices'][0]['message']['content']
        logging.debug(f"Response from OpenAI: {generated_text}")

        if not generated_text:
            raise ValueError("No content returned from OpenAI.")

        # Format text for bolding key terms
        formatted_text = bold_key_terms(generated_text)

        return jsonify({'modifiedText': formatted_text})

    except Exception as e:
        logging.error(f"Error: {e}")
        return jsonify({'error': 'Error processing the text'}), 500

if __name__ == '__main__':
    app.run(port=5000)
