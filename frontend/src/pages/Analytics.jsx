import { useEffect, useMemo, useRef, useState } from "react";
import Toolbar from "../components/Toolbar";
import CafeIcon from "../components/CafeIcon";
import { apiGet } from "../lib/api";

const fallbackSummaryCards = [
  { title: "Total Revenue", value: 331000, change: "+12.5%", icon: "wallet" },
  { title: "Total Orders", value: 3310, change: "+8.3%", icon: "browse" },
  { title: "Avg Order Value", value: 280, change: "+4.2%", icon: "analytics" },
  { title: "Customer Retention", value: 78, change: "+2.1%", icon: "profile" },
];

const fallbackTopItems = [
  { rank: 1, name: "Chicken Biryani", detail: "450 orders | Rs126000", change: "+12%" },
  { rank: 2, name: "Masala Chai", detail: "380 orders | Rs30400", change: "+8%" },
  { rank: 3, name: "Paneer Tikka", detail: "290 orders | Rs36300", change: "+15%" },
  { rank: 4, name: "Cold Coffee", detail: "245 orders | Rs29400", change: "-3%" },
  { rank: 5, name: "Veg Fried Rice", detail: "220 orders | Rs30800", change: "+5%" },
];

const fallbackRevenueTrend = [
  { month: "Jan", revenue: 45000 },
  { month: "Feb", revenue: 52000 },
  { month: "Mar", revenue: 48000 },
  { month: "Apr", revenue: 61000 },
  { month: "May", revenue: 58000 },
  { month: "Jun", revenue: 68000 },
];

const fallbackPeakHours = [
  { label: "8-10 AM", orders: 120 },
  { label: "10-12 PM", orders: 90 },
  { label: "12-2 PM", orders: 340 },
  { label: "2-4 PM", orders: 100 },
  { label: "4-6 PM", orders: 180 },
  { label: "6-8 PM", orders: 420 },
  { label: "8-10 PM", orders: 290 },
  { label: "10-12 AM", orders: 110 },
];

const fallbackCategoryBreakdown = [
  { label: "Beverages", value: 35 },
  { label: "Main Course", value: 30 },
  { label: "Desserts", value: 15 },
  { label: "Starters", value: 12 },
  { label: "Salads", value: 8 },
];

const categoryDots = ["dot--amber", "dot--red", "dot--pink", "dot--violet", "dot--green"];

function currencyLabel(card) {
  if (/revenue|value/i.test(card.title)) return `Rs${Number(card.value || 0).toLocaleString("en-IN")}`;
  if (/retention/i.test(card.title)) return `${card.value}%`;
  return Number(card.value || 0).toLocaleString("en-IN");
}

function Analytics() {
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);
  const donutChartRef = useRef(null);

  const [summaryCards, setSummaryCards] = useState(fallbackSummaryCards);
  const [topItems, setTopItems] = useState(fallbackTopItems);
  const [revenueTrend, setRevenueTrend] = useState(fallbackRevenueTrend);
  const [peakHours, setPeakHours] = useState(fallbackPeakHours);
  const [categoryBreakdown, setCategoryBreakdown] = useState(fallbackCategoryBreakdown);

  const chartPoints = useMemo(() => {
    const values = revenueTrend.map((point) => point.revenue || 0);
    const max = Math.max(...values, 1);
    const min = Math.min(...values, 0);
    const range = Math.max(max - min, 1);
    return revenueTrend.map((point, index) => ({
      ...point,
      x: 10 + index * 50,
      y: 130 - (((point.revenue || 0) - min) / range) * 94,
    }));
  }, [revenueTrend]);

  const [activePoint, setActivePoint] = useState(() => ({ ...chartPoints[0], tooltipLeft: 60, tooltipTop: 90 }));
  const [activeBar, setActiveBar] = useState(() => ({ ...peakHours[0], tooltipLeft: 50, tooltipTop: 80 }));
  const [activeCategory, setActiveCategory] = useState(() => ({ ...categoryBreakdown[0], tooltipLeft: 150, tooltipTop: 110 }));

  useEffect(() => {
    apiGet("/me/analytics")
      .then((data) => {
        if (Array.isArray(data.summaryCards) && data.summaryCards.length) setSummaryCards(data.summaryCards);
        if (Array.isArray(data.topItems) && data.topItems.length) setTopItems(data.topItems);
        if (Array.isArray(data.revenueTrend) && data.revenueTrend.length) setRevenueTrend(data.revenueTrend);
        if (Array.isArray(data.peakHours) && data.peakHours.length) setPeakHours(data.peakHours);
        if (Array.isArray(data.categoryBreakdown) && data.categoryBreakdown.length) setCategoryBreakdown(data.categoryBreakdown);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (chartPoints.length) {
      setActivePoint((current) => current?.month ? current : { ...chartPoints[0], tooltipLeft: 60, tooltipTop: 90 });
    }
  }, [chartPoints]);

  useEffect(() => {
    if (peakHours.length) {
      setActiveBar((current) => current?.label ? current : { ...peakHours[0], tooltipLeft: 50, tooltipTop: 80 });
    }
  }, [peakHours]);

  useEffect(() => {
    if (categoryBreakdown.length) {
      setActiveCategory((current) => current?.label ? current : { ...categoryBreakdown[0], tooltipLeft: 150, tooltipTop: 110 });
    }
  }, [categoryBreakdown]);

  const getTooltipPosition = (container, element, offsetX = 18, offsetY = 10) => {
    if (!container || !element) {
      return { left: 0, top: 0 };
    }

    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    return {
      left: elementRect.left - containerRect.left + elementRect.width / 2 + offsetX,
      top: elementRect.top - containerRect.top + offsetY,
    };
  };

  const linePointsAttribute = chartPoints.map((point) => `${point.x},${point.y}`).join(" ");
  const peakMax = Math.max(...peakHours.map((item) => item.orders || 0), 1);

  return (
    <>
      <Toolbar />
      <div className="app-page-shell">
        <div className="app-content-shell">
          <section className="section-block">
            <div className="section-title-row analytics-title">
              <div>
                <h1>Analytics Dashboard</h1>
                <p>Track your restaurant&apos;s performance and insights</p>
              </div>
            </div>

            <div className="analytics-summary-grid">
              {summaryCards.map((card) => (
                <article key={card.title} className="analytics-summary-card">
                  <div className="analytics-summary-card__icon"><CafeIcon kind={card.icon} /></div>
                  <div className="analytics-summary-card__change">{card.change}</div>
                  <strong>{currencyLabel(card)}</strong>
                  <span>{card.title}</span>
                </article>
              ))}
            </div>
          </section>

          <section className="analytics-grid">
            <article className="analytics-panel">
              <h2><CafeIcon kind="analytics" /> Revenue Trend</h2>
              <div className="line-chart" ref={lineChartRef}>
                <div className="line-chart__grid" />
                <div className="analytics-tooltip" style={{ left: `${activePoint.tooltipLeft}px`, top: `${activePoint.tooltipTop}px` }}>
                  <strong>{activePoint.month}</strong>
                  <span>revenue : {activePoint.revenue}</span>
                </div>
                <svg viewBox="0 0 320 180" className="line-chart__svg">
                  <polyline fill="none" stroke="#f59e0b" strokeWidth="3" points={linePointsAttribute} />
                  {chartPoints.map((point) => (
                    <circle key={point.month} cx={point.x} cy={point.y} r={activePoint.month === point.month ? "6" : "4"} fill="#f59e0b" />
                  ))}
                </svg>
                {chartPoints.map((point) => (
                  <button
                    key={point.month}
                    type="button"
                    className="line-chart__point-button"
                    style={{ left: `${point.x}px`, top: `${point.y}px` }}
                    onClick={(event) => {
                      const position = getTooltipPosition(lineChartRef.current, event.currentTarget, 18, 8);
                      setActivePoint({ ...point, tooltipLeft: position.left, tooltipTop: position.top });
                    }}
                    aria-label={`Show ${point.month} revenue`}
                  />
                ))}
              </div>
            </article>

            <article className="analytics-panel">
              <h2><CafeIcon kind="clock" /> Peak Hours</h2>
              <div className="bar-chart" ref={barChartRef}>
                <div className="analytics-tooltip" style={{ left: `${activeBar.tooltipLeft}px`, top: `${activeBar.tooltipTop}px` }}>
                  <strong>{activeBar.label}</strong>
                  <span>orders : {activeBar.orders}</span>
                </div>
                {peakHours.map((item) => (
                  <div key={item.label} className={`bar-chart__item ${activeBar.label === item.label ? "is-active" : ""}`}>
                    <div className="bar-chart__bar" style={{ height: `${Math.max(40, ((item.orders || 0) / peakMax) * 180)}px` }} />
                    <button
                      type="button"
                      className="bar-chart__button"
                      onClick={(event) => {
                        const position = getTooltipPosition(barChartRef.current, event.currentTarget, 2, 52);
                        setActiveBar({ ...item, tooltipLeft: position.left, tooltipTop: position.top });
                      }}
                      aria-label={`Show ${item.label} orders`}
                    />
                  </div>
                ))}
              </div>
            </article>

            <article className="analytics-panel analytics-panel--wide">
              <h2><CafeIcon kind="bolt" /> Best Selling Items</h2>
              <div className="best-items">
                {topItems.map((item, index) => (
                  <div key={item.name} className="best-items__row">
                    <div className="best-items__rank">{item.rank || index + 1}</div>
                    <div>
                      <strong>{item.name}</strong>
                      <p>{item.detail}</p>
                    </div>
                    <span className={`best-items__change ${String(item.change).startsWith("-") ? "is-down" : ""}`}>{item.change}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="analytics-panel">
              <h2><CafeIcon kind="rewards" /> Categories</h2>
              <div className="analytics-donut" ref={donutChartRef}>
                <div className="analytics-donut__chart">
                  {categoryBreakdown.map((item, index) => (
                    <button
                      key={item.label}
                      type="button"
                      className="analytics-donut__segment-button"
                      style={{ left: `${58 + index * 8}%`, top: `${22 + (index % 3) * 18}%` }}
                      onClick={(event) => {
                        const position = getTooltipPosition(donutChartRef.current, event.currentTarget, -16, -24);
                        setActiveCategory({ ...item, tooltipLeft: position.left, tooltipTop: position.top });
                      }}
                      aria-label={`Show ${item.label} share`}
                    />
                  ))}
                </div>
                <div className="analytics-tooltip" style={{ left: `${activeCategory.tooltipLeft}px`, top: `${activeCategory.tooltipTop}px` }}>
                  <strong>{activeCategory.label} : {activeCategory.value}</strong>
                </div>
                <div className="analytics-donut__labels">
                  {categoryBreakdown.map((item, index) => (
                    <button
                      key={item.label}
                      type="button"
                      className={`analytics-donut__label ${categoryDots[index % categoryDots.length]}`}
                      style={{ left: `${12 + index * 16}%`, top: `${20 + (index % 4) * 18}%` }}
                      onClick={(event) => {
                        const position = getTooltipPosition(donutChartRef.current, event.currentTarget, 0, -16);
                        setActiveCategory({ ...item, tooltipLeft: position.left, tooltipTop: position.top });
                      }}
                    >
                      {item.label} {item.value}%
                    </button>
                  ))}
                </div>
                <ul className="analytics-donut__legend">
                  {categoryBreakdown.map((item, index) => (
                    <li key={item.label}>
                      <span className={`dot ${categoryDots[index % categoryDots.length]}`} /> {item.label} {item.value}%
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </section>
        </div>
      </div>
    </>
  );
}

export default Analytics;
