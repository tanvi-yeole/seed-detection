import * as tf from "@tensorflow/tfjs";
import { loadModel as loadTFLiteModel, predict } from "./tflite";

/**
 * Prepares an image for prediction and returns the result
 * @param imageSource - Can be a file, blob URL, or data URL
 * @returns Promise with seed type and confidence
 */
export async function classifySeed(
  imageSource: File | string
): Promise<{ seed: string; confidence: number }> {
  try {
    // If input is a file, convert to data URL
    const imageDataUrl = 
      typeof imageSource !== "string" 
        ? await fileToDataUrl(imageSource) 
        : imageSource;
    
    // Create image element from the data URL
    const img = await loadImage(imageDataUrl);
    
    // Convert image to tensor
    const imageTensor = tf.tidy(() => {
      // Read the image data
      const tensor = tf.browser.fromPixels(img)
        // Resize to the expected input size for the model
        .resizeNearestNeighbor([224, 224])
        // Convert to float
        .toFloat()
        // Normalize pixel values to [0,1]
        .div(tf.scalar(255))
        // Add batch dimension
        .expandDims(0);
      
      return tensor;
    });
    
    // Run prediction
    const result = await predict(imageTensor);
    
    // Clean up tensor to prevent memory leaks
    imageTensor.dispose();
    
    return result;
  } catch (error) {
    console.error("Error classifying seed:", error);
    throw new Error(`Failed to classify seed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Converts a File object to a data URL
 */
async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Creates and loads an image from a URL
 */
async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Handle CORS issues
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
}

/**
 * Preloads the TFLite model to reduce initial prediction time
 */
export async function preloadModel(): Promise<void> {
  try {
    await loadTFLiteModel();
    console.log("TFLite model preloaded successfully");
  } catch (error) {
    console.error("Failed to preload TFLite model:", error);
  }
}