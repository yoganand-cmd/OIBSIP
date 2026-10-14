import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../config/api";
function MyOrders() {
const { user } = useAuth();
const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true);
const [errorMessage, setErrorMessage] = useState("");



useEffect(() => {
  if (!user) {
    setLoading(false);
    setOrders([]);
    return;
  }

  let isMounted = true;
  let isFetching = false;

  const fetchOrders = async (showLoading = false) => {
    if (isFetching) return;
    isFetching = true;

    if (showLoading && isMounted) {
      setLoading(true);
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_BASE_URL}/api/orders/user/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (isMounted) {
        setOrders(response.data);
        setErrorMessage("");
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);

      if (isMounted && showLoading) {
        setErrorMessage(
          error.response?.data?.message ||
            "We couldn't load your orders. Please try again."
        );
      }
    } finally {
      isFetching = false;

      if (isMounted && showLoading) {
        setLoading(false);
      }
    }
  };

  fetchOrders(true);

  const intervalId = setInterval(() => {
    fetchOrders(false);
  }, 5000);

  return () => {
    isMounted = false;
    clearInterval(intervalId);
  };
}, [user]);



const statusSteps = [
{ key: "placed", label: "Ordered" },
{ key: "confirmed", label: "Confirmed" },
{ key: "preparing", label: "Preparing" },
{ key: "out-for-delivery", label: "Out for delivery" },
{ key: "delivered", label: "Delivered" }
];

const getStatusIndex = (status) =>
statusSteps.findIndex((step) => step.key === status);

const formatPrice = (price) =>
Number(price).toLocaleString("en-IN", {
maximumFractionDigits: 2
});

const formatStatus = (status) =>
(status || "unknown")
.replaceAll("-", " ")
.replace(/\b\w/g, (letter) => letter.toUpperCase());

const renderOrderTracker = (order) => {
const currentIndex = getStatusIndex(order.orderStatus);

if (order.orderStatus === "cancelled") {
  return (
    <div className="orders-cancelled">
      <span className="orders-cancelled-icon">!</span>
      <div>
        <strong>Order Cancelled</strong>
        <p>This order has been cancelled.</p>
      </div>
    </div>
  );
}

if (currentIndex === -1) {
  return (
    <div className="orders-status-unknown">
      Current status: <strong>{formatStatus(order.orderStatus)}</strong>
    </div>
  );
}

return (
  <div className="orders-tracker">
    <h3 className="orders-section-title">Order Progress</h3>

    <div className="orders-tracker-track">
      <div className="orders-progress-line">
        <div
          className="orders-progress-fill"
          style={{
            width: `${(currentIndex / (statusSteps.length - 1)) * 100}%`
          }}
        />
      </div>

      {statusSteps.map((step, index) => {
        const completed = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div
            key={step.key}
            className={`orders-step ${completed ? "completed" : ""} ${
              isCurrent ? "current" : ""
            }`}
          >
            <div className="orders-step-circle">
              {completed ? "✓" : index + 1}
            </div>

            <span className="orders-step-label">{step.label}</span>
          </div>
        );
      })}
    </div>
  </div>
);

};

if (!user) {
return (
<div className="orders-page">
<style>{ordersStyles}</style>
<div className="orders-container">
<div className="orders-message-card">
<div className="orders-state-icon">🔐</div>
<h2 className="orders-state-title">Login required</h2>
<p>Please log in to view your orders.</p>
<a href="/login" className="orders-primary-link">
Go to Login →
</a>
</div>
</div>
</div>
);
}

return (
<div className="orders-page">
<style>{ordersStyles}</style>

  <div className="orders-container">
    <header className="orders-header">
      <span className="orders-eyebrow">Your pizza journey</span>
      <h1 className="orders-title">My Orders</h1>
      <p className="orders-subtitle">
        Track your deliveries and revisit the details of your orders.
      </p>
    </header>

    {loading ? (
      <div className="orders-message-card">
        <div className="orders-state-icon">🍕</div>
        <h2 className="orders-state-title">Loading your orders...</h2>
        <p>Just a moment while we fetch your order history.</p>
      </div>
    ) : errorMessage ? (
      <div className="orders-message-card">
        <div className="orders-state-icon">⚠️</div>
        <h2 className="orders-state-title">Couldn't load orders</h2>
        <p>{errorMessage}</p>
        <button
          className="orders-primary-link"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    ) : orders.length === 0 ? (
      <div className="orders-message-card">
        <div className="orders-state-icon">🍕</div>
        <h2 className="orders-state-title">Your story starts with a slice</h2>
        <p>
          You haven't placed any orders yet. Find a favourite and make
          your first order!
        </p>
        <a href="/pizzas" className="orders-primary-link">
          Explore Pizzas →
        </a>
      </div>
    ) : (
      <>
        <div className="orders-overview">
          <div className="orders-overview-icon">🧾</div>
          <div>
            <div className="orders-overview-label">Your order history</div>
            <div className="orders-overview-value">
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </div>
          </div>
        </div>

        <div className="orders-list">
          {orders.map((order) => (
            <article className="orders-card" key={order._id}>
              <div className="orders-card-header">
                <div className="orders-id-block">
                  <span className="orders-mini-label">ORDER ID</span>
                  <h2 className="orders-id">
                    #{String(order._id).slice(-8).toUpperCase()}
                  </h2>
                  <span className="orders-item-count">
                    {order.items.length}{" "}
                    {order.items.length === 1 ? "item" : "items"}
                  </span>
                </div>

                <div className="orders-total-block">
                  <span className="orders-mini-label">ORDER TOTAL</span>
                  <div className="orders-total">
                    ₹{formatPrice(order.totalAmount)}
                  </div>
                  <span
                    className={`orders-status-badge status-${(
                      order.orderStatus || "unknown"
                    ).replace(/[^a-z-]/g, "")}`}
                  >
                    {formatStatus(order.orderStatus)}
                  </span>
                </div>
              </div>

              <div className="orders-card-content">
                {renderOrderTracker(order)}

                <div className="orders-info-grid">
                  <div className="orders-info-card">
                    <div className="orders-info-icon">💳</div>
                    <div>
                      <span className="orders-info-label">
                        Payment Method
                      </span>
                      <div className="orders-info-value">
                        {formatStatus(order.paymentMethod)}
                      </div>
                    </div>
                  </div>

                  <div className="orders-info-card">
                    <div className="orders-info-icon">🧾</div>
                    <div>
                      <span className="orders-info-label">
                        Payment Status
                      </span>
                      <div className="orders-info-value">
                        {formatStatus(order.paymentStatus)}
                      </div>
                    </div>
                  </div>

                  <div className="orders-info-card orders-address-card">
                    <div className="orders-info-icon">📍</div>
                    <div>
                      <span className="orders-info-label">
                        Delivery Address
                      </span>
                      <div className="orders-info-value">
                        {order.deliveryAddress}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="orders-items-heading">
                  <h3 className="orders-section-title">Items in this order</h3>
                </div>

                <div className="orders-items-list">
                  {order.items.map((item, index) => (
                    <div
                      className="orders-item-row"
                      key={item._id || `${order._id}-${index}`}
                    >
                      <div className="orders-item-emoji">🍕</div>

                      <div className="orders-item-details">
                        <div className="orders-item-name">{item.name}</div>
                        <div className="orders-item-price">
                          ₹{formatPrice(item.price)} × {item.quantity}
                        </div>
                      </div>

                      <div className="orders-item-subtotal">
                        ₹{formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="orders-card-footer">
                  <span>Made fresh, just for you 🍕</span>
                  <strong>
                    Total: ₹{formatPrice(order.totalAmount)}
                  </strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      </>
    )}
  </div>
</div>

);
}

const ordersStyles = `
.orders-page {
min-height: 100vh;
padding: 46px 0 72px;
background: #fffaf5;
color: #302019;
}

.orders-container {
width: min(1120px, 92%);
margin: 0 auto;
}

.orders-header {
margin-bottom: 32px;
}

.orders-eyebrow {
display: inline-block;
padding: 7px 13px;
margin-bottom: 13px;
border-radius: 30px;
background: #ffeadb;
color: #b94718;
font-size: 11px;
font-weight: 800;
letter-spacing: 1.4px;
text-transform: uppercase;
}

.orders-title {
margin: 0;
color: #302019 !important;
font-size: clamp(30px, 4vw, 42px);
font-weight: 850;
letter-spacing: -1.3px;
}

.orders-subtitle {
margin-top: 10px;
color: #817168;
font-size: 15px;
line-height: 1.7;
}

.orders-overview {
display: flex;
align-items: center;
gap: 15px;
padding: 20px 23px;
margin-bottom: 25px;
border: 1px solid #f0e5dc;
border-radius: 17px;
background: white;
}

.orders-overview-icon {
width: 48px;
height: 48px;
display: flex;
align-items: center;
justify-content: center;
border-radius: 13px;
background: #ffeadb;
font-size: 23px;
}

.orders-overview-label {
color: #817168;
font-size: 12px;
}

.orders-overview-value {
margin-top: 3px;
color: #302019;
font-size: 19px;
font-weight: 850;
}

.orders-list {
display: grid;
gap: 25px;
}

.orders-card {
overflow: hidden;
border: 1px solid #f0e5dc;
border-radius: 22px;
background: white;
box-shadow: 0 7px 24px rgba(73, 39, 20, 0.05);
}

.orders-card-header {
display: flex;
align-items: center;
justify-content: space-between;
gap: 18px;
padding: 23px 27px;
border-bottom: 1px solid #f0e5dc;
background: linear-gradient(110deg, #fff7f0, #ffffff);
}

.orders-mini-label {
display: block;
margin-bottom: 7px;
color: #99887e;
font-size: 10px;
font-weight: 800;
letter-spacing: 1px;
}

.orders-id {
margin: 0 0 6px;
color: #302019 !important;
font-size: 20px;
font-weight: 850;
overflow-wrap: anywhere;
}

.orders-item-count {
color: #817168;
font-size: 12px;
}

.orders-total-block {
text-align: right;
}

.orders-total {
margin-bottom: 9px;
color: #b94718;
font-size: 24px;
font-weight: 900;
}

.orders-status-badge {
display: inline-block;
padding: 6px 10px;
border-radius: 7px;
background: #f4eee8;
color: #725b4c;
font-size: 11px;
font-weight: 800;
}

.orders-status-badge.status-delivered {
background: #e8f7ed;
color: #217444;
}

.orders-status-badge.status-cancelled {
background: #fff0ee;
color: #ad3a30;
}

.orders-status-badge.status-preparing,
.orders-status-badge.status-out-for-delivery {
background: #fff0e4;
color: #b94718;
}

.orders-status-badge.status-confirmed {
background: #eaf1ff;
color: #345da8;
}

.orders-card-content {
padding: 27px;
}

.orders-section-title {
margin: 0 0 19px;
color: #302019 !important;
font-size: 16px;
font-weight: 850;
}

.orders-tracker {
margin-bottom: 31px;
}

.orders-tracker-track {
position: relative;
display: flex;
justify-content: space-between;
gap: 5px;
}

.orders-progress-line {
position: absolute;
top: 17px;
left: 8%;
right: 8%;
height: 4px;
border-radius: 10px;
background: #eee5de;
}

.orders-progress-fill {
height: 100%;
border-radius: 10px;
background: #f36c32;
transition: width 0.3s ease;
}

.orders-step {
position: relative;
z-index: 1;
display: flex;
flex-direction: column;
align-items: center;
gap: 9px;
width: 20%;
text-align: center;
}

.orders-step-circle {
width: 36px;
height: 36px;
display: flex;
align-items: center;
justify-content: center;
border: 2px solid #e8ddd4;
border-radius: 50%;
background: white;
color: #99887e;
font-size: 12px;
font-weight: 850;
}

.orders-step.completed .orders-step-circle {
border-color: #f36c32;
background: #f36c32;
color: white;
}

.orders-step.current .orders-step-circle {
outline: 4px solid #ffeadb;
}

.orders-step-label {
max-width: 100%;
color: #99887e;
font-size: 11px;
line-height: 1.4;
overflow-wrap: anywhere;
}

.orders-step.completed .orders-step-label {
color: #49352b;
font-weight: 750;
}

.orders-cancelled {
display: flex;
align-items: center;
gap: 13px;
padding: 16px;
margin-bottom: 25px;
border: 1px solid #f1c5c1;
border-radius: 12px;
background: #fff2f0;
color: #a52f28;
}

.orders-cancelled-icon {
width: 34px;
height: 34px;
display: flex;
align-items: center;
justify-content: center;
border-radius: 50%;
background: #f9d9d5;
font-weight: 900;
}

.orders-cancelled p {
margin: 4px 0 0;
font-size: 12px;
}

.orders-status-unknown {
padding: 14px;
margin-bottom: 24px;
border-radius: 11px;
background: #fff7f0;
color: #725b4c;
font-size: 13px;
}

.orders-info-grid {
display: grid;
grid-template-columns: repeat(3, minmax(0, 1fr));
gap: 13px;
margin-bottom: 30px;
}

.orders-info-card {
display: flex;
align-items: flex-start;
gap: 11px;
min-width: 0;
padding: 15px;
border: 1px solid #f0e5dc;
border-radius: 13px;
background: #fffdfa;
}

.orders-info-icon {
flex-shrink: 0;
font-size: 19px;
}

.orders-info-label {
display: block;
margin-bottom: 7px;
color: #99887e;
font-size: 11px;
}

.orders-info-value {
color: #49352b;
font-size: 12px;
font-weight: 800;
line-height: 1.6;
overflow-wrap: anywhere;
}

.orders-items-heading {
padding-bottom: 2px;
}

.orders-items-list {
overflow: hidden;
border: 1px solid #f0e5dc;
border-radius: 13px;
}

.orders-item-row {
display: flex;
align-items: center;
gap: 13px;
padding: 14px 16px;
}

.orders-item-row + .orders-item-row {
border-top: 1px solid #f0e5dc;
}

.orders-item-emoji {
width: 41px;
height: 41px;
flex-shrink: 0;
display: flex;
align-items: center;
justify-content: center;
border-radius: 10px;
background: #ffeadb;
font-size: 20px;
}

.orders-item-details {
flex: 1;
min-width: 0;
}

.orders-item-name {
color: #302019;
font-size: 13px;
font-weight: 800;
overflow-wrap: anywhere;
}

.orders-item-price {
margin-top: 4px;
color: #99887e;
font-size: 12px;
}

.orders-item-subtotal {
flex-shrink: 0;
color: #302019;
font-size: 14px;
font-weight: 850;
}

.orders-card-footer {
display: flex;
justify-content: space-between;
align-items: center;
gap: 15px;
margin-top: 22px;
padding-top: 19px;
border-top: 1px solid #f0e5dc;
color: #99887e;
font-size: 12px;
}

.orders-card-footer strong {
color: #b94718;
font-size: 15px;
}

.orders-message-card {
padding: 52px 22px;
border: 1px solid #f0e5dc;
border-radius: 22px;
background: white;
box-shadow: 0 7px 24px rgba(73, 39, 20, 0.05);
text-align: center;
}

.orders-state-icon {
margin-bottom: 15px;
font-size: 45px;
}

.orders-state-title {
margin: 0 0 10px;
color: #302019 !important;
font-size: 23px;
font-weight: 850;
}

.orders-message-card p {
margin: 0 0 23px;
color: #817168;
font-size: 14px;
line-height: 1.7;
}

.orders-primary-link {
display: inline-flex;
align-items: center;
justify-content: center;
min-height: 44px;
padding: 11px 19px;
border: 0;
border-radius: 10px;
background: #f36c32;
color: white;
font-size: 13px;
font-weight: 800;
text-decoration: none;
cursor: pointer;
}

.orders-primary-link {
background: #d94f1c;
color: white;
}

@media (max-width: 760px) {
.orders-page {
padding: 32px 0 50px;
}

.orders-card-header,
.orders-card-content {
  padding: 20px;
}

.orders-info-grid {
  grid-template-columns: 1fr 1fr;
}

.orders-address-card {
  grid-column: 1 / -1;
}

}

@media (max-width: 500px) {
.orders-card {
border-radius: 16px;
}

.orders-card-header,
.orders-card-content {
  padding: 16px;
}

.orders-id {
  font-size: 17px;
}

.orders-total {
  font-size: 21px;
}

.orders-step-label {
  font-size: 9px;
}

.orders-step-circle {
  width: 30px;
  height: 30px;
}

.orders-progress-line {
  top: 14px;
}

.orders-info-grid {
  grid-template-columns: 1fr;
}

.orders-address-card {
  grid-column: auto;
}

.orders-card-footer {
  align-items: flex-start;
  flex-direction: column;
}

.orders-item-row {
  padding: 12px;
}

}

@media (prefers-reduced-motion: reduce) {
.orders-progress-fill {
transition: none;
}
}
`;

export default MyOrders;