### Training Guide (Developers)

-   Ensure that your dataset folder contains classes and the images under that class folder.
-   Go to scripts/split.js and change the source path (DATASET_PATH) of your dataset.
-   Create a folder data under tfjs-model-training folder.
-   After that run the split.js and it will split your dataset into train, val, and test folders.

### Folder Structure
 - DATASET_PATH
    - dataset/class1/images
    - dataset/class2/images
    - dataset/class3/images
 - DATA_PATH
    - data/test/classes
    - data/train/classes
    - data/val/classes