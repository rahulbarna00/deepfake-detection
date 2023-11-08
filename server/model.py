import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import EarlyStopping

class DataHandler:
    def __init__(self, path_base):
        self.path_base = path_base

    def load_and_preprocess_data(self):
        frames = ImageDataGenerator(
            rescale=1.0 / 255,
            horizontal_flip=True,
            brightness_range=(0.5, 1),
        )

        train_flow = frames.flow_from_directory(
            self.path_base + 'train/',
            target_size=(256, 256),
            batch_size=30,
            class_mode='binary'
        )

        print("Training Data Shape:", train_flow[0][0].shape)

        test_frames = frames.flow_from_directory(
            self.path_base + 'test/',
            target_size=(256, 256),
            batch_size=30,
            class_mode='binary'
        )

        print("Validation Data Shape:", test_frames[0][0].shape)

        return train_flow, test_frames

class ModelTrainer:
    def __init__(self, train_flow, test_frames):
        self.train_flow = train_flow
        self.test_frames = test_frames

    def build_and_train_model(self):
        model = keras.Sequential([
            layers.Conv2D(32, (3, 3), activation='relu', input_shape=(256, 256, 3)),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),
            
            layers.Conv2D(64, (3, 3), activation='relu'),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),
            
            layers.Conv2D(128, (3, 3), activation='relu'),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),
            
            layers.Conv2D(256, (3, 3), activation='relu'),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),
            
            layers.Conv2D(512, (3, 3), activation='relu'),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),
            
            layers.Flatten(),
            
            layers.Dense(512, activation='relu'),
            
            layers.Dropout(0.5),
            
            layers.Dense(2, activation='softmax')
        ])

        print(model.summary())

        early_stop = EarlyStopping(monitor='val_loss', patience=3)

        model.compile(
            optimizer='adam',
            loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=False),
            metrics=['accuracy']
        )

        history = model.fit(
            self.train_flow,
            epochs=10,
            batch_size=30,
            verbose=2,
            callbacks=[early_stop],
            validation_data=self.test_frames,
        )

        return model

if __name__ == '__main__':
    path_base = 'dataset_train_test/'

    data_handler = DataHandler(path_base)
    train_flow, test_frames = data_handler.load_and_preprocess_data()

    model_trainer = ModelTrainer(train_flow, test_frames)
    trained_model = model_trainer.build_and_train_model()

    trained_model.save("model/models" + ".h5", save_format='h5')
