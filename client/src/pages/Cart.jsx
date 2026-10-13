import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";



function Cart() {
  const { user } = useAuth();

   const {

      cartItems,

      addToCart,

      decreaseQuantity,

      removeFromCart,

   } = useCart();



   const total = cartItems.reduce(

      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),

      0

   );



   const totalItems = cartItems.reduce(

      (sum, item) => sum + Number(item.quantity || 0),

      0

   );



   const formatPrice = (price) =>

      Number(price || 0).toLocaleString("en-IN", {

         maximumFractionDigits: 2,

      });



   // Use the unique cart key for customized items.

   // Fall back to the pizza ID for older cart entries.

   const getCartItemId = (item) => item.cartKey || item._id;



   const hasCustomizations = (item) =>

      Boolean(

         item.cartKey ||

         item.size ||

         item.crust ||

         item.cheese ||

         (Array.isArray(item.toppings) && item.toppings.length)

      );



   return (

      <div className="cart-page">

         <style>{`

            .cart-page {

               min-height: 100vh;

               padding: 46px 0 72px;

               background: #fffaf5;

               color: #302019;

            }



            .cart-container {

               width: min(1200px, 92%);

               margin: 0 auto;

            }



            .cart-eyebrow {

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



            .cart-title {

               margin: 0;

               color: #302019 !important;

               font-size: clamp(30px, 4vw, 42px);

               font-weight: 850;

               letter-spacing: -1.3px;

            }



            .cart-subtitle {

               margin-top: 10px;

               color: #817168;

               font-size: 15px;

               line-height: 1.7;

            }



            .cart-content {

               display: grid;

               grid-template-columns: minmax(0, 1fr) 350px;

               align-items: start;

               gap: 28px;

               margin-top: 36px;

            }



            .cart-items-column { min-width: 0; }



            .cart-items-heading {

               display: flex;

               align-items: center;

               justify-content: space-between;

               gap: 12px;

               margin-bottom: 18px;

            }



            .cart-section-title {

               margin: 0;

               color: #302019 !important;

               font-size: 20px;

               font-weight: 800;

            }



            .cart-count {

               padding: 6px 11px;

               border-radius: 30px;

               background: #ffeadb;

               color: #b94718;

               font-size: 12px;

               font-weight: 800;

            }



            .cart-item-card {

               display: grid;

               grid-template-columns: 140px minmax(0, 1fr);

               gap: 20px;

               margin-bottom: 17px;

               padding: 18px;

               border: 1px solid #f0e5dc;

               border-radius: 20px;

               background: white;

               box-shadow: 0 5px 18px rgba(73, 39, 20, 0.045);

               transition: box-shadow 0.2s ease;

            }



            .cart-item-card:hover {

               box-shadow: 0 10px 28px rgba(73, 39, 20, 0.09);

            }



            .cart-item-image,

            .cart-item-placeholder {

               width: 140px;

               height: 140px;

               display: flex;

               align-items: center;

               justify-content: center;

               border-radius: 14px;

               object-fit: cover;

               background: #f5e8dd;

            }



            .cart-item-placeholder { font-size: 34px; }



            .cart-item-details {

               min-width: 0;

               display: flex;

               flex-direction: column;

               justify-content: space-between;

               gap: 16px;

            }



            .cart-item-name {

               margin: 0 0 7px;

               color: #302019 !important;

               font-size: 19px;

               font-weight: 800;

               overflow-wrap: anywhere;

            }



            .cart-item-unit-price {

               margin: 0;

               color: #817168;

               font-size: 13px;

            }



            .cart-customization {

               display: flex;

               flex-wrap: wrap;

               gap: 6px;

               margin-top: 11px;

            }



            .cart-customization-chip {

               padding: 5px 8px;

               border-radius: 7px;

               background: #fff3e9;

               color: #96502c;

               font-size: 10px;

               font-weight: 750;

               overflow-wrap: anywhere;

            }



            .cart-item-bottom {

               display: flex;

               align-items: center;

               justify-content: space-between;

               gap: 12px;

               flex-wrap: wrap;

            }



            .cart-item-subtotal {

               color: #302019;

               font-size: 18px;

               font-weight: 850;

            }



            .cart-quantity {

               display: inline-flex;

               align-items: center;

               gap: 12px;

               padding: 4px;

               border: 1px solid #f0e1d7;

               border-radius: 11px;

               background: #fffaf5;

            }



            .cart-quantity-button {

               width: 31px;

               height: 31px;

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



            .cart-quantity-button:hover { background: #ffeadb; }



            .cart-quantity-number {

               min-width: 18px;

               color: #302019;

               font-size: 15px;

               font-weight: 800;

               text-align: center;

            }



            .cart-quantity-button:focus-visible,

            .cart-remove-button:focus-visible,

            .cart-checkout-button:focus-visible,

            .cart-continue-button:focus-visible,

            .cart-empty-button:focus-visible {

               outline: 3px solid #f7b79a;

               outline-offset: 3px;

            }



            .cart-remove-button {

               padding: 5px 0;

               border: 0;

               background: transparent;

               color: #bd4a3c;

               font-size: 12px;

               font-weight: 750;

               cursor: pointer;

            }



            .cart-remove-button:hover {

               color: #912c22;

               text-decoration: underline;

            }



            .cart-summary {

               position: sticky;

               top: 100px;

               padding: 26px;

               border: 1px solid #f0e5dc;

               border-radius: 22px;

               background: white;

               box-shadow: 0 8px 28px rgba(73, 39, 20, 0.06);

            }



            .cart-summary-title {

               margin: 0 0 6px;

               color: #302019 !important;

               font-size: 23px;

               font-weight: 850;

            }



            .cart-summary-subtitle {

               margin: 0 0 24px;

               color: #99887e;

               font-size: 13px;

            }



            .cart-summary-line {

               display: flex;

               justify-content: space-between;

               gap: 12px;

               margin-bottom: 17px;

               color: #817168;

               font-size: 14px;

            }



            .cart-summary-value {

               color: #302019;

               font-weight: 750;

               text-align: right;

            }



            .cart-summary-divider {

               margin: 22px 0;

               border: 0;

               border-top: 1px solid #eee4dc;

            }



            .cart-summary-total {

               display: flex;

               align-items: center;

               justify-content: space-between;

               gap: 12px;

               margin-bottom: 22px;

               color: #302019;

               font-size: 16px;

               font-weight: 800;

            }



            .cart-summary-total-price {

               color: #b94718;

               font-size: 27px;

               font-weight: 900;

               letter-spacing: -0.8px;

            }



            .cart-checkout-button,

            .cart-empty-button {

               display: flex;

               min-height: 50px;

               align-items: center;

               justify-content: center;

               width: 100%;

               padding: 12px 16px;

               border: 0;

               border-radius: 12px;

               background: #f36c32;

               color: white;

               font-size: 14px;

               font-weight: 850;

               text-align: center;

               text-decoration: none;

               transition: background 0.2s ease, transform 0.2s ease;

            }



            .cart-checkout-button:hover,

            .cart-empty-button:hover {

               transform: translateY(-2px);

               background: #d94f1c;

               color: white;

            }



            .cart-continue-button {

               display: block;

               margin-top: 17px;

               color: #b94718;

               font-size: 13px;

               font-weight: 750;

               text-align: center;

               text-decoration: none;

            }



            .cart-continue-button:hover {

               color: #d94f1c;

               text-decoration: underline;

            }



            .cart-security-note {

               display: flex;

               align-items: center;

               justify-content: center;

               gap: 7px;

               margin-top: 20px;

               color: #99887e;

               font-size: 11px;

               text-align: center;

            }



            .cart-empty-card {

               padding: 56px 20px;

               border: 1px solid #f0e5dc;

               border-radius: 22px;

               background: white;

               text-align: center;

               box-shadow: 0 8px 28px rgba(73, 39, 20, 0.045);

            }



            .cart-empty-icon {

               width: 94px;

               height: 94px;

               display: flex;

               align-items: center;

               justify-content: center;

               margin: 0 auto 22px;

               border-radius: 50%;

               background: #ffeadb;

               font-size: 44px;

            }



            .cart-empty-title {

               margin: 0 0 10px;

               color: #302019 !important;

               font-size: 26px;

               font-weight: 850;

            }



            .cart-empty-text {

               margin: 0 0 26px;

               color: #817168;

               font-size: 14px;

               line-height: 1.7;

            }



            .cart-empty-button {

               display: inline-flex;

               width: auto;

               min-height: 47px;

               padding: 12px 22px;

            }



            @media (max-width: 950px) {

               .cart-content {

                  grid-template-columns: minmax(0, 1fr) 300px;

                  gap: 18px;

               }



               .cart-item-card {

                  grid-template-columns: 110px minmax(0, 1fr);

                  gap: 15px;

                  padding: 14px;

               }



               .cart-item-image,

               .cart-item-placeholder {

                  width: 110px;

                  height: 125px;

               }



               .cart-summary { padding: 21px; }

            }



            @media (max-width: 760px) {

               .cart-page { padding: 32px 0 50px; }



               .cart-content {

                  grid-template-columns: 1fr;

                  margin-top: 26px;

               }



               .cart-summary { position: static; }

            }



            @media (max-width: 480px) {

               .cart-item-card {

                  grid-template-columns: 88px minmax(0, 1fr);

                  gap: 12px;

                  padding: 12px;

                  border-radius: 15px;

               }



               .cart-item-image,

               .cart-item-placeholder {

                  width: 88px;

                  height: 100px;

                  border-radius: 10px;

               }



               .cart-item-name { font-size: 16px; }

               .cart-item-unit-price { font-size: 12px; }



               .cart-item-bottom {

                  align-items: flex-start;

                  flex-direction: column;

                  gap: 10px;

               }



               .cart-item-subtotal { font-size: 16px; }

               .cart-item-details { gap: 12px; }

               .cart-items-heading { align-items: flex-start; }

            }



            @media (prefers-reduced-motion: reduce) {

               .cart-item-card,

               .cart-checkout-button,

               .cart-empty-button { transition: none; }



               .cart-checkout-button:hover,

               .cart-empty-button:hover { transform: none; }

            }

         `}</style>



         <div className="cart-container">

            <header>

               <span className="cart-eyebrow">Almost time to eat</span>

               <h1 className="cart-title">Your Shopping Cart</h1>

               <p className="cart-subtitle">

                  Your favourites are waiting. Review your order before checkout.

               </p>

            </header>



            {cartItems.length === 0 ? (

               <div className="cart-empty-card mt-4">

                  <div className="cart-empty-icon">🍕</div>

                  <h2 className="cart-empty-title">Your cart is hungry!</h2>

                  <p className="cart-empty-text">

                     You haven't added any pizzas yet.

                     <br />

                     Explore the menu and find your next favourite slice.

                  </p>

                  <Link to="/pizzas" className="cart-empty-button">

                     Explore Our Pizzas →

                  </Link>

               </div>

            ) : (

               <div className="cart-content">

                  <section className="cart-items-column">

                     <div className="cart-items-heading">

                        <h2 className="cart-section-title">Your Items</h2>

                        <span className="cart-count">

                           {totalItems} {totalItems === 1 ? "item" : "items"}

                        </span>

                     </div>



                     {cartItems.map((item) => {

                        const itemId = getCartItemId(item);



                        return (

                           <article className="cart-item-card" key={itemId}>

                              <div>

                                 {item.image ? (

                                    <img

                                       src={item.image}

                                       alt={item.name}

                                       className="cart-item-image"

                                       loading="lazy"

                                    />

                                 ) : (

                                    <div

                                       className="cart-item-placeholder"

                                       role="img"

                                       aria-label="Pizza image unavailable"

                                    >

                                       🍕

                                    </div>

                                 )}

                              </div>



                              <div className="cart-item-details">

                                 <div>

                                    <h3 className="cart-item-name">{item.name}</h3>



                                    <p className="cart-item-unit-price">

                                       ₹{formatPrice(item.price)} per pizza

                                    </p>



                                    {hasCustomizations(item) && (

                                       <div

                                          className="cart-customization"

                                          aria-label="Selected pizza customizations"

                                       >

                                          {item.size && (

                                             <span className="cart-customization-chip">

                                                Size: {item.size}

                                             </span>

                                          )}



                                          {item.crust && (

                                             <span className="cart-customization-chip">

                                                Crust: {item.crust}

                                             </span>

                                          )}



                                          {item.cheese && (

                                             <span className="cart-customization-chip">

                                                Cheese: {item.cheese}

                                             </span>

                                          )}



                                          {Array.isArray(item.toppings) &&

                                             item.toppings.map((topping, index) => (

                                                <span

                                                   className="cart-customization-chip"

                                                   key={`${topping}-${index}`}

                                                >

                                                   {topping}

                                                </span>

                                             ))}

                                       </div>

                                    )}

                                 </div>



                                 <div className="cart-item-bottom">

                                    <div>

                                       <div

                                          style={{

                                             marginBottom: 3,

                                             color: "#99887e",

                                             fontSize: 11,

                                             fontWeight: 700,

                                             textTransform: "uppercase",

                                             letterSpacing: "0.6px",

                                          }}

                                       >

                                          Item subtotal

                                       </div>



                                       <div className="cart-item-subtotal">

                                          ₹{formatPrice(item.price * item.quantity)}

                                       </div>

                                    </div>



                                    <div>

                                       <div

                                          className="cart-quantity"

                                          aria-label={`Quantity of ${item.name}`}

                                       >

                                          <button

                                             type="button"

                                             className="cart-quantity-button"

                                             aria-label={`Decrease ${item.name} quantity`}

                                             onClick={() => decreaseQuantity(itemId)}

                                          >

                                             −

                                          </button>



                                          <span

                                             className="cart-quantity-number"

                                             aria-live="polite"

                                          >

                                             {item.quantity}

                                          </span>



                                          <button

                                             type="button"

                                             className="cart-quantity-button"

                                             aria-label={`Increase ${item.name} quantity`}

                                             onClick={() => addToCart(item, item)}

                                          >

                                             +

                                          </button>

                                       </div>



                                       <button

                                          type="button"

                                          className="cart-remove-button"

                                          onClick={() => removeFromCart(itemId)}

                                          style={{ marginTop: 8 }}

                                       >

                                          Remove item

                                       </button>

                                    </div>

                                 </div>

                              </div>

                           </article>

                        );

                     })}



                     <Link to="/pizzas" className="cart-continue-button">

                        ← Continue shopping

                     </Link>

                  </section>



                  <aside className="cart-summary">

                     <h2 className="cart-summary-title">Order Summary</h2>

                     <p className="cart-summary-subtitle">

                        A little happiness, coming right up.

                     </p>



                     <div className="cart-summary-line">

                        <span>Items</span>

                        <span className="cart-summary-value">{totalItems}</span>

                     </div>



                     <div className="cart-summary-line">

                        <span>Subtotal</span>

                        <span className="cart-summary-value">

                           ₹{formatPrice(total)}

                        </span>

                     </div>



                     <div className="cart-summary-line">

                        <span>Delivery fee</span>

                        <span className="cart-summary-value">

                           Calculated at checkout

                        </span>

                     </div>



                     <hr className="cart-summary-divider" />



                     <div className="cart-summary-total">

                        <span>Subtotal total</span>

                        <span className="cart-summary-total-price">

                           ₹{formatPrice(total)}

                        </span>

                     </div>



                     <Link
                  to={user ? "/checkout" : "/login"}
                  state={!user ? { from: "/checkout" } : undefined}
                  className="cart-checkout-button"
                >

                        Proceed to Checkout →

                     </Link>



                     <div className="cart-security-note">

                        <span>🔒</span>

                        <span>Review your order before placing it</span>

                     </div>

                  </aside>

               </div>

            )}

         </div>

      </div>

   );

}



export default Cart;