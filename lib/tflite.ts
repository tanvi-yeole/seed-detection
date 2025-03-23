import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as tf from "@tensorflow/tfjs";

let model: tf.GraphModel | null = null;

// Load the TensorFlow.js model
export async function loadModel(): Promise<tf.GraphModel> {
  if (!model) {
    // Ensure TensorFlow.js is ready
    await tf.ready();
    
    // Load model from the public directory
    // Note: You'll need to convert your TFLite model to TF.js format
    // and place it in the public/model directory
    try {
      model = await tf.loadGraphModel('/model/model.json');
      console.log("Model loaded successfully");
    } catch (error) {
      console.error("Failed to load model:", error);
      throw new Error("Failed to load the seed classification model");
    }
  }
  return model;
}

// Run inference on an image tensor
export async function predict(imageTensor: tf.Tensor): Promise<{ seed: string; confidence: number }> {
  if (!model) {
    model = await loadModel();
  }

  // Preprocess the tensor if needed
  // This step depends on your model's expected input format
  const preprocessedTensor = tf.tidy(() => {
    // Resize and normalize the image tensor
    return imageTensor
      .resizeNearestNeighbor([224, 224]) // Adjust size to match your model's expected input
      .toFloat()
      .div(255.0)
      .expandDims(0);
  });

  try {
    // Run the prediction
    const predictions = await model.predict(preprocessedTensor) as tf.Tensor;
    
    // Convert prediction to usable format
    const probabilities = await predictions.data();
    
    // Get max probability and its index
    let maxProb = 0;
    let maxIndex = 0;
    
    for (let i = 0; i < probabilities.length; i++) {
      if (probabilities[i] > maxProb) {
        maxProb = probabilities[i];
        maxIndex = i;
      }
    }

    // Define your seed classes
    const seedClasses = ["corn", "tamarind", "groundnut", "wheat", "soybean"];
    
    // Clean up tensors to prevent memory leaks
    tf.dispose([preprocessedTensor, predictions]);
    
    return { 
      seed: seedClasses[maxIndex], 
      confidence: maxProb 
    };
  } catch (error) {
    // Clean up tensors in case of error
    tf.dispose(preprocessedTensor);
    console.error("Prediction error:", error);
    throw new Error("Failed to analyze the image");
  }
}

// Helper function for classifying an image from a URL or File
export async function classifyImage(imageSource: File | string): Promise<{ seed: string; confidence: number }> {
  try {
    // If input is a file, convert to data URL
    let imageUrl = typeof imageSource === 'string' ? imageSource : URL.createObjectURL(imageSource);
    
    // Load image and convert to tensor
    const img = await loadImageFromUrl(imageUrl);
    const tensor = tf.browser.fromPixels(img);
    
    // Run prediction
    const result = await predict(tensor);
    
    // Clean up
    tensor.dispose();
    if (typeof imageSource !== 'string') {
      URL.revokeObjectURL(imageUrl);
    }
    
    return result;
  } catch (error) {
    console.error("Error classifying image:", error);
    throw error;
  }
}

// Helper function to load an image from a URL
async function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

