import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import { useCart } from "../context/CartContext";

import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../config/api";


function Checkout() {

const { cartItems, clearCart } = useCart();
const { user } = useAuth();
const navigate = useNavigate();

// Keep all useState hooks above useEffect and the early return
const [address, setAddress] = useState("");
const [paymentMethod, setPaymentMethod] = useState("cod");
const [loading, setLoading] = useState(false);

useEffect(() => {
  if (!user) {
    navigate("/login", {
      replace: true,
      state: { from: "/checkout" },
    });
  }
}, [user, navigate]);

if (!user) {
  return null;
}




const total = cartItems.reduce(

(sum, item) => sum + item.price * item.quantity,

0

);



const totalItems = cartItems.reduce(

(sum, item) => sum + item.quantity,

0

);



const formatPrice = (price) =>

Number(price).toLocaleString("en-IN", {

maximumFractionDigits: 2

});



// Create the order in your database

const createOrder = async (paymentStatus = "pending") => {

const token = localStorage.getItem("token");





const orderData = {

  items: cartItems.map((item) => ({

    pizza: item._id,

    name: item.name,

    price: Number(item.price),

    quantity: item.quantity,



    // Pizza customizations

    size: item.size || "Regular",

    crust: item.crust || "Classic",

    cheese: item.cheese || "Regular",

    toppings: item.toppings || [],

  })),



  totalAmount: total,

  deliveryAddress: address,

  paymentMethod,

  paymentStatus,

};





const response = await axios.post(

  `${API_BASE_URL}/api/orders`,

  orderData,

  {

    headers: {

      Authorization: `Bearer ${token}`

    }

  }

);



return response.data;



};



const handleRazorpayPayment = async () => {
  try {
    const token = localStorage.getItem("token");

    // Save the order in MongoDB first
    const savedOrderResponse = await createOrder("pending");
    const savedOrder = savedOrderResponse.order;

    if (!savedOrder?._id) {
      throw new Error("Order could not be saved.");
    }

    // Create a Razorpay order linked to the saved database order
    const response = await axios.post(
      `${API_BASE_URL}/api/create-order`,
      {
        orderId: savedOrder._id
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: response.data.amount,
      currency: response.data.currency,
      name: "Pizza Delivery",
      description: "Pizza Order Payment",
      order_id: response.data.order_id,

      handler: async function (paymentResponse) {
        try {
          await axios.post(
            `${API_BASE_URL}/api/verify-payment`,
            paymentResponse,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }
            }
          );

          clearCart();
          navigate("/orders");
        } catch (error) {
          console.error("Payment verification error:", error);
          alert(
            error.response?.data?.message ||
              "Payment verification failed. If money was deducted, contact support."
          );
        }
      },

      prefill: {
        name: user.name,
        email: user.email
      },

      theme: {
        color: "#f36c32"
      }
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", function () {
      alert("Payment failed. Your order remains pending.");
    });

    razorpay.open();
  } catch (error) {
    console.error("Razorpay checkout error:", error);
    alert(
      error.response?.data?.message ||
        error.message ||
        "Unable to start Razorpay payment."
    );
  }
};



const handleSubmit = async (event) => {

event.preventDefault();



if (!user) {

  alert("Please login before placing an order.");

  navigate("/login");

  return;

}



if (cartItems.length === 0) {

  alert("Your cart is empty.");

  navigate("/pizzas");

  return;

}



if (!address.trim()) {

  alert("Please enter your delivery address.");

  return;

}



setLoading(true);



try {

  if (paymentMethod === "razorpay") {

    await handleRazorpayPayment();

  } else {

    await createOrder();



    // Clear cart after successful COD order

    clearCart();



    alert("Order placed successfully!");

    navigate("/orders");

  }

} catch (error) {

  console.error(error);



  alert(

    error.response?.data?.message ||

      "Failed to place order."

  );

} finally {

  setLoading(false);

}



};



return (

<div className="checkout-page">

<style>{`

.checkout-page {

min-height: 100vh;

padding: 46px 0 72px;

background: #fffaf5;

color: #302019;

}



    .checkout-container {

      width: min(1200px, 92%);

      margin: 0 auto;

    }



    .checkout-eyebrow {

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



    .checkout-title {

      margin: 0;

      color: #302019 !important;

      font-size: clamp(30px, 4vw, 42px);

      font-weight: 850;

      letter-spacing: -1.3px;

    }



    .checkout-subtitle {

      margin-top: 10px;

      color: #817168;

      font-size: 15px;

      line-height: 1.7;

    }



    .checkout-layout {

      display: grid;

      grid-template-columns: minmax(0, 1fr) 360px;

      align-items: start;

      gap: 28px;

      margin-top: 34px;

    }



    .checkout-main-card,

    .checkout-summary-card {

      border: 1px solid #f0e5dc;

      border-radius: 22px;

      background: #fff;

      box-shadow: 0 8px 28px rgba(73, 39, 20, 0.05);

    }



    .checkout-main-card {

      padding: 30px;

    }



    .checkout-card-heading {

      display: flex;

      align-items: center;

      gap: 13px;

      margin-bottom: 26px;

    }



    .checkout-heading-icon {

      width: 46px;

      height: 46px;

      flex-shrink: 0;

      display: flex;

      align-items: center;

      justify-content: center;

      border-radius: 13px;

      background: #ffeadb;

      font-size: 22px;

    }



    .checkout-section-title {

      margin: 0;

      color: #302019 !important;

      font-size: 21px;

      font-weight: 850;

    }



    .checkout-section-subtitle {

      margin: 4px 0 0;

      color: #99887e;

      font-size: 13px;

    }



    .checkout-field-label {

      display: block;

      margin-bottom: 10px;

      color: #49352b;

      font-size: 13px;

      font-weight: 800;

    }



    .checkout-input {

      width: 100%;

      padding: 14px 15px;

      border: 1px solid #e8ddd4;

      border-radius: 12px;

      background: #fffdfa;

      color: #302019;

      font-size: 14px;

      line-height: 1.6;

      outline: none;

      transition: border-color 0.2s ease, box-shadow 0.2s ease;

    }



    .checkout-input::placeholder {

      color: #ad9c91;

    }



    .checkout-input:focus {

      border-color: #f36c32;

      box-shadow: 0 0 0 4px rgba(243, 108, 50, 0.12);

    }



    .checkout-address {

      min-height: 145px;

      resize: vertical;

    }



    .checkout-field-hint {

      margin-top: 8px;

      color: #99887e;

      font-size: 12px;

      line-height: 1.6;

    }



    .checkout-payment-label {

      display: block;

      margin-bottom: 12px;

      color: #49352b;

      font-size: 13px;

      font-weight: 800;

    }



    .checkout-payment-option {

      display: flex;

      align-items: center;

      gap: 13px;

      padding: 17px;

      border: 1px solid #e8ddd4;

      border-radius: 13px;

      background: #fffdfa;

      cursor: pointer;

      transition: border-color 0.2s ease, background 0.2s ease;

    }



    .checkout-payment-option + .checkout-payment-option {

      margin-top: 12px;

    }



    .checkout-payment-option.selected {

      border-color: #f36c32;

      background: #fff7f0;

    }



    .checkout-payment-option input {

      width: 17px;

      height: 17px;

      flex-shrink: 0;

      accent-color: #f36c32;

    }



    .checkout-payment-icon {

      width: 42px;

      height: 42px;

      flex-shrink: 0;

      display: flex;

      align-items: center;

      justify-content: center;

      border-radius: 11px;

      background: #f7eee7;

      font-size: 21px;

    }



    .checkout-payment-name {

      color: #302019;

      font-size: 14px;

      font-weight: 800;

    }



    .checkout-payment-description {

      margin-top: 4px;

      color: #99887e;

      font-size: 12px;

      line-height: 1.5;

    }



    .checkout-submit-button {

      display: flex;

      width: 100%;

      min-height: 52px;

      align-items: center;

      justify-content: center;

      gap: 9px;

      margin-top: 28px;

      padding: 13px 18px;

      border: 0;

      border-radius: 12px;

      background: #f36c32;

      color: white;

      font-size: 14px;

      font-weight: 850;

      transition: background 0.2s ease, transform 0.2s ease;

    }



    .checkout-submit-button:hover:not(:disabled) {

      transform: translateY(-2px);

      background: #d94f1c;

    }



    .checkout-submit-button:disabled {

      cursor: not-allowed;

      opacity: 0.7;

    }



    .checkout-summary-card {

      position: sticky;

      top: 100px;

      padding: 25px;

    }



    .checkout-summary-title {

      margin: 0;

      color: #302019 !important;

      font-size: 23px;

      font-weight: 850;

    }



    .checkout-summary-subtitle {

      margin: 7px 0 23px;

      color: #99887e;

      font-size: 13px;

    }



    .checkout-summary-items {

      display: flex;

      flex-direction: column;

      gap: 17px;

      max-height: 330px;

      overflow-y: auto;

    }



    .checkout-summary-item {

      display: flex;

      align-items: center;

      gap: 12px;

    }



    .checkout-summary-image {

      width: 58px;

      height: 58px;

      flex-shrink: 0;

      border-radius: 11px;

      object-fit: cover;

      background: #f7eee7;

    }



    .checkout-summary-placeholder {

      width: 58px;

      height: 58px;

      flex-shrink: 0;

      display: flex;

      align-items: center;

      justify-content: center;

      border-radius: 11px;

      background: #f7eee7;

      font-size: 24px;

    }



    .checkout-summary-item-details {

      flex: 1;

      min-width: 0;

    }



    .checkout-summary-item-name {

      overflow-wrap: anywhere;

      color: #302019;

      font-size: 13px;

      font-weight: 800;

    }



    .checkout-summary-item-quantity {

      margin-top: 4px;

      color: #99887e;

      font-size: 12px;

    }



    .checkout-summary-item-price {

      flex-shrink: 0;

      color: #302019;

      font-size: 13px;

      font-weight: 800;

    }



    .checkout-summary-divider {

      margin: 23px 0;

      border: 0;

      border-top: 1px solid #eee4dc;

    }



    .checkout-summary-line {

      display: flex;

      justify-content: space-between;

      gap: 12px;

      margin-bottom: 15px;

      color: #817168;

      font-size: 13px;

    }



    .checkout-summary-value {

      color: #302019;

      font-weight: 750;

      text-align: right;

    }



    .checkout-summary-total {

      display: flex;

      align-items: center;

      justify-content: space-between;

      gap: 12px;

      margin-top: 21px;

      color: #302019;

      font-size: 15px;

      font-weight: 850;

    }



    .checkout-total-price {

      color: #b94718;

      font-size: 26px;

      font-weight: 900;

      letter-spacing: -0.8px;

    }



    .checkout-security-note {

      display: flex;

      align-items: center;

      justify-content: center;

      gap: 7px;

      margin-top: 21px;

      color: #99887e;

      font-size: 11px;

      text-align: center;

    }



    .checkout-empty-card {

      padding: 52px 20px;

      border: 1px solid #f0e5dc;

      border-radius: 22px;

      background: white;

      text-align: center;

    }



    .checkout-empty-icon {

      margin-bottom: 16px;

      font-size: 48px;

    }



    .checkout-empty-title {

      margin: 0 0 9px;

      color: #302019 !important;

      font-size: 24px;

      font-weight: 850;

    }



    .checkout-empty-text {

      margin: 0 0 24px;

      color: #817168;

      font-size: 14px;

    }



    .checkout-empty-link {

      display: inline-flex;

      align-items: center;

      justify-content: center;

      min-height: 46px;

      padding: 12px 20px;

      border-radius: 11px;

      background: #f36c32;

      color: white;

      font-size: 14px;

      font-weight: 800;

      text-decoration: none;

    }



    .checkout-empty-link:hover {

      background: #d94f1c;

      color: white;

    }



    @media (max-width: 900px) {

      .checkout-layout {

        grid-template-columns: minmax(0, 1fr) 310px;

        gap: 18px;

      }



      .checkout-main-card {

        padding: 23px;

      }



      .checkout-summary-card {

        padding: 20px;

      }

    }



    @media (max-width: 760px) {

      .checkout-page {

        padding: 32px 0 50px;

      }



      .checkout-layout {

        grid-template-columns: 1fr;

        margin-top: 26px;

      }



      .checkout-summary-card {

        position: static;

      }

    }



    @media (max-width: 480px) {

      .checkout-main-card {

        padding: 18px;

        border-radius: 17px;

      }



      .checkout-summary-card {

        padding: 19px;

        border-radius: 17px;

      }



      .checkout-card-heading {

        align-items: flex-start;

      }



      .checkout-payment-option {

        padding: 13px;

      }

    }



    @media (prefers-reduced-motion: reduce) {

      .checkout-input,

      .checkout-payment-option,

      .checkout-submit-button {

        transition: none;

      }



      .checkout-submit-button:hover:not(:disabled) {

        transform: none;

      }

    }

  `}</style>



  <div className="checkout-container">

    <header>

      <span className="checkout-eyebrow">One last step</span>

      <h1 className="checkout-title">Checkout</h1>

      <p className="checkout-subtitle">

        Add your delivery details and choose how you'd like to pay.

      </p>

    </header>



    {cartItems.length === 0 ? (

      <div className="checkout-empty-card mt-4">

        <div className="checkout-empty-icon">🍕</div>



        <h2 className="checkout-empty-title">Your cart is empty</h2>



        <p className="checkout-empty-text">

          Add some delicious pizzas before checking out.

        </p>



        <button

          type="button"

          className="checkout-empty-link"

          onClick={() => navigate("/pizzas")}

        >

          Browse Pizzas →

        </button>

      </div>

    ) : (

      <div className="checkout-layout">

        <section className="checkout-main-card">

          <div className="checkout-card-heading">

            <div className="checkout-heading-icon">📍</div>



            <div>

              <h2 className="checkout-section-title">

                Delivery & Payment

              </h2>



              <p className="checkout-section-subtitle">

                Where should we bring your order?

              </p>

            </div>

          </div>



          <form onSubmit={handleSubmit}>

            <div style={{ marginBottom: 28 }}>

              <label

                htmlFor="deliveryAddress"

                className="checkout-field-label"

              >

                Delivery Address

              </label>



              <textarea

                id="deliveryAddress"

                className="checkout-input checkout-address"

                value={address}

                onChange={(event) => setAddress(event.target.value)}

                placeholder="House / flat number, street, area, city, state and PIN code"

                rows={5}

                required

                autoComplete="street-address"

              />



              <p className="checkout-field-hint">

                Include your house number, street, area and PIN code so

                your order reaches you without delay.

              </p>

            </div>



            <div>

              <span className="checkout-payment-label">

                Choose Payment Method

              </span>



              <label

                className={`checkout-payment-option ${

                  paymentMethod === "cod" ? "selected" : ""

                }`}

              >

                <input

                  type="radio"

                  name="paymentMethod"

                  value="cod"

                  checked={paymentMethod === "cod"}

                  onChange={(event) =>

                    setPaymentMethod(event.target.value)

                  }

                />



                <span className="checkout-payment-icon">💵</span>



                <span>

                  <span className="checkout-payment-name">

                    Cash on Delivery

                  </span>



                  <span className="checkout-payment-description" style={{ display: "block" }}>

                    Pay when your order arrives.

                  </span>

                </span>

              </label>



              <label

                className={`checkout-payment-option ${

                  paymentMethod === "razorpay" ? "selected" : ""

                }`}

              >

                <input

                  type="radio"

                  name="paymentMethod"

                  value="razorpay"

                  checked={paymentMethod === "razorpay"}

                  onChange={(event) =>

                    setPaymentMethod(event.target.value)

                  }

                />



                <span className="checkout-payment-icon">💳</span>



                <span>

                  <span className="checkout-payment-name">

                    Pay Online with Razorpay

                  </span>



                  <span className="checkout-payment-description" style={{ display: "block" }}>

                    Continue to the secure payment checkout.

                  </span>

                </span>

              </label>

            </div>



            <button

              type="submit"

              className="checkout-submit-button"

              disabled={loading}

            >

              {loading

                ? "Processing your order..."

                : paymentMethod === "razorpay"

                ? `Pay ₹${formatPrice(total)} with Razorpay →`

                : "Place Order →"}

            </button>



            <div className="checkout-security-note">

              <span>🔒</span>

              <span>Your order details will be submitted securely.</span>

            </div>

          </form>

        </section>



        <aside className="checkout-summary-card">

          <h2 className="checkout-summary-title">Your Order</h2>



          <p className="checkout-summary-subtitle">

            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart

          </p>



          <div className="checkout-summary-items">

            {cartItems.map((item) => (

              <div className="checkout-summary-item" key={item._id}>

                {item.image ? (

                  <img

                    src={item.image}

                    alt={item.name}

                    className="checkout-summary-image"

                    loading="lazy"

                  />

                ) : (

                  <div

                    className="checkout-summary-placeholder"

                    role="img"

                    aria-label="Pizza image unavailable"

                  >

                    🍕

                  </div>

                )}



                <div className="checkout-summary-item-details">

                  <div className="checkout-summary-item-name">

                    {item.name}

                  </div>



                  <div className="checkout-summary-item-quantity">

                    {item.quantity} × ₹{formatPrice(item.price)}

                  </div>

                </div>



                <div className="checkout-summary-item-price">

                  ₹{formatPrice(item.price * item.quantity)}

                </div>

              </div>

            ))}

          </div>



          <hr className="checkout-summary-divider" />



          <div className="checkout-summary-line">

            <span>Total quantity</span>

            <span className="checkout-summary-value">{totalItems}</span>

          </div>



          <div className="checkout-summary-line">

            <span>Subtotal</span>

            <span className="checkout-summary-value">

              ₹{formatPrice(total)}

            </span>

          </div>



          <hr className="checkout-summary-divider" />



          <div className="checkout-summary-total">

            <span>Total Amount</span>

            <span className="checkout-total-price">

              ₹{formatPrice(total)}

            </span>

          </div>



          <div className="checkout-security-note">

            <span>🍕</span>

            <span>Freshly prepared, just for you</span>

          </div>

        </aside>

      </div>

    )}

  </div>

</div>



);

}



export default Checkout;