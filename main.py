import cv2
import os

def frames_generate(input_folder, output_base_folder):
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    desired_width = 200
    desired_height = 200

    if not os.path.exists(output_base_folder):
        os.makedirs(output_base_folder)

    for filename in os.listdir(input_folder):
        if filename.endswith(".mp4"):
            video_path = os.path.join(input_folder, filename)

            vid = cv2.VideoCapture(video_path)
            currentframe = 0

            while True:
                success, frame = vid.read()

                if success:
                    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

                    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)

                    for (x, y, w, h) in faces:
                        expansion_factor = 0
                        expanded_x = max(0, x - int(w * expansion_factor))
                        expanded_y = max(0, y - int(h * expansion_factor))
                        expanded_w = min(frame.shape[1] - 1, x + w + int(w * expansion_factor)) - expanded_x
                        expanded_h = min(frame.shape[0] - 1, y + h + int(h * expansion_factor)) - expanded_y

                        face_frame = frame[expanded_y:expanded_y + expanded_h, expanded_x:expanded_x + expanded_w]

                        face_frame = cv2.resize(face_frame, (desired_width, desired_height))

                        name = os.path.join(output_base_folder, f'{filename}_frame{currentframe}.jpg')

                        cv2.imwrite(name, face_frame)
                        currentframe += 1

                    if cv2.waitKey(1) & 0xFF == 27:
                        break

                else:
                    break

            vid.release()
            cv2.destroyAllWindows()



inp_fol_test_real = 'dataset_train_test/test_videos/real'
out_fol_test_real = 'dataset_train_test/test/real'

inp_fol_test_fake = 'dataset_train_test/test_videos/fake'
out_fol_test_fake = 'dataset_train_test/test/fake'

inp_fol_train_real = 'dataset_train_test/training_videos/real'
out_fol_train_real = 'dataset_train_test/train/real'

inp_fol_train_fake = 'dataset_train_test/training_videos/fake'
out_fol_train_fake = 'dataset_train_test/train/fake'


frames_generate(inp_fol_train_real, out_fol_train_real)
frames_generate(inp_fol_train_fake, out_fol_train_fake)

frames_generate(inp_fol_test_real, out_fol_test_real)
frames_generate(inp_fol_test_real, out_fol_test_real)