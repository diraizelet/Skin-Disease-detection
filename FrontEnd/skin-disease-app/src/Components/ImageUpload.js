import { useState } from "react";
import axios from "axios";

export default function ImageUpload() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setPrediction(null);
    }
  };

  const handleUpload = async () => {
    if (!image) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post("http://localhost:5000/predict", formData);
      setPrediction(response.data);
    } catch (error) {
      console.error("Error uploading image", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white shadow-lg rounded-lg">
      <input type="file" accept="image/*" onChange={handleImageChange} className="mb-4" />
      {preview && <img src={preview} alt="Preview" className="w-64 h-64 object-cover rounded-lg mb-4" />}
      <button
        onClick={handleUpload}
        disabled={!image || loading}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? "Processing..." : "Upload & Predict"}
      </button>
      {prediction && (
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold">Prediction: {prediction.prediction}</p>
          <p className="text-sm text-gray-600">Confidence: {prediction.confidence}%</p>
        </div>
      )}
    </div>
  );
}
