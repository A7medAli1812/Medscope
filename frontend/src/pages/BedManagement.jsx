import React, { useEffect, useState } from "react";
import "./BedManagement.css";
import {
  getBeds,
  increaseBed,
  decreaseBed,
} from "../api/admin/bedManagement";
import toast from "react-hot-toast";

const BedManagement = () => {
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchBeds = async () => {
    try {
      setLoading(true);
      const data = await getBeds();
      setBeds(data);
    } catch (err) {
      toast.error("Failed to load beds");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeds();
  }, []);

  // 🔼 increase
  const handleIncrease = async (bed) => {
    if (bed.usedBeds >= bed.totalBeds) {
      toast("Max reached 🚫");
      return;
    }

    try {
      setUpdatingId(bed.id);

      // optimistic update
      setBeds(prev =>
        prev.map(b =>
          b.id === bed.id
            ? {
                ...b,
                usedBeds: b.usedBeds + 1,
                availableBeds: b.availableBeds - 1,
              }
            : b
        )
      );

      await increaseBed(bed.id);

      toast.success("Bed increased ✅");
    } catch {
      toast.error("Error updating");
      fetchBeds();
    } finally {
      setUpdatingId(null);
    }
  };

  // 🔽 decrease
  const handleDecrease = async (bed) => {
    if (bed.usedBeds <= 0) {
      toast("No beds to remove ❌");
      return;
    }

    try {
      setUpdatingId(bed.id);

      setBeds(prev =>
        prev.map(b =>
          b.id === bed.id
            ? {
                ...b,
                usedBeds: b.usedBeds - 1,
                availableBeds: b.availableBeds + 1,
              }
            : b
        )
      );

      await decreaseBed(bed.id);

      toast.success("Bed decreased ⬇️");
    } catch {
      toast.error("Error updating");
      fetchBeds();
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bed-page">
      <h2 className="page-title">Bed Management</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bed-grid">
          {beds.map((bed) => {
            const percentage =
              (bed.usedBeds / bed.totalBeds) * 100;

            const isMax = bed.usedBeds >= bed.totalBeds;
            const isMin = bed.usedBeds <= 0;

            return (
              <div
                className={`bed-card ${
                  updatingId === bed.id ? "updating" : ""
                }`}
                key={bed.id}
              >
                <div className="bed-header">
                  <i className="fas fa-bed"></i>
                </div>

                <div className="bed-info">
                  <h3>{bed.ward}</h3>

                  <div className="bed-count">
                    {bed.usedBeds}/{bed.totalBeds}

                    <div className="bed-icons">
                      <i
                        className={`fas fa-arrow-up ${
                          isMax ? "disabled" : ""
                        }`}
                        onClick={() =>
                          !isMax && handleIncrease(bed)
                        }
                      ></i>

                      <i
                        className={`fas fa-arrow-down ${
                          isMin ? "disabled" : ""
                        }`}
                        onClick={() =>
                          !isMin && handleDecrease(bed)
                        }
                      ></i>
                    </div>
                  </div>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BedManagement;