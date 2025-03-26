import React, { useEffect, useState } from "react";
import { FiInfo } from "react-icons/fi";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Styles/Offers.css';

import knowledgeImage from "./images/knowledge.jpg";

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');

    const fetchRecommendations = async () => {
      try {
        const response = await fetch("http://localhost:8000/getKnowledge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customer_id: storedUsername }),
        });

        if (!response.ok) throw new Error("API Error");
        const data = await response.json();
        setRecommendations(Array.isArray(data) ? data : []);
      } catch {
        setRecommendations([
          { name: "Nova Personal Loan", why: "Eligible for low-interest loan." },
          { name: "Nova Premium Savings Debit Card", why: "Supports premium banking." },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 flex flex-col items-center font-sans">
      <h1 className="logo-name p-4">Banking Insights Just for You</h1>
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Fetching personalized recommendations...</p>
        </div>
      ) : (
        <div className="max-w-2xl w-full bg-white shadow-xl rounded-lg p-6 text-center">
          <img
            src={knowledgeImage}
            width={500}
            height={350}
            alt="Recommendation"
            className="mx-auto rounded-lg border mb-4"
          />
          
          {/* Added comment banner */}
          {recommendations.length > 0 && recommendations[0].comment && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg text-left">
              <div className="flex items-start">
                <div className="flex-1">
                  <p className="text-gray-800 italic" style={{fontSize:'1.2em', fontStyle:'italic'}}> <strong style={{fontSize:'1.3em'}}>Comment:</strong> {recommendations[0].comment}</p>
                  <div className="mt-2 flex items-center">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded" style={{fontSize:'1.2em'}}>
                      <strong style={{fontSize:'1.3em'}}> Platform:</strong> {recommendations[0].platform || 'Social Media'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {recommendations.map((rec, index) => (
            <div key={index} className="mb-4 bg-gray-100 p-4 rounded-lg shadow-md">
              <h6 className="text-lg top-6 font-semibold text-gray-800" style={{fontSize:'1.2em'}}><strong style={{fontSize:'1.3em'}}> Trivia: </strong>{rec.knowledge_recommendation}</h6>
              <div
                className="relative mt-2 inline-block cursor-pointer"
                style={{fontSize:'1.3em'}}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <FiInfo className="text-blue-600 w-5 h-5 inline-block" />
                {hoveredIndex === index && (
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white shadow-lg p-2 rounded-md text-sm w-56 border border-gray-300">
                    <strong>Recommended Product:</strong> {rec.product_recommendation}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}