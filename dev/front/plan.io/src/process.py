from flask import Flask, request, jsonify
import ollama

app = Flask(__name__)

@app.route('/process', methods=['POST'])
def process_text():
    data = request.get_json()
    extracted_text = data.get('text')

    if not extracted_text:
        return jsonify({'error': 'No text provided'}), 400

    try:
        # Define the prompt to be used by ollama
        prompt = f"Please summarize the following text: {extracted_text}"
        
        # Using ollama to process the text
        response = ollama.process(prompt)
        result = response['choices'][0]['text']
        
        return jsonify({'result': result})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
