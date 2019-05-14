from flask import Flask, render_template, request, jsonify
from flask_jsglue import JSGlue
import os, sys
sys.path.append(os.path.join(os.path.dirname(__file__), "static/decryptr/build"))
from formatting import decrypt_this

app = Flask(__name__)
jsglue = JSGlue(app)
app.config['TEMPLATES_AUTO_RELOAD'] = True

@app.route('/', defaults={"dyn_page": "index"})
@app.route('/<dyn_page>')
def layout_dynamic(dyn_page):
    return render_template('layout.html', data=dyn_page)

@app.route('/static/index')
def index():
    return render_template('index.html')

@app.route('/static/about')
def about():
    return render_template('about.html')

@app.route('/static/telemetry-display')
def telemetry_display():
    return render_template('telemetry-display.html')

@app.route('/static/weather-station')
def weather_station():
    return render_template('weather-station.html')	

@app.route('/static/cloudworks')
def cloudworks():
    return render_template('cloudworks.html')
	
@app.route('/static/life')
def life():
    return render_template('life.html')

@app.route('/static/mandelbrot')
def mandelbrot():
    return render_template('mandelbrot.html')

@app.route('/static/decryptr-port')
def decryptr_port():
    return render_template('decryptr-port.html')

@app.route('/decryptr')
def decryptr():
    return render_template('decryptr.html', deciphered_text="",original_text="",checkbox_status="1")

@app.route('/endpoint',methods=['POST'])
def entry():
    return jsonify({'text': decrypt_this(request.form['text'],request.form['cipher'],request.form['type'],request.form['timeout'])})

if __name__ == '__main__':
    app.run(threaded=True)
