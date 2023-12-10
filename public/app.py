from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/send-transcription', methods=['POST'])
def receive_transcription():
    data = request.get_json()
    transcription = data.get('transcription')
    # Process the received transcription data as needed (e.g., store it in a database)
    print("Received transcription:", transcription)
    return 'Transcription received successfully'

if __name__ == '__main__':
    app.run(debug=True)