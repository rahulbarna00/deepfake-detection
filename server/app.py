from flask import Flask, request, jsonify
from flask_cors import CORS
from web_video import frames_generate
import os
import random
import numpy as np
import tensorflow as tf
from tensorflow import keras
from PIL import Image
import shutil

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
UPLOAD_FOLDER = 'User_Video'
app.config['User_Video'] = UPLOAD_FOLDER
model = keras.models.load_model("../model/model.h5")
target_size=(256,256)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
Photos_Folder=''
def generate_random_filename():
    return str(random.randint(10000, 99999))

@app.before_request
def check_abort_request():
    if request.headers.get('X-Abort-Request') == 'true':
        if Photos_Folder:
            os.rmdir(Photos_Folder)
        # Handle the abort request on the server side
        # In this example, we simply print a message
        print("Abort request received on the server")
        
@app.route("/")
def hello_world():
   return jsonify({"message": "heelooo"}), 200
     
def image_process(directory_path):
    image_paths = [f for f in os.listdir(directory_path) if f.endswith(('.JPG','.jpg', '.png', '.jpeg'))]
    data_frame =[]
    for image_path in image_paths:
        full_path = os.path.join(directory_path, image_path)
        img = Image.open(full_path)
        img = img.resize(target_size)
        img_array = np.array(img)
        normalized_image_data = (img_array * 255).astype(np.uint8)
        data_frame.append(normalized_image_data)
    return data_frame

@app.route("/detect", methods=['POST'])
def upload_video():
    if request.method == 'POST':
        print("helooo")
        if 'file' not in request.files:
            resp = jsonify({"message":"Send proper Video"})
            resp.status_code=300
            return resp
        else:
            file = request.files['file']
            random_filename = generate_random_filename()
            file_path = os.path.join(app.config['User_Video'], f'{random_filename}.mp4')
            file.save(file_path)
            Photos_Folder = f"videos\out\{random_filename}"
            total_frames = frames_generate(file_path,Photos_Folder,random_filename)
            face_count = len([f for f in os.listdir(Photos_Folder)])
            if not os.listdir(Photos_Folder):
                os.rmdir(Photos_Folder)
                result = {'code': 2 ,
                    'result':{
                    'message':'No Face Detected in Your Video. We Detect DeepFake Based on Face, please provide some videos Which have Faces.',
                     "Frames":total_frames,
                    "Faces":face_count,
                    "Deepfake":0,
                    "Real":0
                }}
                print(result)
                return jsonify(result), 300
            test_flow = image_process(Photos_Folder)
            test_flow = np.array(test_flow)
            pred_data=test_flow/255
            y_pred = model.predict(pred_data)
            y_pred_final = [int(np.argmax(element)) for element in y_pred]
            count_0 = y_pred_final.count(0)
            count_1 = y_pred_final.count(1)
            total_samples = len(y_pred_final)
            percentage_0 = (count_0 / total_samples) * 100
            percentage_1 = (count_1 / total_samples) * 100
            
            print(percentage_0)
            print(percentage_1)
            try:
                shutil.rmtree(Photos_Folder)
            except OSError as e:
                print(f"Error removing directory {Photos_Folder}: {e}")
            if os.path.exists(file_path):
                os.remove(file_path)
                
            result={}
            if percentage_1 >= 50:
                result = {'code': 0,
                          'result':{
                    'message':'The video Is Authentic',
                    "Frames":total_frames,
                    "Faces":face_count,
                    "Deepfake":percentage_0,
                    "Real":percentage_1
                }}
                print(result)
            elif percentage_1 < 50:
                result = {'code': 1,
                          'result':{
                    'message':'The video Is Deepfake',
                    "Frames":total_frames,
                    "Faces":face_count,
                    "Deepfake":percentage_0,
                    "Real":percentage_1
                }}
                print(result)
            return jsonify(result), 200
    else:
        return 'This route only accepts POST requests', 403
    
if __name__ == '__main':
    app.run()
