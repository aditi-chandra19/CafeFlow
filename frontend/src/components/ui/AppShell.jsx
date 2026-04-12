import { colors } from "../../theme";

export function PageContainer({ children, maxWidth = "1120px" }) {
  return (
    <div className="page-shell">
      <div style={{ maxWidth, margin: "0 auto" }}>{children}</div>
    </div>
  );
}

export function SplitLayout({ children, columns = "minmax(0, 1fr) minmax(320px, 0.8fr)" }) {
  return (
    <div
      className="responsive-two-col"
      style={{
        display: "grid",
        gridTemplateColumns: columns,
        gap: "22px",
        alignItems: "start",
      }}
    >
      {children}
    </div>
  );
}

export function SurfacePanel({ children, style }) {
  return (
    <section
      className="glass-panel"
      style={{ borderRadius: "30px", padding: "24px", ...style }}
    >
      {children}
    </section>
  );
}

export function BackButton({ children = "Back", onClick, style }) {
  return (
    <button
      className="luxury-button"
      onClick={onClick}
      style={{ background: colors.card, color: colors.text, ...style }}
    >
      {children}
    </button>
  );
}

export function PageHeading({ title, subtitle }) {
  return (
    <>
      <h1 style={{ fontSize: "3rem", color: colors.text }}>{title}</h1>
      {subtitle ? (
        <p style={{ marginTop: "8px", color: colors.muted }}>{subtitle}</p>
      ) : null}
    </>
  );
}

export function SummaryRow({ label, value, highlight = false, muted = false, style }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: muted ? colors.muted : colors.text,
        ...style,
      }}
    >
      <span>{label}</span>
      <strong style={highlight ? { color: colors.success } : undefined}>{value}</strong>
    </div>
  );
}
