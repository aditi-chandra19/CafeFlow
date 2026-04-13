import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../theme";
import { localRestaurants } from "../data/mockData";
import CafeIcon from "../components/CafeIcon";
import { apiGet } from "../lib/api";
import { useLanguage } from "../components/LanguageProvider";
import CafeWordmark from "../components/CafeWordmark";

const navLinks = [
  { label: "Home", icon: "home", target: "/" },
  { label: "Browse", icon: "browse", target: "/browse" },
  { label: "Rewards", icon: "rewards", target: "/rewards" },
  { label: "Track", icon: "track", target: "/tracking" },
  { label: "Analytics", icon: "analytics", target: "/analytics" },
  { label: "Profile", icon: "profile", target: "/profile" },
];

const dealSlides = [
  {
    id: "welcome",
    icon: "party",
    eyebrow: "Crazy Deals",
    title: "First Order Special",
    copy: "New users get 50% OFF + Free Delivery",
    code: "WELCOME50",
    gradient: "linear-gradient(135deg, rgba(255, 255, 255, 0.24) 0%, rgba(255, 84, 112, 0.82) 100%)",
    accent: "rgba(255, 255, 255, 0.22)",
  },
  {
    id: "flash",
    icon: "bolt",
    eyebrow: "Crazy Deals",
    title: "Flash Deal!",
    copy: "Get flat 30% OFF on orders above Rs500",
    code: "FLASH30",
    gradient: "linear-gradient(135deg, rgba(255, 255, 255, 0.24) 0%, rgba(255, 61, 87, 0.86) 100%)",
    accent: "rgba(255, 255, 255, 0.28)",
  },
  {
    id: "loyalty",
    icon: "star",
    eyebrow: "Crazy Deals",
    title: "Loyalty Rewards",
    copy: "Redeem 500 points for Rs200 OFF",
    code: "LOYAL500",
    gradient: "linear-gradient(135deg, rgba(255, 255, 255, 0.24) 0%, rgba(214, 39, 68, 0.88) 100%)",
    accent: "rgba(255, 255, 255, 0.22)",
  },
  {
    id: "weekend",
    icon: "gift",
    eyebrow: "Crazy Deals",
    title: "Weekend Bonanza",
    copy: "Buy 1 Get 1 FREE on all beverages",
    code: "WEEKEND",
    gradient: "linear-gradient(135deg, rgba(255, 255, 255, 0.24) 0%, rgba(190, 24, 93, 0.86) 100%)",
    accent: "rgba(255, 255, 255, 0.24)",
  },
];

const miniDeals = [
  { title: "30% OFF", subtitle: "FLASH30", gradient: "linear-gradient(135deg, #fdf7f4 0%, #efd9cf 100%)" },
  { title: "50% OFF", subtitle: "WELCOME50", gradient: "linear-gradient(135deg, #fdf7f4 0%, #f2ddd4 100%)" },
  { title: "BOGO", subtitle: "WEEKEND", gradient: "linear-gradient(135deg, #fdf7f4 0%, #ead7ce 100%)" },
];

const categories = [
  { label: "Coffee & Tea", icon: "cup", gradient: "linear-gradient(135deg, #fdf8f5 0%, #f1e4dd 100%)", target: "/menu" },
  { label: "Fast Food", icon: "burger", gradient: "linear-gradient(135deg, #fdf8f5 0%, #f2e1d8 100%)", target: "/menu" },
  { label: "Desserts", icon: "cake", gradient: "linear-gradient(135deg, #fdf8f5 0%, #f0dfd7 100%)", target: "/menu" },
  { label: "Healthy", icon: "leaf", gradient: "linear-gradient(135deg, #fdf8f5 0%, #eee1db 100%)", target: "/menu" },
];

const stats = [
  { value: "486", label: "Reward Points" },
  { value: "24", label: "Orders" },
  { value: "Hot", label: "Special Offers" },
];

function Explore() {
  const navigate = useNavigate();
  const [activeDeal, setActiveDeal] = useState(0);
  const [restaurants, setRestaurants] = useState(localRestaurants);
  const { t } = useLanguage();

  useEffect(() => {
    apiGet("/restaurants")
      .then((data) => setRestaurants(Array.isArray(data) && data.length ? data : localRestaurants))
      .catch(() => setRestaurants(localRestaurants));
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveDeal((current) => (current + 1) % dealSlides.length);
    }, 3600);

    return () => window.clearInterval(intervalId);
  }, []);

  const goToTarget = (target = "/menu") => {
    if (target === "/") {
      navigate("/");
      return;
    }

    navigate("/login", { state: { redirectTo: target } });
  };

  const heroDeal = dealSlides[activeDeal];

  return (
    <div className="page-shell cafe-explore">
      <div className="section-shell cafe-shell">
        <header className="cafe-topbar glass-panel reveal-up">
          <div className="cafe-brand">
            <div>
              <h1 className="cafe-brand__title"><CafeWordmark compact /></h1>
              <p className="cafe-brand__sub">{t("AI-Powered")}</p>
            </div>
          </div>

          <div className="cafe-topbar__actions">
            <button type="button" className="cafe-action-dot" aria-label="Messages" onClick={() => goToTarget("/help")}>
              <CafeIcon kind="chat" />
              <span className="cafe-action-dot__badge" />
            </button>
            <button type="button" className="cafe-action-dot cafe-action-dot--soft" aria-label="Theme">
              <CafeIcon kind="spark" />
            </button>
            <button type="button" className="cafe-cart-button" aria-label="Cart" onClick={() => goToTarget("/cart")}>
              <CafeIcon kind="cart" />
            </button>
          </div>
        </header>

        <nav className="cafe-nav glass-panel reveal-up reveal-delay-1" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              className={`cafe-nav__item ${link.target === "/" ? "is-active" : ""}`}
              onClick={() => goToTarget(link.target)}
            >
              <CafeIcon kind={link.icon} />
              <span>{t(link.label)}</span>
            </button>
          ))}
        </nav>

        <section className="cafe-hero reveal-up reveal-delay-2">
          <div className="cafe-hero__glow cafe-hero__glow--one" />
          <div className="cafe-hero__glow cafe-hero__glow--two" />
          <div className="cafe-hero__content">
            <p className="cafe-hero__eyebrow">
              <CafeIcon kind="spark" />
              AI-POWERED FOOD DELIVERY
            </p>
            <h2 className="cafe-hero__title">{t("Your Perfect Meal, Just a Chat Away")}</h2>
            <p className="cafe-hero__copy">{t("Smart recommendations, exclusive deals, and rewards with every order.")}</p>

            <div className="cafe-hero__cta">
              <button type="button" className="cafe-pill-button cafe-pill-button--light" onClick={() => goToTarget("/menu")}>
                {t("Explore Now")}
              </button>
              <button type="button" className="cafe-pill-button cafe-pill-button--outline" onClick={() => goToTarget("/menu")}>
                {t("Order Usual")}
              </button>
            </div>

            <div className="cafe-hero__stats">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{t(stat.label)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="cafe-hero__orb cafe-hero__orb--top" />
          <div className="cafe-hero__orb cafe-hero__orb--bottom" />
        </section>

        <section className="cafe-section reveal-up reveal-delay-3">
          <div className="cafe-section__header">
            <div className="cafe-section__title-wrap">
              <span className="cafe-section__icon"><CafeIcon kind="bolt" /></span>
              <h3>{t("Crazy Deals")}</h3>
            </div>

            <div className="cafe-slider-controls">
              <button
                type="button"
                className="cafe-slider-controls__button"
                aria-label="Previous deal"
                onClick={() => setActiveDeal((current) => (current - 1 + dealSlides.length) % dealSlides.length)}
              >
                <CafeIcon kind="arrowLeft" />
              </button>
              <button
                type="button"
                className="cafe-slider-controls__button"
                aria-label="Next deal"
                onClick={() => setActiveDeal((current) => (current + 1) % dealSlides.length)}
              >
                <CafeIcon kind="arrowRight" />
              </button>
            </div>
          </div>

          <div className="cafe-deal-card float-card" key={heroDeal.id} style={{ background: heroDeal.gradient }}>
            <div className="cafe-deal-card__pattern" />
            <div className="cafe-deal-card__shine" />
            <div className="cafe-deal-card__bubble" style={{ background: heroDeal.accent }} />
            <div className="cafe-deal-card__content">
              <div className="cafe-deal-card__icon">
                <CafeIcon kind={heroDeal.icon} />
              </div>
              <span className="cafe-deal-card__eyebrow">{t(heroDeal.eyebrow)}</span>
              <h4>{t(heroDeal.title)}</h4>
              <p>{t(heroDeal.copy)}</p>
              <button type="button" className="cafe-deal-card__code" onClick={() => goToTarget("/menu")}>
                {heroDeal.code}
              </button>
            </div>

            <div className="cafe-slider-dots" aria-label="Deal selector">
              {dealSlides.map((deal, index) => (
                <button
                  key={deal.id}
                  type="button"
                  className={`cafe-slider-dots__dot ${index === activeDeal ? "is-active" : ""}`}
                  aria-label={`Show ${t(deal.title)}`}
                  onClick={() => setActiveDeal(index)}
                />
              ))}
            </div>
          </div>

          <div className="cafe-mini-deals">
            {miniDeals.map((deal) => (
              <button
                key={deal.title}
                type="button"
                className="cafe-mini-deals__card spotlight-card"
                style={{ background: deal.gradient }}
                onClick={() => goToTarget("/menu")}
              >
                <span>{t(deal.title)}</span>
                <small>{deal.subtitle}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="cafe-section reveal-up reveal-delay-4">
          <div className="cafe-section__header">
            <div className="cafe-section__title-wrap">
              <h3>{t("Popular Categories")}</h3>
            </div>
          </div>

          <div className="cafe-categories">
            {categories.map((category) => (
              <button
                key={category.label}
                type="button"
                className="cafe-category-card spotlight-card"
                style={{ background: category.gradient }}
                onClick={() => goToTarget(category.target)}
              >
                <span className="cafe-category-card__icon">
                  <CafeIcon kind={category.icon} />
                </span>
                <span className="cafe-category-card__label">{t(category.label)}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="cafe-section reveal-up reveal-delay-4">
          <div className="cafe-section__header">
            <div>
              <p className="muted-kicker" style={{ color: colors.primaryDark }}>{t("Featured Picks")}</p>
              <h3 className="cafe-section__headline">{t("Top restaurants ready when you are")}</h3>
            </div>
          </div>

          <div className="cafe-restaurants">
            {restaurants.map((restaurant) => (
              <button
                key={restaurant._id}
                type="button"
                className="cafe-restaurant-card spotlight-card"
                onClick={() => goToTarget(`/restaurant/${restaurant._id}`)}
              >
                <div className="cafe-restaurant-card__image-wrap">
                  <img src={restaurant.image} alt={restaurant.name} className="cafe-restaurant-card__image" />
                  <span className="cafe-restaurant-card__badge">{restaurant.isOpen ? t("Open now") : t("Closed")}</span>
                </div>

                <div className="cafe-restaurant-card__body">
                  <div className="cafe-restaurant-card__top">
                    <div>
                      <h4>{restaurant.name}</h4>
                      <p>{restaurant.deliveryTime} | {restaurant.priceRange}</p>
                    </div>
                    <span className="cafe-restaurant-card__rating">{restaurant.rating}</span>
                  </div>

                  <p className="cafe-restaurant-card__description">{restaurant.description}</p>

                  <div className="cafe-restaurant-card__chips">
                    {(restaurant.cuisine || []).map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Explore;
