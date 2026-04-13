import { useEffect, useState } from "react";
import Toolbar from "../components/Toolbar";
import CafeIcon from "../components/CafeIcon";
import { apiGet } from "../lib/api";

const rewardCatalog = [
  { title: "Free Coffee", worth: "Worth Rs80", points: 100 },
  { title: "Rs100 OFF", worth: "Worth Rs100", points: 250 },
  { title: "Free Dessert", worth: "Worth Rs150", points: 200 },
  { title: "Rs200 OFF", worth: "Worth Rs200", points: 500 },
  { title: "Free Meal", worth: "Worth Rs300", points: 1000 },
  { title: "VIP Access", worth: "Worth Exclusive", points: 2000 },
];

function Rewards() {
  const [summary, setSummary] = useState({
    tier: "Silver Member",
    totalPoints: 486,
    orderCount: 24,
    totalSpent: 6000,
    progress: 49,
    referralCode: "CAFEUPA09",
  });

  useEffect(() => {
    apiGet("/me/rewards")
      .then((data) => setSummary((current) => ({ ...current, ...data })))
      .catch(() => {});
  }, []);

  return (
    <>
      <Toolbar />
      <div className="app-page-shell">
        <div className="app-content-shell">
          <section className="rewards-hero">
            <div>
              <p className="rewards-hero__kicker"><CafeIcon kind="rewards" /> LOYALTY STATUS</p>
              <h1>{summary.tier}</h1>
              <p>Keep ordering to unlock more rewards!</p>
            </div>
            <div className="rewards-hero__trophy">
              <CafeIcon kind="trophy" />
            </div>

            <div className="rewards-hero__stats">
              <div><strong>{summary.totalPoints}</strong><span>Total Points</span></div>
              <div><strong>{summary.orderCount}</strong><span>Orders</span></div>
              <div><strong>Rs{summary.totalSpent?.toLocaleString?.("en-IN") || summary.totalSpent}</strong><span>Total Spent</span></div>
            </div>

            <div className="rewards-hero__progress">
              <div className="rewards-hero__progress-meta">
                <span>Progress to next tier</span>
                <span>{summary.progress}%</span>
              </div>
              <div className="rewards-hero__progress-track">
                <div className="rewards-hero__progress-fill" style={{ width: `${summary.progress}%` }} />
              </div>
            </div>
          </section>

          <section className="section-block">
            <div className="section-title-row">
              <h2><CafeIcon kind="gift" /> Redeem Rewards</h2>
            </div>

            <div className="rewards-grid">
              {rewardCatalog.map((reward) => {
                const unlocked = summary.totalPoints >= reward.points;
                return (
                  <article key={reward.title} className={`reward-card ${unlocked ? "is-unlocked" : ""}`}>
                    <div className="reward-card__top">
                      <div>
                        <h3>{reward.title}</h3>
                        <p>{reward.worth}</p>
                      </div>
                      <CafeIcon kind="bolt" />
                    </div>
                    <div className="reward-card__bottom">
                      <span><CafeIcon kind="star" /> {reward.points} pts</span>
                      <button type="button" className={unlocked ? "reward-button" : "reward-button is-locked"}>
                        {unlocked ? "Redeem" : "Locked"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="refer-card">
            <div className="refer-card__top">
              <div>
                <h2><CafeIcon kind="share" /> Refer & Earn</h2>
                <p>Invite friends and get 200 points for each successful referral!</p>
              </div>
              <CafeIcon kind="gift" className="refer-card__gift" />
            </div>

            <div className="refer-card__code">
              <div>
                <span>Your Referral Code</span>
                <strong>{summary.referralCode}</strong>
              </div>
              <button type="button" className="refer-card__copy" onClick={() => navigator.clipboard?.writeText(summary.referralCode || "") }>
                <CafeIcon kind="copy" /> Copy
              </button>
            </div>

            <div className="refer-card__stats">
              <div><strong>{Math.floor((summary.orderCount || 0) / 2)}</strong><span>Referred</span></div>
              <div><strong>{Math.floor((summary.orderCount || 0) / 4)}</strong><span>Joined</span></div>
              <div><strong>{Math.floor((summary.totalPoints || 0) / 3)}</strong><span>Points Earned</span></div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Rewards;
