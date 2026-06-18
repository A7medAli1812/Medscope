import React, { useEffect, useState } from "react";
import "../styles/BloodBank.css";
import { getBloodBank, increaseBlood, decreaseBlood } from "../services/bloodBank";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";

const BloodBank = () => {
  const [bloodData, setBloodData] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBlood();
  }, []);

  const fetchBlood = async () => {
    try {
      setLoading(true);
      const res = await getBloodBank();
      setBloodData(res.data);
    } catch (err) {
      toast.error("Failed to load blood data");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 increase
  const handleIncrease = async (id) => {
    try {
      setLoadingIds((prev) => [...prev, id]);

      await increaseBlood(id);

      setBloodData((prev) =>
        prev.map((b) =>
          b.id === id
            ? { ...b, quantity: b.quantity + 1, animate: true }
            : b
        )
      );

      toast.success("Added unit 🩸");
    } catch {
      toast.error("Error increasing");
    } finally {
      setLoadingIds((prev) => prev.filter((i) => i !== id));
      setTimeout(() => {
        setBloodData((prev) =>
          prev.map((b) => ({ ...b, animate: false }))
        );
      }, 300);
    }
  };

  // 🔥 decrease
  const handleDecrease = async (id) => {
    const item = bloodData.find((b) => b.id === id);
    if (item.quantity === 0) return;

    try {
      setLoadingIds((prev) => [...prev, id]);

      await decreaseBlood(id);

      setBloodData((prev) =>
        prev.map((b) =>
          b.id === id
            ? { ...b, quantity: b.quantity - 1, animate: true }
            : b
        )
      );

      toast.success("Removed unit");
    } catch {
      toast.error("Error decreasing");
    } finally {
      setLoadingIds((prev) => prev.filter((i) => i !== id));
      setTimeout(() => {
        setBloodData((prev) =>
          prev.map((b) => ({ ...b, animate: false }))
        );
      }, 300);
    }
  };

  return (
    <div className="blood-container">
      {loading && <Loader message="Loading blood bank inventory..." />}

      <h1 className="blood-title">
        🩸 Blood Bank
      </h1>

      <div className="blood-grid">
        {bloodData.map((blood) => {
          const percentage = Math.min((blood.quantity / 50) * 100, 100); // max visual

          return (
            <div
              key={blood.id}
              className={`blood-card ${blood.animate ? "pulse" : ""}`}
            >

              <div className="blood-type">
                {blood.bloodType}
              </div>

              <p className="blood-label">Quantity (units)</p>

              {/* 🔥 control */}
              <div className="quantity-control">

                <button
                  className="btn-decrease"
                  disabled={blood.quantity === 0 || loadingIds.includes(blood.id)}
                  onClick={() => handleDecrease(blood.id)}
                >
                  -
                </button>

                <span className="quantity-number">
                  {blood.quantity}
                </span>

                <button
                  className="btn-increase"
                  disabled={loadingIds.includes(blood.id)}
                  onClick={() => handleIncrease(blood.id)}
                >
                  +
                </button>

              </div>

              {/* 🔥 progress */}
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>

              <p className={`blood-status ${blood.quantity < 10 ? "low" : ""}`}>
                {blood.quantity < 10 ? "Low Stock" : "In Stock"}
              </p>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BloodBank;