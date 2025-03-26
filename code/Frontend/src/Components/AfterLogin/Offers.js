import React, { useEffect, useState } from "react";
import { FiInfo } from "react-icons/fi";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Styles/Offers.css'; // Custom CSS for fonts & extras

// Import images
import BasicCard from "./images/Basic Card.webp";
import EliteCard from "./images/Elite Card.webp";
import NovaTravelEliteCreditCard from "./images/travelElite.jpeg";
import NovaTravelBasicCreditCard from "./images/travelBasic.jpeg";
import NovaPrestigeLuxuryCreditCard from "./images/prestigeLuxuryCreditCard.jpeg";
import NovaGourmetDiningCreditCard from "./images/Nova Gourmet Dining Debit.jpg";
import NovaFoodieDiningCreditCard from "./images/NovaFoodieDiningCreditCard.jpeg";
import NovaCorporatePlatinumCreditCard from "./images/NovaCorporatePlatinumCreditCard.jpeg";
import NovaBusinessEssentialsCreditCard from "./images/NovaBusinessEssentialsCreditCard.jpeg";
import NovaPremiumShoppingCreditCard from "./images/NovaPremiumShoppingCreditCard.jpeg";
import NovaEverydayShoppingCreditCard from "./images/NovaEverydayShoppingCreditCard.jpeg";
import NovaCinemaxEntertainmentDebitCard from "./images/NovaCinemaxEntertainmentDebitCard.jpeg";
import NovaCorporateExpenseDebitCard from "./images/NovaCorporateExpenseDebitCard.jpeg";
import NovaBusinessEssentialsDebitCard from "./images/Business Essential.jpg";
import NovaMutualFundAdvisory from "./images/NovaMutualFundAdvisory.jpeg";
import NovaBusinessProtectionPlan from "./images/NovaBusinessProtectionPlan.jpeg";
import NovaPremiumSavingsDebitCard from "./images/NovaPremiumSavingsDebitCard.jpeg";
import NovaBasicSavingsDebitCard from "./images/NovaBasicSavingsDebitCard.jpeg";
import NovaGlobalTravelDebit from "./images/Nova Global Travel Debit.jpg";
import NovaBusinessAccount from "./images/NovaBusinessAccount.jpeg";

import DomesticTravel from "./images/Domestic Travel.jpg";
import EverydayDiningDebit from "./images/Everyday Dining Debit.jpg";
import NovaGourmetDiningDebit from "./images/Nova Gourmet Dining Debit.jpg";
import PersonalLoan from "./images/_d4279f33-df6b-4b36-b410-e4fa9b01a540.jpg";

// Image Map
const imageMap = {
  "Nova Education Basic Credit Card": BasicCard,
  "Nova Education Elite Credit Card": EliteCard,
  "Nova Travel Elite Credit Card": NovaTravelEliteCreditCard,
  "Nova Travel Basic Credit Card": NovaTravelBasicCreditCard,
  "Nova Prestige Luxury Credit Card": NovaPrestigeLuxuryCreditCard,
  "Nova Gourmet Dining Credit Card": NovaGourmetDiningCreditCard,
  "Nova Foodie Dining Credit Card": NovaFoodieDiningCreditCard,
  "Nova Corporate Platinum Credit Card": NovaCorporatePlatinumCreditCard,
  "Nova Business Essentials Credit Card": NovaBusinessEssentialsCreditCard,
  "Nova Premium Shopping Credit Card": NovaPremiumShoppingCreditCard,
  "Nova Everyday Shopping Credit Card": NovaEverydayShoppingCreditCard,
  "Nova Premium Savings Debit Card" : NovaPremiumSavingsDebitCard,
  "Nova Basic Savings Debit Card": NovaBasicSavingsDebitCard,
  "Nova Cinemax Entertainment Debit Card": NovaCinemaxEntertainmentDebitCard,
  "Nova Gourmet Dining Debit Card": NovaGourmetDiningDebit,
  "Nova Everyday Dining Debit Card": EverydayDiningDebit,
  "Nova Corporate Expense Debit Card": NovaCorporateExpenseDebitCard,
  "Nova Business Essentials Debit Card": NovaBusinessEssentialsDebitCard,
  "Nova Global Travel Debit Card" : NovaGlobalTravelDebit,
  "Nova Domestic Travel Debit Card": DomesticTravel,
  "Nova Personal Loan": PersonalLoan,
  "Nova Business Account": NovaBusinessAccount,
  "Nova Mutual Fund Advisory": NovaMutualFundAdvisory,
  "Nova Business Protection Plan": NovaBusinessProtectionPlan
};

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username')
        const category = "Retail";

    const fetchRecommendations = async () => {
      try {
        const response = await fetch("http://localhost:8000/llmRecommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customer_id: storedUsername, category }),
        });

        if (!response.ok) {
          console.warn("API Error: ", response.statusText);
          fallbackDummy();
          return;
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setOffers(data);
        } else {
          fallbackDummy();
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        fallbackDummy();
        setLoading(false);
      }
    };

    const fallbackDummy = () => {
      const dummyOffers = [
        { name: "Nova Personal Loan", why: "Eligible for low-interest personal loan." },
        { name: "Nova Premium Savings Debit Card", why: "Supports premium banking needs." },
        { name: "Nova Business Essentials Credit Card", why: "Perfect for small business transactions." },
      ];
      setOffers(dummyOffers);
    };

    fetchRecommendations();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 flex flex-col items-center libre-baskerville-regular">
      <h1 className="logo-name p-4">Recommended Products</h1>

      {loading ? (
  <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '24rem' }}>
    <div className="spinner-border text-primary mb-4" role="status" style={{ width: '3rem', height: '3rem' }}>
      <span className="visually-hidden">Loading...</span>
    </div>
    <p className="text-secondary libre-baskerville-regular">Fetching the best offers tailored just for you...</p>
  </div>
) : (

        <div className="container">
          <div className="row justify-content-center">
            {offers.slice(0, 3).map((offer, index) => (
              <div className="col-md-4 mb-5 d-flex justify-content-center" key={index}>
                <div className="bg-white shadow-lg rounded-xl p-4 flex flex-col items-center relative hover:shadow-2xl transition transform hover:-translate-y-1 duration-300 ease-in-out">
                  {imageMap[offer.name] ? (
                    <img
                      src={imageMap[offer.name]}
                      width={350}
                      height={350}
                      alt={offer.name}
                      className="object-contain rounded-lg border mb-4"
                    />
                  ) : (
                    <div className="text-gray-400 mb-4">No Image</div>
                  )}

                  <h2 className="text-lg font-semibold text-gray-800 mb-3 text-center">{offer.name}</h2>

                  <div
                    className="relative flex justify-center"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <FiInfo className="text-blue-700 w-5 h-5 cursor-pointer hover:text-blue-500" />
                    {hoveredIndex === index && (
                      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white shadow-md rounded-md p-2 w-64 text-xs text-gray-700 z-10">
                        <span className="font-semibold text-blue-800">Why:</span> {offer.why}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}