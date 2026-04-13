function CafeWordmark({ compact = false }) {
  return (
    <span className={`cafe-wordmark ${compact ? "is-compact" : ""}`}>
      <span className="cafe-wordmark__text">CafeFlow</span>
    </span>
  );
}

export default CafeWordmark;
