import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { colors } from "../theme";
import { apiPost } from "../lib/api";
import { setUserProfile } from "../lib/storage";
import { useLanguage } from "../components/LanguageProvider";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const redirectTo = location.state?.redirectTo || "/menu";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await apiPost("/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      if (data.user) {
        setUserProfile(data.user);
      }
      navigate(data.role === "admin" ? "/dashboard" : redirectTo);
    } catch (error) {
      alert(error.message || "Login failed");
    }
  };

  return (
    <div className="page-shell">
      <div style={shell}>
        <section style={visualPanel}>
          <div style={visualBadge}>{t("Welcome back")}</div>
          <h1 style={heroTitle}>{t("Sign in and continue the experience.")}</h1>
          <p style={heroCopy}>
            Access restaurant discovery, reservations, saved delivery details, payment options,
            and live tracking through one modern account flow.
          </p>

          <div style={previewGrid}>
            <div style={previewCard}>
              <span style={previewLabel}>{t("Public entry")}</span>
              <strong style={previewValue}>{t("Explore page before auth")}</strong>
            </div>
            <div style={previewCard}>
              <span style={previewLabel}>{t("After login")}</span>
              <strong style={previewValue}>{t("Marketplace, menu, cart, booking, tracking")}</strong>
            </div>
          </div>
        </section>

        <form onSubmit={handleLogin} className="glass-panel" style={formPanel}>
          <div>
            <p className="muted-kicker">{t("Account access")}</p>
            <h2 style={formTitle}>{t("Sign in to CafeFlow")}</h2>
            <p style={formCopy}>{t("Use your email and password to continue.")}</p>
          </div>

          <label style={field}>
            <span style={label}>{t("Email")}</span>
            <input type="email" placeholder={t("Enter your email")} value={email} onChange={(e) => setEmail(e.target.value)} className="luxury-input" required />
          </label>

          <label style={field}>
            <span style={label}>{t("Password")}</span>
            <input type="password" placeholder={t("Enter your password")} value={password} onChange={(e) => setPassword(e.target.value)} className="luxury-input" required />
          </label>

          <button type="submit" className="luxury-button" style={primaryButton}>{t("Sign in")}</button>

          <p style={footerText}>
            {t("Need an account?")} <button type="button" onClick={() => navigate("/register", { state: { redirectTo } })} style={linkButton}>{t("Register")}</button>
          </p>
        </form>
      </div>
    </div>
  );
}

const shell = {
  maxWidth: "1180px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.08fr) minmax(360px, 0.92fr)",
  gap: "24px",
  alignItems: "stretch",
};

const visualPanel = {
  borderRadius: "34px",
  padding: "32px",
  minHeight: "620px",
  background: "linear-gradient(135deg, #111827 0%, #2c2622 58%, #bf4e3b 140%)",
  color: "white",
  boxShadow: "0 28px 70px rgba(17, 24, 39, 0.18)",
};

const visualBadge = {
  display: "inline-flex",
  padding: "9px 12px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.14)",
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.18em",
  fontWeight: 800,
};

const heroTitle = {
  marginTop: "20px",
  fontSize: "clamp(3.4rem, 6vw, 5.2rem)",
  lineHeight: 0.92,
  maxWidth: "650px",
};

const heroCopy = {
  marginTop: "18px",
  maxWidth: "560px",
  color: "rgba(255,255,255,0.82)",
  fontSize: "1.04rem",
};

const previewGrid = {
  display: "grid",
  gap: "14px",
  marginTop: "28px",
  maxWidth: "520px",
};

const previewCard = {
  padding: "18px",
  borderRadius: "22px",
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.14)",
  display: "grid",
  gap: "8px",
};

const previewLabel = {
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.16em",
  color: "rgba(255,255,255,0.66)",
  fontWeight: 800,
};

const previewValue = {
  color: "white",
};

const formPanel = {
  padding: "32px",
  borderRadius: "34px",
  display: "grid",
  alignContent: "center",
  gap: "18px",
};

const formTitle = {
  marginTop: "10px",
  fontSize: "2.8rem",
  color: colors.text,
};

const formCopy = {
  marginTop: "8px",
  color: colors.muted,
};

const field = {
  display: "grid",
  gap: "8px",
};

const label = {
  color: colors.text,
  fontWeight: 700,
  fontSize: "14px",
};

const primaryButton = {
  background: "linear-gradient(135deg, #bf4e3b, #c58a2c)",
  color: "white",
  width: "100%",
};

const footerText = {
  color: colors.muted,
};

const linkButton = {
  border: "none",
  background: "transparent",
  color: colors.primary,
  fontWeight: 700,
  padding: 0,
};

export default Login;
