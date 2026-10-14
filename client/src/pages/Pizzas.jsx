import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";
import API_BASE_URL from "../config/api";
import { useCart } from "../context/CartContext";

function Pizzas() {

  const [pizzas, setPizzas] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(false);

  const [cartBarDismissed, setCartBarDismissed] = useState(false);

const [selectedPizza, setSelectedPizza] = useState(null);

const [selectedSize, setSelectedSize] = useState("Regular");

const [selectedCrust, setSelectedCrust] = useState("Classic");

const [selectedCheese, setSelectedCheese] = useState("Regular");

const [selectedToppings, setSelectedToppings] = useState([]);

  const { cartItems, addToCart } = useCart();

  const navigate = useNavigate();

  useEffect(() => {

    axios

      .get(`${API_BASE_URL}/api/pizzas`)

      .then((response) => {

        setPizzas(response.data);

      })

      .catch((error) => {

        console.error("Failed to fetch pizzas:", error);

        setError(true);

      })

      .finally(() => {

        setLoading(false);

      });

  }, []);

  const totalItems = cartItems.reduce(

    (total, item) => total + Number(item.quantity || 0),

    0

  );

  const cartSubtotal = cartItems.reduce(

    (total, item) =>

      total + Number(item.price || 0) * Number(item.quantity || 0),

    0

  );

const toppingOptions = [

  { name: "Extra Mozzarella", price: 30 },

  { name: "Mushrooms", price: 25 },

  { name: "Olives", price: 25 },

  { name: "Jalapeños", price: 25 },

  { name: "Sweet Corn", price: 25 },

  { name: "Onions", price: 20 },

];

const openCustomization = (pizza) => {

  setSelectedPizza(pizza);

  setSelectedSize("Regular");

  setSelectedCrust("Classic");

  setSelectedCheese("Regular");

  setSelectedToppings([]);

};

const toggleTopping = (name) => {

  setSelectedToppings((current) =>

    current.includes(name)

      ? current.filter((item) => item !== name)

      : [...current, name]

  );

};

const sizeExtra = {

  Regular: 0,

  Medium: 100,

  Large: 180,

};

const crustExtra = {

  Classic: 0,

  Thin: 0,

  "Cheese Burst": 60,

};

const cheeseExtra = {

  Regular: 0,

  Extra: 30,

};

const customizationTotal = selectedPizza

  ? Number(selectedPizza.price) +

    sizeExtra[selectedSize] +

    crustExtra[selectedCrust] +

    cheeseExtra[selectedCheese] +

    toppingOptions

      .filter((topping) => selectedToppings.includes(topping.name))

      .reduce((sum, topping) => sum + topping.price, 0)

  : 0;

const handleAddToCart = () => {

  if (!selectedPizza) return;

  addToCart(selectedPizza, {

    size: selectedSize,

    crust: selectedCrust,

    cheese: selectedCheese,

    toppings: selectedToppings,

    unitPrice: customizationTotal,

  });

  setCartBarDismissed(false);

  setSelectedPizza(null);

};

  const showCartBar = totalItems > 0 && !cartBarDismissed;

  return (

    <div className="pizza-menu-page">

      <style>{`

        .pizza-menu-page {

          min-height: 100vh;

          padding: 48px 0 100px;

          background: #fffaf5;

          color: #302019;

        }

        .pizza-menu-container {

          width: min(1200px, 92%);

          margin: 0 auto;

        }

        .pizza-menu-eyebrow {

          display: inline-block;

          padding: 7px 14px;

          margin-bottom: 14px;

          border-radius: 50px;

          background: #ffeadb;

          color: #b94718;

          font-size: 12px;

          font-weight: 800;

          letter-spacing: 1.5px;

          text-transform: uppercase;

        }

        .pizza-menu-title {

          color: #302019 !important;

          font-size: clamp(32px, 4vw, 46px);

          font-weight: 850;

          letter-spacing: -1.5px;

        }

        .pizza-menu-subtitle {

          max-width: 540px;

          margin: 12px auto 0;

          color: #817168;

          font-size: 16px;

          line-height: 1.7;

        }

        .pizza-menu-divider {

          width: 64px;

          height: 4px;

          margin: 22px auto 0;

          border-radius: 10px;

          background: #f36c32;

        }

        .pizza-grid {

          display: grid;

          grid-template-columns: repeat(3, minmax(0, 1fr));

          gap: 26px;

          margin-top: 42px;

        }

        .pizza-card {

          min-width: 0;

          overflow: hidden;

          display: flex;

          flex-direction: column;

          border: 1px solid #f0e5dc;

          border-radius: 22px;

          background: #fff;

          box-shadow: 0 5px 20px rgba(73, 39, 20, 0.045);

          transition: transform 0.25s ease, box-shadow 0.25s ease;

        }

        .pizza-card:hover {

          transform: translateY(-6px);

          box-shadow: 0 16px 36px rgba(73, 39, 20, 0.12);

        }

        .pizza-image-wrap {

          position: relative;

          height: 235px;

          overflow: hidden;

          background: #f5e8dd;

        }

        .pizza-image {

          display: block;

          width: 100%;

          height: 100%;

          object-fit: cover;

          transition: transform 0.4s ease;

        }

        .pizza-card:hover .pizza-image {

          transform: scale(1.055);

        }

        .pizza-no-image {

          display: flex;

          height: 100%;

          align-items: center;

          justify-content: center;

          color: #8c7668;

          font-size: 14px;

        }

        .pizza-category {

          position: absolute;

          top: 15px;

          left: 15px;

          display: inline-flex;

          align-items: center;

          gap: 6px;

          padding: 7px 10px;

          border: 1px solid rgba(255, 255, 255, 0.75);

          border-radius: 8px;

          background: rgba(255, 255, 255, 0.94);

          font-size: 11px;

          font-weight: 800;

          letter-spacing: 0.3px;

        }

        .pizza-category-dot {

          width: 8px;

          height: 8px;

          display: inline-block;

          border-radius: 50%;

        }

        .pizza-category-dot.veg { background: #198754; }

        .pizza-category-dot.nonveg { background: #dc3545; }

        .pizza-card-body {

          flex: 1;

          display: flex;

          flex-direction: column;

          padding: 22px;

        }

        .pizza-name {

          margin: 0;

          color: #302019 !important;

          font-size: 21px;

          font-weight: 800;

          line-height: 1.35;

          overflow-wrap: anywhere;

        }

        .pizza-description {

          flex: 1;

          margin: 11px 0 20px;

          color: #817168;

          font-size: 14px;

          line-height: 1.75;

          overflow-wrap: anywhere;

        }

        .pizza-card-footer {

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 12px;

          padding-top: 17px;

          border-top: 1px solid #f1e9e3;

        }

        .pizza-price-label {

          margin-bottom: 3px;

          color: #99887e;

          font-size: 11px;

          font-weight: 700;

          letter-spacing: 0.7px;

          text-transform: uppercase;

        }

        .pizza-price {

          color: #302019;

          font-size: 24px;

          font-weight: 850;

          letter-spacing: -0.6px;

        }

        .pizza-add-button {

          min-height: 43px;

          padding: 0 17px;

          border: 0;

          border-radius: 11px;

          background: #f36c32;

          color: white;

          font-size: 13px;

          font-weight: 800;

          white-space: nowrap;

          cursor: pointer;

          transition: background 0.2s ease, transform 0.2s ease;

        }

        .pizza-add-button:hover {

          background: #d94f1c;

          transform: translateY(-1px);

        }

        .pizza-add-button:focus-visible,

        .pizza-quantity-button:focus-visible {

          outline: 3px solid #f7b79a;

          outline-offset: 3px;

        }

        .pizza-quantity-control {

          display: flex;

          align-items: center;

          gap: 12px;

          padding: 4px;

          border: 1px solid #f0e1d7;

          border-radius: 12px;

          background: #fffaf5;

        }

        .pizza-quantity-button {

          width: 32px;

          height: 32px;

          display: inline-flex;

          align-items: center;

          justify-content: center;

          border: 0;

          border-radius: 8px;

          background: white;

          color: #b94718;

          font-size: 21px;

          font-weight: 700;

          line-height: 1;

          box-shadow: 0 1px 4px rgba(73, 39, 20, 0.1);

          cursor: pointer;

        }

        .pizza-quantity-button:hover { background: #ffeadb; }

        .pizza-quantity-number {

          min-width: 18px;

          color: #302019;

          font-size: 16px;

          font-weight: 800;

          text-align: center;

        }

        .pizza-add-button:focus-visible,
        .customize-option:focus-visible,
        .customize-confirm:focus-visible,
        .customize-close:focus-visible {
          outline: 3px solid #f7b79a;
          outline-offset: 3px;
        }

        .customize-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          background: rgba(35, 22, 16, 0.65);
        }

        .customize-modal {
          width: min(520px, 100%);
          max-height: 90vh;
          overflow-y: auto;
          padding: 26px;
          border-radius: 22px;
          background: #fffaf5;
          color: #302019;
          box-shadow: 0 20px 70px rgba(0, 0, 0, 0.25);
        }

        .customize-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 20px;
        }

        .customize-heading h2 { margin: 0; font-size: 24px; font-weight: 850; }
        .customize-close { border: 0; background: transparent; color: #817168; font-size: 28px; cursor: pointer; }
        .customize-section { margin-top: 22px; }
        .customize-section-title { margin-bottom: 10px; font-size: 14px; font-weight: 800; }
        .customize-options { display: flex; flex-wrap: wrap; gap: 9px; }
        .customize-option { padding: 10px 13px; border: 1px solid #e8ddd4; border-radius: 10px; background: white; color: #49352b; cursor: pointer; }
        .customize-option.selected { border-color: #f36c32; background: #ffeadb; color: #b94718; font-weight: 800; }
        .customize-topping { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 11px 0; border-bottom: 1px solid #f0e5dc; font-size: 13px; }
        .customize-topping input { accent-color: #f36c32; }
        .customize-confirm { width: 100%; margin-top: 24px; padding: 15px; border: 0; border-radius: 12px; background: #f36c32; color: white; font-weight: 850; cursor: pointer; }
        .customize-confirm:hover { background: #d94f1c; }

        @media (max-width: 576px) {
          .customize-modal { padding: 20px; }
          .customize-heading h2 { font-size: 21px; }
        }

        .pizza-unavailable {

          width: 100%;

          min-height: 43px;

          padding: 0 10px;

          border: 1px solid #e7dcd4;

          border-radius: 11px;

          background: #f4efeb;

          color: #89776c;

          font-size: 12px;

          font-weight: 800;

        }

        .pizza-state {

          grid-column: 1 / -1;

          padding: 42px 20px;

          border: 1px solid #f0e5dc;

          border-radius: 20px;

          background: white;

          text-align: center;

        }

        .pizza-state-icon { margin-bottom: 12px; font-size: 36px; }

        .pizza-state-title {

          margin: 0 0 8px;

          color: #302019 !important;

          font-size: 21px;

          font-weight: 800;

        }

        .pizza-state-text {

          margin: 0;

          color: #817168;

          font-size: 14px;

        }

        /* Floating cart bar */

        .floating-cart-wrap {

          position: fixed;

          z-index: 1050;

          right: 0;

          bottom: 20px;

          left: 0;

          display: flex;

          justify-content: center;

          padding: 0 20px;

          pointer-events: none;

          animation: cartBarEnter 0.25s ease-out;

        }

        .floating-cart-bar {

          pointer-events: auto;

          width: min(650px, 100%);

          display: flex;

          align-items: center;

          gap: 15px;

          padding: 14px 16px;

          border: 1px solid rgba(255,255,255,.12);

          border-radius: 18px;

          background: #302019;

          color: #fffaf5;

          box-shadow: 0 12px 40px rgba(48, 32, 25, 0.3);

        }

        .floating-cart-icon {

          position: relative;

          display: grid;

          place-items: center;

          flex: 0 0 46px;

          width: 46px;

          height: 46px;

          border-radius: 13px;

          background: #493023;

          color: #ffb27e;

          font-size: 23px;

        }

        .floating-cart-count {

          position: absolute;

          top: -7px;

          right: -7px;

          display: grid;

          place-items: center;

          min-width: 21px;

          height: 21px;

          padding: 0 5px;

          border: 2px solid #302019;

          border-radius: 50px;

          background: #f36c32;

          color: white;

          font-size: 10px;

          font-weight: 850;

        }

        .floating-cart-details {

          flex: 1;

          min-width: 0;

        }

        .floating-cart-title {

          margin: 0 0 4px;

          color: white;

          font-size: 14px;

          font-weight: 850;

        }

        .floating-cart-subtitle {

          margin: 0;

          color: #d3c3b8;

          font-size: 12px;

        }

        .floating-cart-total {

          display: block;

          margin-top: 3px;

          color: #ffb27e;

          font-size: 14px;

          font-weight: 850;

        }

        .floating-cart-action {

          display: inline-flex;

          align-items: center;

          justify-content: center;

          gap: 10px;

          min-height: 45px;

          padding: 0 17px;

          border: 0;

          border-radius: 11px;

          background: #f36c32;

          color: white;

          font-size: 13px;

          font-weight: 850;

          white-space: nowrap;

          cursor: pointer;

          transition: background .2s, transform .2s;

        }

        .floating-cart-action:hover {

          background: #ff814a;

          transform: translateY(-1px);

        }

        .floating-cart-dismiss {

          align-self: flex-start;

          padding: 0 2px;

          border: 0;

          background: transparent;

          color: #c6b5aa;

          font-size: 20px;

          line-height: 1;

          cursor: pointer;

        }

        .floating-cart-dismiss:hover { color: white; }

        @keyframes cartBarEnter {

          from { opacity: 0; transform: translateY(18px); }

          to { opacity: 1; transform: translateY(0); }

        }

        @media (max-width: 900px) {

          .pizza-grid {

            grid-template-columns: repeat(2, minmax(0, 1fr));

            gap: 20px;

          }

        }

        @media (max-width: 576px) {

          .pizza-menu-page { padding: 34px 0 90px; }

          .pizza-menu-container { width: 92%; }

          .pizza-grid {

            grid-template-columns: 1fr;

            gap: 20px;

            margin-top: 30px;

          }

          .pizza-image-wrap { height: 230px; }

          .pizza-card-body { padding: 19px; }

          .pizza-name { font-size: 20px; }

          .pizza-card-footer { gap: 8px; }

          .pizza-price { font-size: 22px; }

          .pizza-add-button { padding: 0 13px; }

          .floating-cart-wrap {

            bottom: 10px;

            padding: 0 10px;

          }

          .floating-cart-bar {

            gap: 10px;

            padding: 12px 10px;

            border-radius: 15px;

          }

          .floating-cart-icon {

            flex-basis: 38px;

            width: 38px;

            height: 38px;

            font-size: 19px;

          }

          .floating-cart-title { font-size: 12px; }

          .floating-cart-subtitle { font-size: 10px; }

          .floating-cart-total { font-size: 12px; }

          .floating-cart-action {

            min-height: 40px;

            gap: 5px;

            padding: 0 10px;

            font-size: 11px;

          }

          .floating-cart-dismiss { font-size: 17px; }

        }

        @media (max-width: 360px) {

          .floating-cart-bar { gap: 7px; padding: 10px 7px; }

          .floating-cart-icon { flex-basis: 32px; width: 32px; height: 32px; }

          .floating-cart-action { padding: 0 7px; font-size: 10px; }

        }

        @media (prefers-reduced-motion: reduce) {

          .pizza-card, .pizza-image, .pizza-add-button,

          .floating-cart-action { transition: none; }

          .pizza-card:hover, .pizza-add-button:hover,

          .floating-cart-action:hover { transform: none; }

          .pizza-card:hover .pizza-image { transform: none; }

          .floating-cart-wrap { animation: none; }

        }

      `}</style>

      <div className="pizza-menu-container">

        <header className="text-center">

          <span className="pizza-menu-eyebrow">

            Made fresh, made for you

          </span>

          <h1 className="pizza-menu-title mb-0">Our Pizza Menu</h1>

          <p className="pizza-menu-subtitle">

            From cheesy classics to delicious favourites, find your next

            slice and make it a great meal.

          </p>

          <div className="pizza-menu-divider" />

        </header>

        <div className="pizza-grid">

          {loading ? (

            <div className="pizza-state">

              <div className="pizza-state-icon">🍕</div>

              <h2 className="pizza-state-title">Preparing your menu...</h2>

              <p className="pizza-state-text">

                Just a moment while we fetch your pizzas.

              </p>

            </div>

          ) : error ? (

            <div className="pizza-state">

              <div className="pizza-state-icon">⚠️</div>

              <h2 className="pizza-state-title">

                Menu temporarily unavailable

              </h2>

              <p className="pizza-state-text">

                We couldn't load the pizzas. Please check that your server is

                running and refresh the page.

              </p>

            </div>

          ) : pizzas.length === 0 ? (

            <div className="pizza-state">

              <div className="pizza-state-icon">🍕</div>

              <h2 className="pizza-state-title">No pizzas available yet</h2>

              <p className="pizza-state-text">

                Please check back soon for something delicious.

              </p>

            </div>

          ) : (

            pizzas.map((pizza) => {


              const isVeg = pizza.category === "veg";

              return (

                <article className="pizza-card" key={pizza._id}>

                  <div className="pizza-image-wrap">

                    {pizza.image ? (

                      <img

                        src={pizza.image}

                        className="pizza-image"

                        alt={pizza.name}

                        loading="lazy"

                      />

                    ) : (

                      <div className="pizza-no-image">

                        🍕 Image not available

                      </div>

                    )}

                    <span className="pizza-category">

                      <span

                        className={`pizza-category-dot ${

                          isVeg ? "veg" : "nonveg"

                        }`}

                      />

                      {isVeg ? "VEG" : "NON-VEG"}

                    </span>

                  </div>

                  <div className="pizza-card-body">

                    <h2 className="pizza-name">{pizza.name}</h2>

                    <p className="pizza-description">

                      {pizza.description ||

                        "A delicious pizza made fresh for you."}

                    </p>

                    <div className="pizza-card-footer">

                      <div>

                        <div className="pizza-price-label">Price</div>

                        <div className="pizza-price">₹{pizza.price}</div>

                      </div>

                      {!pizza.isAvailable ? (

                        <button className="pizza-unavailable" disabled>

                          Unavailable

                        </button>

                      ) : (
                        <button
                          className="pizza-add-button"
                          onClick={() => openCustomization(pizza)}
                        >
                          Customize +
                        </button>
                      )}

                    </div>

                  </div>

                </article>

              );

            })

          )}

        </div>

      </div>

      {selectedPizza && (
        <div
          className="customize-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelectedPizza(null);
          }}
        >
          <section
            className="customize-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="customize-title"
          >
            <div className="customize-heading">
              <div>
                <h2 id="customize-title">Customize your pizza</h2>
                <p style={{ color: "#817168", margin: "6px 0 0" }}>
                  {selectedPizza.name}
                </p>
              </div>
              <button
                type="button"
                className="customize-close"
                onClick={() => setSelectedPizza(null)}
                aria-label="Close customization"
              >
                ×
              </button>
            </div>

            <div className="customize-section">
              <div className="customize-section-title">Choose your size</div>
              <div className="customize-options">
                {Object.entries(sizeExtra).map(([size, extra]) => (
                  <button
                    type="button"
                    key={size}
                    className={`customize-option ${selectedSize === size ? "selected" : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size} {extra > 0 ? `(+₹${extra})` : ""}
                  </button>
                ))}
              </div>
            </div>

            <div className="customize-section">
              <div className="customize-section-title">Choose your crust</div>
              <div className="customize-options">
                {Object.entries(crustExtra).map(([crust, extra]) => (
                  <button
                    type="button"
                    key={crust}
                    className={`customize-option ${selectedCrust === crust ? "selected" : ""}`}
                    onClick={() => setSelectedCrust(crust)}
                  >
                    {crust} {extra > 0 ? `(+₹${extra})` : ""}
                  </button>
                ))}
              </div>
            </div>

            <div className="customize-section">
              <div className="customize-section-title">Cheese preference</div>
              <div className="customize-options">
                {Object.entries(cheeseExtra).map(([cheese, extra]) => (
                  <button
                    type="button"
                    key={cheese}
                    className={`customize-option ${selectedCheese === cheese ? "selected" : ""}`}
                    onClick={() => setSelectedCheese(cheese)}
                  >
                    {cheese} {extra > 0 ? `(+₹${extra})` : ""}
                  </button>
                ))}
              </div>
            </div>

            <div className="customize-section">
              <div className="customize-section-title">Extra toppings</div>
              {toppingOptions.map((topping) => (
                <label className="customize-topping" key={topping.name}>
                  <span>{topping.name} (+₹{topping.price})</span>
                  <input
                    type="checkbox"
                    checked={selectedToppings.includes(topping.name)}
                    onChange={() => toggleTopping(topping.name)}
                  />
                </label>
              ))}
            </div>

            <button
              type="button"
              className="customize-confirm"
              onClick={handleAddToCart}
            >
              Add to Cart · ₹{customizationTotal.toLocaleString("en-IN")}
            </button>
          </section>
        </div>
      )}

      {showCartBar && (

        <div className="floating-cart-wrap">

          <section

            className="floating-cart-bar"

            aria-label="Shopping cart summary"

            aria-live="polite"

          >

            <div className="floating-cart-icon" aria-hidden="true">

              🛒

              <span className="floating-cart-count">{totalItems}</span>

            </div>

            <div className="floating-cart-details">

              <p className="floating-cart-title">Added to your cart!</p>

              <p className="floating-cart-subtitle">

                {totalItems} {totalItems === 1 ? "item" : "items"} in your cart

              </p>

              <strong className="floating-cart-total">

                ₹{cartSubtotal.toLocaleString("en-IN")}

              </strong>

            </div>

            <button

              className="floating-cart-action"

              onClick={() => navigate("/cart")}

            >

              Go to Cart <span aria-hidden="true">→</span>

            </button>

            <button

              className="floating-cart-dismiss"

              onClick={() => setCartBarDismissed(true)}

              aria-label="Dismiss cart bar"

              title="Dismiss"

            >

              ×

            </button>

          </section>

        </div>

      )}

    </div>

  );

}

export default Pizzas;