# Flask for back-end page serving, render_template for 
# serving pages, request and jsonify for Decryptr dynamic loading
from flask import Flask, render_template, request, jsonify

# JS Glue used to retrieve Flask dynamic URLs within JS files
from flask_jsglue import JSGlue

# SSLify required to reroute user to HTTPS address in session
# if user visits website using insecure HTTP address
from flask_sslify import SSLify

# Dynamic path used to support importing from subdirectories
# across multiple platforms (tested between Windows and Linux)
import os, sys
sys.path.append(os.path.join(os.path.dirname(__file__), "static/decryptr/build"))

# Function to deal with Decryptr stuff all at once far away from
# mine eyes
from formatting import decrypt_this

# Initialise flask app!
app = Flask(__name__)

# TODO Renew certificate because it expired!
# Only trigger SSLify if the app is running on Heroku since I
# have no idea how to do SSL redirects properly there
# if 'DYNO' in os.environ:
#     sslify = SSLify(app)

# Initialise JS Glue
jsglue = JSGlue(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

# ========== GUIDES ==========

@app.route('/raytracer')
def ray_tracer():
    return render_template('raytracer.html')

# ========== PROJECTS ==========

@app.route('/telemetry-display')
def telemetry_display():
    return render_template('telemetry-display.html')

@app.route('/weather-station')
def weather_station():
    return render_template('weather-station.html')	

@app.route('/cloudworks')
def cloudworks():
    return render_template('cloudworks.html')
	
@app.route('/life')
def life():
    return render_template('life.html')

@app.route('/mandelbrot')
def mandelbrot():
    return render_template('mandelbrot.html')

@app.route('/decryptr-port')
def decryptr_port():
    return render_template('decryptr-port.html')

# Special decryptr routes -- DO NOT TOUCH

@app.route('/decryptr')
def decryptr():
    return render_template('decryptr.html', deciphered_text="",original_text="",checkbox_status="1")

@app.route('/endpoint',methods=['POST'])
def entry():
    return jsonify({'text': decrypt_this(request.form['text'],request.form['cipher'],request.form['type'],request.form['timeout'])})

# Run threaded in production!
if __name__ == '__main__':
    app.run(threaded=True)
