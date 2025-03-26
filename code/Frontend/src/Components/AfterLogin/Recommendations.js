import React, { useEffect, useState } from "react";
import { FiInfo } from "react-icons/fi";
import './Styles/Recommendations.css';

// Retail Retention Offer Images
import retailImage1 from './images/retail_rentention_1.png';
import retailImage2 from './images/retail_rentention_2.jpg';
import retailImage3 from './images/retail_rentention_3.jpg';
import retailImage4 from './images/retail_retention_4.jpg';
import retailImage5 from './images/retail_retention_5.jpg';
import retailImage6 from './images/retail_rentention_6.png';

import retail_loyalty_1 from './images/retail_loyalty_1.jpg';
import retail_loyalty_2 from './images/retail_loyalty_2.jpg';
import retail_loyalty_3 from './images/retail_loyalty_3.jpg';


// commercial Retention Offer Images
import commercial_rentention_1 from './images/commercial_retention_1.jpg';
import commercial_rentention_2 from './images/commercial_retention_2.jpg';
import commercial_rentention_3 from './images/commercial_retention_3.jpg';
import commercial_rentention_4 from './images/commercial_retention_4.jpg';
import commercial_rentention_5 from './images/commercial_retention_5.jpg';
import commercial_rentention_6 from './images/commercial_retention_6.jpg';
import commercial_rentention_7 from './images/commercial_retention_7.jpg';

// commercial Loyalty Offer Images
import commercial_loyalty_1 from './images/commercial_loyalty_1.jpg';
import commercial_loyalty_2 from './images/commercial_loyalty_2.jpg';
import commercial_loyalty_3 from './images/commercial_loyalty_3.jpg';

const retentionOfferImageMap = {
    "Bonus Rewards: Extra cashback or reward points for 3 months": retailImage1,
    "Rate Matching: Offer a reduced interest rate or refinancing options": retailImage2,
    "Fee Waivers: 6-month waiver on maintenance/ATM/transfer fees": retailImage3,
    "Dedicated Support Line: Exclusive priority customer service for select users": retailImage4,
    "Premium Digital Banking: Free upgrade to premium online banking features": retailImage5,
    "Account Upgrade: Free upgrade to a higher-tier account with better perks": retailImage6,

    "Rate Adjustment: Offer a lower interest rate or refinancing options": commercial_rentention_1,
    "Credit Line Increase: Offer a higher credit limit with flexible terms": commercial_rentention_2,
    "Priority Processing: Faster payment settlements for corporate clients": commercial_rentention_3,
    "Exclusive Forex Rates: Provide lower foreign exchange fees and better rates": commercial_rentention_4,
    "Custom Loan Plans: Offer flexible repayment options and deferred payments": commercial_rentention_5,
    "Fee Waivers: 6-month waiver on business transaction fees": commercial_rentention_6,
    "Corporate Digital Banking Suite: Free upgrade to premium online banking features": commercial_rentention_7,

    "Bonus Rewards: Get 10% extra reward points or cashback for the next 3 months.": retail_loyalty_1,
    "Exclusive App Perks: Early access to new features & premium app support.": retail_loyalty_2,
    "Referral Bonus: Earn rewards for referring friends & family.": retail_loyalty_3,


    "Corporate Account Perks: Waived transaction fees for 3 months." : commercial_loyalty_1,
    "Business Growth Incentives: Access to premium business banking features.": commercial_loyalty_2,
    "Corporate Loyalty Program: Discounts on payroll services or business loans.": commercial_loyalty_3


  };



  

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const retailImages = [retailImage1, retailImage2, retailImage3, retailImage4, retailImage5, retailImage6];

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');

    const fetchRecommendation = async () => {
      try {
        const response = await fetch("http://localhost:8000/llmOffers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customer_id: storedUsername }),
        });

        if (!response.ok) {
          console.warn("API Error: ", response.statusText);
          setLoading(false);
          return;
        }

        const data = await response.json();
        console.log("Fetched Offers:", data);

        // ✅ Direct assignment
        setRecommendations(data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching:", error);
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 flex flex-col items-center libre-baskerville-regular">
      <h1 className="logo-name p-4">Personalized Offers</h1>

      {loading ? (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '24rem' }}>
          <div className="spinner-border text-primary mb-4" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-secondary libre-baskerville-regular">Fetching personalized offers for you...</p>
        </div>
      ) : (
        <>
          {recommendations.length > 0 ? (
            <div className="container">
              <div className="row justify-content-center">
                {recommendations.map((rec, index) => (
                  <div className="col-md-4 mb-5 d-flex justify-content-center" key={index}>
                    <div className="bg-white shadow-lg rounded-xl p-4 flex flex-col items-center relative hover:shadow-2xl transition transform hover:-translate-y-1 duration-300 ease-in-out">
                      {/* Image */}
                      <img
  src={retentionOfferImageMap[rec.offer[1]?.name] || retailImage1}  // fallback to retailImage1 if no match
  width={350}
                        height={350}
                        alt={`Offer ${index + 1}`}
                        className="object-contain rounded-lg border mb-4"
                      />

                      {/* Offer Details */}
                      {/* <h2 className="text-lg font-semibold text-gray-800 mb-2 text-center">Customer ID: {rec.customer_id}</h2> */}
                      <p className="text-sm text-center mb-1">Sentiment Score: {rec.overall_sentiment_score}</p>
                      <p className="text-sm text-center mb-2 font-bold">Offer: {rec.offer[1]?.name}</p>

                      {/* Info Icon */}
                      <div
                        className="relative flex justify-center"
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        <FiInfo className="text-blue-700 w-5 h-5 cursor-pointer hover:text-blue-500" />
                        {hoveredIndex === index && (
                          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white shadow-md rounded-md p-2 w-64 text-xs text-gray-700 z-10">
                            <span className="font-semibold text-blue-800">Reason:</span> {rec.offer[2]?.reason}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center mt-4">No personalized offers available.</p>
          )}
        </>
      )}
    </div>
  );
}
