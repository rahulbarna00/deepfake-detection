import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn import metrics
from sklearn.model_selection import train_test_split
import cv2

class DataHandler:
    def __init__(self, path_base):
        self.path_base = path_base

    def load_test_data(self):
        image_gen = ImageDataGenerator(
            rescale=1.0 / 255,
            horizontal_flip=True,
            brightness_range=(0.7, 1),
        )

        test_flow = image_gen.flow_from_directory(
            self.path_base + 'test/',
            target_size=(256, 256),
            batch_size=1,
            shuffle=False,
            class_mode='binary'
        )

        return test_flow

class ModelEvaluator:
    def __init__(self, model_path, test_data):
        self.model_path = model_path
        self.test_data = test_data

    def evaluate_model(self):
        model = keras.models.load_model(self.model_path)

        y_pred = model.predict(self.test_data)
        y_test = self.test_data.classes

        y_pred = [int(np.argmax(element)) for element in y_pred]

        roc_auc = metrics.roc_auc_score(y_test, y_pred)
        ap_score = metrics.average_precision_score(y_test, y_pred)

        classification_report = metrics.classification_report(y_test, y_pred)

        scores = model.evaluate(self.test_data)
        return roc_auc, ap_score, classification_report, scores

if __name__ == '__main__':
    path_base = 'dataset_train_test/'

    data_handler = DataHandler(path_base)
    test_data = data_handler.load_test_data()

    model_evaluator = ModelEvaluator("model/model.h5", test_data)
    roc_auc, ap_score, classification_report, scores = model_evaluator.evaluate_model()

    print("ROC AUC Score:", roc_auc)
    print("AP Score:", ap_score)
    print()
    print(classification_report)
