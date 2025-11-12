import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReviewPage.css";

const ReviewPage = () => {
  const navigate = useNavigate();

  const [ratings, setRatings] = useState({
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0,
  });

  const [thoughtsReplication, setThoughtsReplication] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");

  const handleRatingClick = (criterion, rating) => {
    setRatings((prev) => ({
      ...prev,
      [criterion]: rating,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ratings,
            thoughtsFeedback: thoughtsReplication,
            comments: additionalComments,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Server responded with ${response.status}: ${errorText}`
        );
      }

      // Navigate on successful submission
      navigate("/chat");
    } catch (err) {
      console.error("Review submission failed:", err);
      alert("Something went wrong! Check console for details.");
    }
  };

  const renderStars = (criterion) => {
    return Array.from({ length: 10 }, (_, i) => (
      <span
        key={i}
        className={`star ${i + 1 <= ratings[criterion] ? "active" : ""}`}
        onClick={() => handleRatingClick(criterion, i + 1)}
      >
        ★
      </span>
    ));
  };

  return (
    <div
      className="review-page-wrapper"
      style={{
        backgroundImage:
          "url('/src/components/auth/assets/background (1).jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="review-container">
        <h1 className="review-header">
          Based on your experience, please rate how well Engram could replicate
          your thoughts on the following criteria
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="criteria-section">
            <div className="criterion">
              <h3>Creativity</h3>
              <div className="stars-container">{renderStars("openness")}</div>
            </div>

            <div className="criterion">
              <h3>Clarity</h3>
              <div className="stars-container">
                {renderStars("conscientiousness")}
              </div>
            </div>

            <div className="criterion">
              <h3>Confidence</h3>
              <div className="stars-container">
                {renderStars("extraversion")}
              </div>
            </div>

            <div className="criterion">
              <h3>Kindness</h3>
              <div className="stars-container">
                {renderStars("agreeableness")}
              </div>
            </div>

            <div className="criterion">
              <h3>Calmness</h3>
              <div className="stars-container">
                {renderStars("neuroticism")}
              </div>
            </div>
          </div>

          <div className="text-input-section">
            <div className="text-input-group">
              <label htmlFor="thoughts-replication">
                How well did Engram replicate your thoughts?
              </label>
              <textarea
                id="thoughts-replication"
                value={thoughtsReplication}
                onChange={(e) => setThoughtsReplication(e.target.value)}
                rows="4"
              ></textarea>
            </div>

            <div className="text-input-group">
              <label htmlFor="additional-comments">Any other comments</label>
              <textarea
                id="additional-comments"
                value={additionalComments}
                onChange={(e) => setAdditionalComments(e.target.value)}
                rows="4"
              ></textarea>
            </div>
          </div>

          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewPage;
