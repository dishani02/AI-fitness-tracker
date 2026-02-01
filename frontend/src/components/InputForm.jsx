import axios from "axios";
import { useState } from "react";

export default function InputForm({ onGenerate }) {
  const [form, setForm] = useState({
    age: "",
    weight: "",
    height: "",
    activity: "medium",
    goal: "maintain",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const submitData = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/ai/generate",
        form
      );
      onGenerate(res.data);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="form-container">
      <div className="form-header">
        <div className="step-indicator">
          <div className="step-number">1</div>
          <div className="step-line"></div>
          <div className="step-number inactive">2</div>
          <div className="step-line"></div>
          <div className="step-number inactive">3</div>
        </div>
        <h2 className="form-title">Create Your Fitness Plan</h2>
        <p className="form-subtitle">
          Tell us about yourself so we can create a personalized plan tailored to your goals
        </p>
      </div>

      <form className="modern-form" onSubmit={submitData}>
        <div className="form-section">
          <h3 className="section-title">Personal Information</h3>
          <div className="form-row">
            <div className="form-field">
              <label className="field-label">Age</label>
              <input
                type="number"
                className="form-input"
                placeholder="Enter your age (13-120)"
                required
                value={form.age}
                onChange={handleChange("age")}
                min="13"
                max="120"
              />
            </div>

            <div className="form-field">
              <label className="field-label">Weight (kg)</label>
              <input
                type="number"
                className="form-input"
                placeholder="Enter your weight (20-300 kg)"
                required
                value={form.weight}
                onChange={handleChange("weight")}
                min="20"
                max="300"
                step="0.1"
              />
            </div>

            <div className="form-field">
              <label className="field-label">Height (cm)</label>
              <input
                type="number"
                className="form-input"
                placeholder="Enter your height (50-250 cm)"
                required
                value={form.height}
                onChange={handleChange("height")}
                min="50"
                max="250"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Your Goals & Lifestyle</h3>
          <div className="form-row">
            <div className="form-field">
              <label className="field-label">Activity Level</label>
              <select
                className="form-select"
                value={form.activity}
                onChange={handleChange("activity")}
                required
              >
                <option value="low">Low - Sedentary</option>
                <option value="medium">Medium - Active</option>
                <option value="high">High - Very Active</option>
              </select>
            </div>

            <div className="form-field">
              <label className="field-label">Fitness Goal</label>
              <select
                className="form-select"
                value={form.goal}
                onChange={handleChange("goal")}
                required
              >
                <option value="lose">Lose Weight</option>
                <option value="maintain">Maintain Weight</option>
                <option value="gain">Gain Weight</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <div className="form-actions">
          <button
            className={`submit-button ${loading ? "loading" : ""}`}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Generating your personalized plan...
              </>
            ) : (
              "Generate My Plan"
            )}
          </button>
          <p className="form-note">
            Your data is secure and will only be used to generate your plan
          </p>
        </div>
      </form>
    </section>
  );
}
