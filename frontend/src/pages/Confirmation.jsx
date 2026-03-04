function Confirmation() {
  const lastOrder =
    JSON.parse(localStorage.getItem("lastOrder")) || [];

  return (
    <div style={{ padding: "40px" }}>
      <h1>Order Confirmation 📦</h1>

      {lastOrder.length === 0 ? (
        <p>No recent order found.</p>
      ) : (
        <>
          {lastOrder.map((item, index) => (
            <div
              key={index}
              style={{
                marginTop: "15px",
                padding: "10px",
                background: "#f3f4f6",
                borderRadius: "8px"
              }}
            >
              <h4>{item.name}</h4>
              <p>₹ {item.price}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default Confirmation;