import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000/api";

function AdminDashboard() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [pizzas, setPizzas] = useState([]);
  const [showPizzaForm, setShowPizzaForm] = useState(false);
  const [editingPizzaId, setEditingPizzaId] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingPizzas, setLoadingPizzas] = useState(true);
  const [savingPizza, setSavingPizza] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [searchPizza, setSearchPizza] = useState("");
  const [searchOrder, setSearchOrder] = useState("");
  const [activeTab, setActiveTab] = useState("pizzas");
  const [notice, setNotice] = useState(null);


const [pizzaForm, setPizzaForm] = useState({
  name: "",
  description: "",
  price: "",
  image: "",
  category: "veg",
  ingredients: "",
  isAvailable: true,
  stockQuantity: 50,
  lowStockThreshold: 10,
});


  const token = () => localStorage.getItem("token");

  const headers = () => ({
    Authorization: `Bearer ${token()}`,
  });

  const notify = (message, type = "success") => {
    setNotice({ message, type });
    window.setTimeout(() => setNotice(null), 3500);
  };

  useEffect(() => {
    if (!user || user.role !== "admin") return;

    fetchOrders();
    fetchPizzas();
  }, [user]);

  const fetchOrders = async () => {
    setLoadingOrders(true);

    try {
      const response = await axios.get(`${API}/orders`, {
        headers: headers(),
      });
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      notify("Could not load orders. Please try again.", "error");
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchPizzas = async () => {
    setLoadingPizzas(true);

    try {
      const response = await axios.get(`${API}/pizzas`);
      setPizzas(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch pizzas:", error);
      notify("Could not load pizzas. Please try again.", "error");
    } finally {
      setLoadingPizzas(false);
    }
  };


const resetPizzaForm = () => {
  setPizzaForm({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "veg",
    ingredients: "",
    isAvailable: true,
    stockQuantity: 50,
    lowStockThreshold: 10,
  });

  setEditingPizzaId(null);
  setShowPizzaForm(false);
};



const preparePizzaData = () => ({
  ...pizzaForm,
  price: Number(pizzaForm.price),
  stockQuantity: Number(pizzaForm.stockQuantity),
  lowStockThreshold: Number(pizzaForm.lowStockThreshold),
  ingredients: pizzaForm.ingredients
    .split(",")
    .map((ingredient) => ingredient.trim())
    .filter(Boolean),
});


  const addPizza = async (event) => {
    event.preventDefault();

    if (!pizzaForm.name.trim() || pizzaForm.price === "" ||
        Number(pizzaForm.price) < 0) {
      notify("Enter a pizza name and a valid price.", "error");
      return;
    }

    setSavingPizza(true);

    try {
      await axios.post(`${API}/pizzas`, preparePizzaData(), {
        headers: headers(),
      });

      resetPizzaForm();
      await fetchPizzas();
      notify("Pizza added successfully.");
    } catch (error) {
      notify(
        error.response?.data?.message || "Failed to add pizza.",
        "error"
      );
    } finally {
      setSavingPizza(false);
    }
  };

  const startEditingPizza = (pizza) => {
  setEditingPizzaId(pizza._id);

  setPizzaForm({
    name: pizza.name || "",
    description: pizza.description || "",
    price: pizza.price ?? "",
    image: pizza.image || "",
    category: pizza.category || "veg",
    ingredients: Array.isArray(pizza.ingredients)
      ? pizza.ingredients.join(", ")
      : "",
    isAvailable: pizza.isAvailable ?? true,
    stockQuantity: pizza.stockQuantity ?? 50,
    lowStockThreshold: pizza.lowStockThreshold ?? 10,
  });

  setShowPizzaForm(true);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

  const updatePizza = async (event) => {
    event.preventDefault();

    if (!pizzaForm.name.trim() || pizzaForm.price === "" ||
        Number(pizzaForm.price) < 0) {
      notify("Enter a pizza name and a valid price.", "error");
      return;
    }

    setSavingPizza(true);

    try {
      await axios.put(
        `${API}/pizzas/${editingPizzaId}`,
        preparePizzaData(),
        { headers: headers() }
      );

      resetPizzaForm();
      await fetchPizzas();
      notify("Pizza updated successfully.");
    } catch (error) {
      notify(
        error.response?.data?.message || "Failed to update pizza.",
        "error"
      );
    } finally {
      setSavingPizza(false);
    }
  };

  const deletePizza = async (pizzaId) => {
    if (!window.confirm("Are you sure you want to delete this pizza?")) {
      return;
    }

    try {
      await axios.delete(`${API}/pizzas/${pizzaId}`, {
        headers: headers(),
      });

      await fetchPizzas();
      notify("Pizza deleted successfully.");
    } catch (error) {
      notify(
        error.response?.data?.message || "Failed to delete pizza.",
        "error"
      );
    }
  };

  const updateStatus = async (orderId, status) => {
    setUpdatingOrderId(orderId);

    try {
      await axios.put(
        `${API}/orders/${orderId}/status`,
        { status },
        { headers: headers() }
      );

      await fetchOrders();
      notify("Order status updated.");
    } catch (error) {
      notify(
        error.response?.data?.message || "Failed to update order status.",
        "error"
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const filteredPizzas = pizzas.filter((pizza) =>
    `${pizza.name} ${pizza.category}`
      .toLowerCase()
      .includes(searchPizza.toLowerCase())
  );

  const filteredOrders = orders.filter((order) =>
    `${order._id} ${order.user?.name || ""} ${order.user?.email || ""}`
      .toLowerCase()
      .includes(searchOrder.toLowerCase())
  );

  const money = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  const statusClass = (status) => {
    const normalized = (status || "").toLowerCase();

    if (normalized === "delivered") return "status-delivered";
    if (normalized === "cancelled") return "status-cancelled";
    if (normalized === "out-for-delivery") return "status-transit";
    if (normalized === "preparing") return "status-preparing";
    if (normalized === "confirmed") return "status-confirmed";
    return "status-placed";
  };

  if (!user) {
    return (
      <main className="admin-page">
        <div className="admin-access">
          <span className="admin-access-icon">🔐</span>
          <h2>Login required</h2>
          <p>Please log in to access the admin dashboard.</p>
          <a className="admin-btn admin-btn-primary" href="/login">
            Go to Login
          </a>
        </div>
        <AdminStyles />
      </main>
    );
  }

  if (user.role !== "admin") {
    return (
      <main className="admin-page">
        <div className="admin-access">
          <span className="admin-access-icon">⛔</span>
          <h2>Access denied</h2>
          <p>This dashboard is available to administrators only.</p>
          <a className="admin-btn admin-btn-primary" href="/">
            Back to Home
          </a>
        </div>
        <AdminStyles />
      </main>
    );
  }

  return (
    <main className="admin-page">
      <AdminStyles />

      {notice && (
        <div className={`admin-notice ${notice.type}`} role="status">
          <span>{notice.type === "success" ? "✓" : "!"}</span>
          {notice.message}
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => setNotice(null)}
          >
            ×
          </button>
        </div>
      )}

      <div className="admin-container">
        <header className="admin-hero">
          <div>
            <span className="admin-eyebrow">PIZZA ADMINISTRATION</span>
            <h1>Dashboard<span>.</span></h1>
            <p>Manage your menu, monitor orders, and keep every delivery moving.</p>
          </div>

          <div className="admin-welcome">
            <div className="admin-avatar">
              {(user.name || "A").charAt(0).toUpperCase()}
            </div>
            <div>
              <small>Signed in as</small>
              <strong>{user.name || "Administrator"}</strong>
              <span>Administrator</span>
            </div>
          </div>
        </header>

        <section className="admin-stats">
          <article className="admin-stat">
            <div className="admin-stat-icon orange">🍕</div>
            <div>
              <span>Total pizzas</span>
              <strong>{pizzas.length}</strong>
              <small>Menu items</small>
            </div>
          </article>

          <article className="admin-stat">
            <div className="admin-stat-icon brown">📦</div>
            <div>
              <span>Total orders</span>
              <strong>{orders.length}</strong>
              <small>All customer orders</small>
            </div>
          </article>

          <article className="admin-stat">
            <div className="admin-stat-icon green">✓</div>
            <div>
              <span>Available pizzas</span>
              <strong>{pizzas.filter((pizza) => pizza.isAvailable).length}</strong>
              <small>Ready to order</small>
            </div>
          </article>

          <article className="admin-stat">
            <div className="admin-stat-icon blue">🚚</div>
            <div>
              <span>Active orders</span>
              <strong>
                {orders.filter(
                  (order) =>
                    !["delivered", "cancelled"].includes(
                      (order.orderStatus || "").toLowerCase()
                    )
                ).length}
              </strong>
              <small>Not yet completed</small>
            </div>
          </article>
        </section>

        <nav className="admin-tabs" aria-label="Dashboard sections">
          <button
            type="button"
            className={activeTab === "pizzas" ? "active" : ""}
            onClick={() => setActiveTab("pizzas")}
          >
            🍕 Menu management
            <span>{pizzas.length}</span>
          </button>

          <button
            type="button"
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            📦 Order management
            <span>{orders.length}</span>
          </button>
        </nav>

        {activeTab === "pizzas" && (
          <section className="admin-section">
            <div className="admin-section-heading">
              <div>
                <span className="admin-eyebrow">YOUR MENU</span>
                <h2>Pizza management</h2>
                <p>Add new favourites or update the pizzas customers love.</p>
              </div>

              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={() => {
                  if (showPizzaForm) {
                    resetPizzaForm();
                  } else {
                    setEditingPizzaId(null);
                    setShowPizzaForm(true);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
              >
                {showPizzaForm ? "× Cancel" : "+ Add new pizza"}
              </button>
            </div>

            {showPizzaForm && (
              <form
                className="admin-form-card"
                onSubmit={editingPizzaId ? updatePizza : addPizza}
              >
                <div className="admin-form-heading">
                  <div>
                    <span className="admin-eyebrow">
                      {editingPizzaId ? "EDIT MENU ITEM" : "NEW MENU ITEM"}
                    </span>
                    <h3>{editingPizzaId ? "Update your pizza" : "Create a pizza"}</h3>
                  </div>
                  <span className="admin-form-emoji">🍕</span>
                </div>

                <div className="admin-form-grid">
                  <label>
                    Pizza name *
                    <input
                      required
                      type="text"
                      placeholder="e.g. Margherita Classic"
                      value={pizzaForm.name}
                      onChange={(event) =>
                        setPizzaForm({ ...pizzaForm, name: event.target.value })
                      }
                    />
                  </label>

                  <label>
                    Price (₹) *
                    <input
                      required
                      min="0"
                      type="number"
                      step="0.01"
                      placeholder="299"
                      value={pizzaForm.price}
                      onChange={(event) =>
                        setPizzaForm({ ...pizzaForm, price: event.target.value })
                      }
                    />
                  </label>

                  <label className="full">
                    Description
                    <textarea
                      rows="3"
                      placeholder="Describe the flavour and toppings..."
                      value={pizzaForm.description}
                      onChange={(event) =>
                        setPizzaForm({
                          ...pizzaForm,
                          description: event.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Image URL
                    <input
                      type="url"
                      placeholder="https://example.com/pizza.jpg"
                      value={pizzaForm.image}
                      onChange={(event) =>
                        setPizzaForm({ ...pizzaForm, image: event.target.value })
                      }
                    />
                  </label>

                  <label>
                    Category
                    <select
                      value={pizzaForm.category}
                      onChange={(event) =>
                        setPizzaForm({
                          ...pizzaForm,
                          category: event.target.value,
                        })
                      }
                    >
                      <option value="veg">Vegetarian</option>
                      <option value="non-veg">Non-vegetarian</option>
                    </select>
                  </label>

                  <label className="full">
                    Ingredients
                    <input
                      type="text"
                      placeholder="Mozzarella, tomato, basil"
                      value={pizzaForm.ingredients}
                      onChange={(event) =>
                        setPizzaForm({
                          ...pizzaForm,
                          ingredients: event.target.value,
                        })
                      }
                    />
                    <small>Separate each ingredient with a comma.</small>
                  </label>

<label>
  Stock quantity *
  <input
    required
    type="number"
    min="0"
    step="1"
    value={pizzaForm.stockQuantity}
    onChange={(event) =>
      setPizzaForm({
        ...pizzaForm,
        stockQuantity: event.target.value,
      })
    }
  />
  <small>Number of pizzas currently in stock.</small>
</label>

<label>
  Low-stock alert threshold *
  <input
    required
    type="number"
    min="0"
    step="1"
    value={pizzaForm.lowStockThreshold}
    onChange={(event) =>
      setPizzaForm({
        ...pizzaForm,
        lowStockThreshold: event.target.value,
      })
    }
  />
  <small>Show a warning when stock reaches this quantity or less.</small>
</label>


                  <label className="admin-availability full">
                    <input
                      type="checkbox"
                      checked={pizzaForm.isAvailable}
                      onChange={(event) =>
                        setPizzaForm({
                          ...pizzaForm,
                          isAvailable: event.target.checked,
                        })
                      }
                    />
                    <span>
                      <strong>Available to order</strong>
                      <small>Customers can order this pizza while enabled.</small>
                    </span>
                  </label>
                </div>

                <div className="admin-form-actions">
                  <button
                    type="button"
                    className="admin-btn admin-btn-light"
                    onClick={resetPizzaForm}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="admin-btn admin-btn-primary"
                    disabled={savingPizza}
                  >
                    {savingPizza
                      ? "Saving..."
                      : editingPizzaId
                        ? "Save changes"
                        : "Add pizza"}
                  </button>
                </div>
              </form>
            )}

            <div className="admin-list-heading">
              <div>
                <h3>All pizzas</h3>
                <p>{filteredPizzas.length} menu items</p>
              </div>

              <input
                className="admin-search"
                type="search"
                placeholder="Search pizzas..."
                value={searchPizza}
                onChange={(event) => setSearchPizza(event.target.value)}
                aria-label="Search pizzas"
              />
            </div>

            {loadingPizzas ? (
              <div className="admin-empty">
                <div className="admin-spinner" />
                <p>Loading your menu...</p>
              </div>
            ) : filteredPizzas.length === 0 ? (
              <div className="admin-empty">
                <span>🍕</span>
                <h3>{searchPizza ? "No matching pizzas" : "Your menu is empty"}</h3>
                <p>
                  {searchPizza
                    ? "Try a different search term."
                    : "Add your first pizza to get started."}
                </p>
              </div>
            ) : (
              <div className="admin-pizza-grid">
                {filteredPizzas.map((pizza) => (
                  <article className="admin-pizza-card" key={pizza._id}>
                    <div className="admin-pizza-image">
                      {pizza.image ? (
                        <img
                          src={pizza.image}
                          alt={pizza.name}
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <span>🍕</span>
                      )}

                      <span
                        className={`admin-availability-tag ${
                          pizza.isAvailable ? "available" : "unavailable"
                        }`}
                      >
                        {pizza.isAvailable ? "● Available" : "● Unavailable"}
                      </span>
                    </div>

                    <div className="admin-pizza-content">
                      <div className="admin-pizza-title">
                        <h4>{pizza.name}</h4>
                        <span
                          className={`admin-category ${
                            pizza.category === "veg" ? "veg" : "nonveg"
                          }`}
                          title={pizza.category === "veg" ? "Vegetarian" : "Non-vegetarian"}
                        >
                          <i />
                          {pizza.category === "veg" ? "Veg" : "Non-veg"}
                        </span>
                      </div>

                      <p className="admin-pizza-description">
                        {pizza.description || "No description added."}
                      </p>

                      {Array.isArray(pizza.ingredients) &&
                        pizza.ingredients.length > 0 && (
                          <p className="admin-ingredients">
                            {pizza.ingredients.join(" · ")}
                          </p>
                        )}

                      <div className="admin-pizza-footer">
                        <strong>{money(pizza.price)}</strong>
                        <div>
                          <button
                            type="button"
                            className="admin-icon-btn edit"
                            onClick={() => startEditingPizza(pizza)}
                            aria-label={`Edit ${pizza.name}`}
                          >
                            ✎ Edit
                          </button>
                          <button
                            type="button"
                            className="admin-icon-btn delete"
                            onClick={() => deletePizza(pizza._id)}
                            aria-label={`Delete ${pizza.name}`}
                          >
                            × Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "orders" && (
          <section className="admin-section">
            <div className="admin-section-heading">
              <div>
                <span className="admin-eyebrow">CUSTOMER ACTIVITY</span>
                <h2>Order management</h2>
                <p>Track customer purchases and update delivery progress.</p>
              </div>

              <button
                type="button"
                className="admin-btn admin-btn-light"
                onClick={fetchOrders}
                disabled={loadingOrders}
              >
                ↻ {loadingOrders ? "Refreshing..." : "Refresh orders"}
              </button>
            </div>

            <div className="admin-list-heading">
              <div>
                <h3>Customer orders</h3>
                <p>{filteredOrders.length} orders found</p>
              </div>

              <input
                className="admin-search"
                type="search"
                placeholder="Search order or customer..."
                value={searchOrder}
                onChange={(event) => setSearchOrder(event.target.value)}
                aria-label="Search orders"
              />
            </div>

            {loadingOrders ? (
              <div className="admin-empty">
                <div className="admin-spinner" />
                <p>Loading customer orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="admin-empty">
                <span>📦</span>
                <h3>{searchOrder ? "No matching orders" : "No orders yet"}</h3>
                <p>
                  {searchOrder
                    ? "Try searching by another order ID or customer."
                    : "Customer orders will appear here when they place them."}
                </p>
              </div>
            ) : (
              <div className="admin-order-list">
                {filteredOrders.map((order) => (
                  <article className="admin-order-card" key={order._id}>
                    <div className="admin-order-top">
                      <div>
                        <span className="admin-eyebrow">ORDER REFERENCE</span>
                        <h3>#{order._id}</h3>
                        <p>
                          Customer: <strong>{order.user?.name || "Customer"}</strong>
                        </p>
                        {order.user?.email && <p>{order.user.email}</p>}
                      </div>

                      <div className="admin-order-total">
                        <strong>{money(order.totalAmount)}</strong>
                        <span className={`admin-status ${statusClass(order.orderStatus)}`}>
                          {(order.orderStatus || "placed").replaceAll("-", " ")}
                        </span>
                      </div>
                    </div>

                    <div className="admin-order-info">
                      <div>
                        <span>PAYMENT METHOD</span>
                        <strong>{order.paymentMethod || "Not specified"}</strong>
                      </div>
                      <div>
                        <span>PAYMENT STATUS</span>
                        <strong>{order.paymentStatus || "Not specified"}</strong>
                      </div>
                      <div>
                        <span>DELIVERY ADDRESS</span>
                        <strong>{order.deliveryAddress || "Not provided"}</strong>
                      </div>
                    </div>

                    <div className="admin-order-items">
                      <h4>Order items</h4>
                      {(order.items || []).map((item, index) => (
                        <div
                          className="admin-order-item"
                          key={item._id || `${item.name}-${index}`}
                        >
                          <span>
                            {item.name} <small>× {item.quantity}</small>
                          </span>
                          <strong>{money(Number(item.price) * Number(item.quantity))}</strong>
                        </div>
                      ))}
                    </div>

                    <div className="admin-order-bottom">
                      <div>
                        <span className="admin-eyebrow">UPDATE DELIVERY STATUS</span>
                        <p>Keep the customer’s order progress up to date.</p>
                      </div>

                      <select
                        aria-label={`Update status for order ${order._id}`}
                        value={order.orderStatus || "placed"}
                        disabled={updatingOrderId === order._id}
                        onChange={(event) =>
                          updateStatus(order._id, event.target.value)
                        }
                      >
                        <option value="placed">Placed</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="out-for-delivery">Out for delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        <footer className="admin-footer">
          <span>🍕</span>
          <p>Good food, smoothly managed.</p>
        </footer>
      </div>
    </main>
  );
}

function AdminStyles() {
  return (
    <style>{`
      .admin-page {
        --admin-orange: #f36c32;
        --admin-orange-dark: #dd5520;
        --admin-brown: #302019;
        --admin-muted: #81766f;
        --admin-border: #eee4db;
        min-height: 100vh;
        padding: 38px 20px 24px;
        background: #fffaf5;
        color: var(--admin-brown);
        font-family: inherit;
      }

      .admin-page * { box-sizing: border-box; }
      .admin-container { width: 100%; max-width: 1240px; margin: 0 auto; }
      .admin-hero {
        display: flex; justify-content: space-between; align-items: center;
        gap: 24px; margin-bottom: 30px;
      }
      .admin-eyebrow {
        display: block; color: var(--admin-orange); font-size: 10px;
        font-weight: 800; letter-spacing: 1.8px; margin-bottom: 8px;
      }
      .admin-hero h1 { font-size: clamp(32px, 4vw, 46px); letter-spacing: -1.8px; font-weight: 850; margin: 0; }
      .admin-hero h1 span { color: var(--admin-orange); }
      .admin-hero p, .admin-section-heading p, .admin-list-heading p {
        margin: 8px 0 0; color: var(--admin-muted); font-size: 14px;
      }
      .admin-welcome {
        display: flex; align-items: center; gap: 12px; padding: 13px 17px;
        background: white; border: 1px solid var(--admin-border); border-radius: 16px;
      }
      .admin-avatar {
        width: 44px; height: 44px; border-radius: 14px; display: grid;
        place-items: center; background: #fff0e7; color: var(--admin-orange);
        font-weight: 800; font-size: 20px;
      }
      .admin-welcome small, .admin-welcome strong, .admin-welcome span { display: block; }
      .admin-welcome small { color: var(--admin-muted); font-size: 11px; }
      .admin-welcome strong { font-size: 14px; margin: 3px 0; }
      .admin-welcome span { font-size: 11px; color: var(--admin-orange); font-weight: 700; }
      .admin-stats {
        display: grid; grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 16px; margin-bottom: 30px;
      }
      .admin-stat {
        display: flex; align-items: center; gap: 14px; padding: 20px;
        border: 1px solid var(--admin-border); border-radius: 18px;
        background: white; box-shadow: 0 4px 18px #42230b06;
      }
      .admin-stat-icon {
        width: 48px; height: 48px; flex: 0 0 48px; border-radius: 15px;
        display: grid; place-items: center; font-size: 21px;
      }
      .admin-stat-icon.orange { background: #fff0e7; }
      .admin-stat-icon.brown { background: #f2e9e2; }
      .admin-stat-icon.green { background: #e6f5e9; color: #287b43; }
      .admin-stat-icon.blue { background: #e8f1ff; }
      .admin-stat span, .admin-stat strong, .admin-stat small { display: block; }
      .admin-stat span { color: var(--admin-muted); font-size: 12px; }
      .admin-stat strong { font-size: 27px; line-height: 1.3; font-weight: 850; }
      .admin-stat small { font-size: 11px; color: #a19891; }
      .admin-tabs {
        display: flex; gap: 8px; padding: 7px; background: #f2eae3;
        border-radius: 15px; width: fit-content; max-width: 100%; margin-bottom: 30px;
      }
      .admin-tabs button {
        border: 0; border-radius: 10px; padding: 12px 17px; background: transparent;
        color: #756960; font-size: 13px; font-weight: 750; cursor: pointer;
      }
      .admin-tabs button.active { color: white; background: var(--admin-brown); }
      .admin-tabs button span {
        display: inline-grid; place-items: center; min-width: 22px; height: 22px;
        margin-left: 7px; border-radius: 20px; background: #ffffff25; font-size: 11px;
      }
      .admin-section { animation: adminFadeIn .2s ease-out; }
      @keyframes adminFadeIn { from { opacity: .5; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      .admin-section-heading {
        display: flex; justify-content: space-between; align-items: center;
        gap: 18px; margin-bottom: 25px;
      }
      .admin-section-heading h2 { font-size: 27px; font-weight: 850; letter-spacing: -.7px; margin: 0; }
      .admin-btn {
        display: inline-flex; align-items: center; justify-content: center; gap: 7px;
        border: 1px solid transparent; border-radius: 11px; padding: 12px 17px;
        font-size: 13px; font-weight: 750; cursor: pointer; text-decoration: none;
        transition: transform .15s, background .15s; white-space: nowrap;
      }
      .admin-btn:hover { transform: translateY(-1px); }
      .admin-btn:disabled { opacity: .6; cursor: not-allowed; transform: none; }
      .admin-btn-primary { color: white; background: var(--admin-orange); }
      .admin-btn-primary:hover { background: var(--admin-orange-dark); color: white; }
      .admin-btn-light { background: white; color: var(--admin-brown); border-color: var(--admin-border); }
      .admin-form-card {
        background: white; border: 1px solid var(--admin-border); border-radius: 20px;
        padding: 25px; margin-bottom: 30px; box-shadow: 0 8px 30px #42230b08;
      }
      .admin-form-heading { display: flex; justify-content: space-between; align-items: center; margin-bottom: 23px; }
      .admin-form-heading h3 { margin: 0; font-size: 22px; font-weight: 850; }
      .admin-form-emoji { font-size: 32px; }
      .admin-form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 19px; }
      .admin-form-grid label { display: flex; flex-direction: column; gap: 8px; font-size: 12px; font-weight: 750; }
      .admin-form-grid label.full { grid-column: 1 / -1; }
      .admin-form-grid input:not([type="checkbox"]), .admin-form-grid textarea, .admin-form-grid select,
      .admin-search, .admin-order-bottom select {
        width: 100%; min-width: 0; border: 1px solid #e8ded5; border-radius: 10px;
        background: #fffdfa; color: var(--admin-brown); padding: 12px 13px;
        font: inherit; font-size: 13px; outline: none; transition: border .15s, box-shadow .15s;
      }
      .admin-form-grid input:focus, .admin-form-grid textarea:focus, .admin-form-grid select:focus,
      .admin-search:focus, .admin-order-bottom select:focus {
        border-color: var(--admin-orange); box-shadow: 0 0 0 3px #f36c321a;
      }
      .admin-form-grid textarea { resize: vertical; }
      .admin-form-grid label small { color: var(--admin-muted); font-weight: 400; }
      .admin-availability { display: flex !important; flex-direction: row !important; align-items: center; gap: 12px !important; padding: 15px; background: #fffaf5; border-radius: 12px; }
      .admin-availability input { accent-color: var(--admin-orange); width: 17px; height: 17px; }
      .admin-availability span strong, .admin-availability span small { display: block; }
      .admin-availability span strong { font-size: 13px; }
      .admin-availability span small { margin-top: 4px; }
      .admin-form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 22px; }
      .admin-list-heading { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin: 30px 0 18px; }
      .admin-list-heading h3 { font-size: 19px; font-weight: 850; margin: 0; }
      .admin-list-heading p { font-size: 12px; }
      .admin-search { max-width: 300px; background: white; }
      .admin-pizza-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
      .admin-pizza-card {
        overflow: hidden; background: white; border: 1px solid var(--admin-border);
        border-radius: 18px; box-shadow: 0 5px 20px #42230b07; transition: transform .2s, box-shadow .2s;
      }
      .admin-pizza-card:hover { transform: translateY(-3px); box-shadow: 0 12px 30px #42230b10; }
      .admin-pizza-image { height: 195px; position: relative; display: grid; place-items: center; background: #f4e8dc; overflow: hidden; }
      .admin-pizza-image img { width: 100%; height: 100%; object-fit: cover; }
      .admin-pizza-image > span:first-child { font-size: 55px; }
      .admin-availability-tag { position: absolute; top: 12px; left: 12px; padding: 7px 10px; border-radius: 20px; background: white; font-size: 10px; font-weight: 800; }
      .admin-availability-tag.available { color: #287b43; }
      .admin-availability-tag.unavailable { color: #a04b43; }
      .admin-pizza-content { padding: 18px; }
      .admin-pizza-title { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
      .admin-pizza-title h4 { font-size: 17px; font-weight: 850; margin: 0; }
      .admin-category { display: inline-flex; align-items: center; gap: 5px; padding: 5px 7px; border-radius: 6px; font-size: 9px; font-weight: 800; white-space: nowrap; }
      .admin-category i { display: block; width: 7px; height: 7px; border: 1px solid currentColor; border-radius: 2px; }
      .admin-category.veg { color: #268046; background: #eaf7ed; }
      .admin-category.nonveg { color: #b94a40; background: #fff0ed; }
      .admin-pizza-description { color: var(--admin-muted); font-size: 12px; line-height: 1.7; min-height: 40px; margin: 10px 0; }
      .admin-ingredients { color: #a19891; font-size: 10px; line-height: 1.6; margin: 0 0 14px; }
      .admin-pizza-footer { display: flex; align-items: center; justify-content: space-between; gap: 10px; border-top: 1px solid #f2eae3; padding-top: 15px; }
      .admin-pizza-footer > strong { font-size: 20px; font-weight: 850; white-space: nowrap; }
      .admin-pizza-footer > div { display: flex; gap: 6px; }
      .admin-icon-btn { border: 1px solid var(--admin-border); background: white; border-radius: 8px; padding: 7px 9px; font-size: 11px; font-weight: 750; cursor: pointer; }
      .admin-icon-btn.edit { color: #a65a24; }
      .admin-icon-btn.delete { color: #bd4941; }
      .admin-icon-btn:hover { background: #fff6ef; }
      .admin-order-list { display: grid; gap: 18px; }
      .admin-order-card { background: white; border: 1px solid var(--admin-border); border-radius: 18px; padding: 23px; box-shadow: 0 5px 20px #42230b06; }
      .admin-order-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; padding-bottom: 20px; border-bottom: 1px solid #f1e9e2; }
      .admin-order-top h3 { font-size: 17px; overflow-wrap: anywhere; margin: 0 0 9px; font-weight: 850; }
      .admin-order-top p { margin: 4px 0; color: var(--admin-muted); font-size: 12px; overflow-wrap: anywhere; }
      .admin-order-total { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; }
      .admin-order-total > strong { font-size: 24px; font-weight: 850; }
      .admin-status { display: inline-block; padding: 7px 10px; border-radius: 20px; text-transform: capitalize; font-size: 10px; font-weight: 800; }
      .status-placed { color: #926014; background: #fff3d6; }
      .status-confirmed { color: #275ea8; background: #e8f1ff; }
      .status-preparing { color: #9a531e; background: #fff0df; }
      .status-transit { color: #6947a4; background: #f0eaff; }
      .status-delivered { color: #287b43; background: #e6f5e9; }
      .status-cancelled { color: #a43c36; background: #ffeded; }
      .admin-order-info { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 13px; padding: 20px 0; }
      .admin-order-info > div { background: #fffaf5; border-radius: 11px; padding: 13px; min-width: 0; }
      .admin-order-info span, .admin-order-info strong { display: block; }
      .admin-order-info span { color: #9b8e83; font-size: 9px; font-weight: 800; letter-spacing: .8px; margin-bottom: 8px; }
      .admin-order-info strong { font-size: 12px; overflow-wrap: anywhere; line-height: 1.5; }
      .admin-order-items h4 { font-size: 13px; font-weight: 850; margin: 0 0 8px; }
      .admin-order-item { display: flex; justify-content: space-between; gap: 12px; padding: 10px 0; border-bottom: 1px dashed #eee4db; font-size: 12px; }
      .admin-order-item small { color: var(--admin-muted); }
      .admin-order-item strong { white-space: nowrap; }
      .admin-order-bottom { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-top: 20px; padding-top: 18px; border-top: 1px solid #f1e9e2; }
      .admin-order-bottom p { margin: 0; color: var(--admin-muted); font-size: 11px; }
      .admin-order-bottom select { max-width: 220px; background: white; }
      .admin-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 230px; text-align: center; background: white; border: 1px dashed #e5d6c9; border-radius: 18px; padding: 30px; }
      .admin-empty > span { font-size: 38px; }
      .admin-empty h3 { font-size: 18px; font-weight: 850; margin: 12px 0 5px; }
      .admin-empty p { font-size: 13px; color: var(--admin-muted); margin: 0; }
      .admin-spinner { width: 30px; height: 30px; border: 3px solid #f2dfd2; border-top-color: var(--admin-orange); border-radius: 50%; animation: adminSpin .7s linear infinite; }
      @keyframes adminSpin { to { transform: rotate(360deg); } }
      .admin-access { max-width: 480px; margin: 70px auto; padding: 40px 24px; text-align: center; background: white; border: 1px solid var(--admin-border); border-radius: 20px; }
      .admin-access-icon { font-size: 40px; }
      .admin-access h2 { margin: 14px 0 8px; font-weight: 850; }
      .admin-access p { color: var(--admin-muted); margin-bottom: 22px; font-size: 14px; }
      .admin-notice { position: fixed; z-index: 1100; top: 18px; right: 18px; display: flex; align-items: center; gap: 10px; max-width: calc(100vw - 36px); padding: 13px 15px; border-radius: 12px; box-shadow: 0 8px 30px #0002; background: white; font-size: 13px; font-weight: 700; }
      .admin-notice.success { color: #287b43; border: 1px solid #ccebd4; }
      .admin-notice.error { color: #a43c36; border: 1px solid #f0d0cd; }
      .admin-notice button { border: 0; background: transparent; color: inherit; font-size: 20px; cursor: pointer; margin-left: 8px; }
      .admin-footer { display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 42px; color: #a19891; font-size: 11px; }
      .admin-footer p { margin: 0; }

      @media (max-width: 1000px) {
        .admin-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .admin-pizza-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }
      @media (max-width: 650px) {
        .admin-page { padding: 24px 13px; }
        .admin-hero { align-items: flex-start; flex-direction: column; }
        .admin-welcome { width: 100%; }
        .admin-stats { gap: 10px; }
        .admin-stat { padding: 13px; gap: 10px; }
        .admin-stat-icon { width: 38px; height: 38px; flex-basis: 38px; font-size: 17px; border-radius: 11px; }
        .admin-stat strong { font-size: 22px; }
        .admin-stat span { font-size: 10px; }
        .admin-stat small { font-size: 9px; }
        .admin-tabs { width: 100%; }
        .admin-tabs button { flex: 1; padding: 10px 7px; font-size: 11px; }
        .admin-section-heading { align-items: flex-start; flex-direction: column; }
        .admin-section-heading h2 { font-size: 24px; }
        .admin-form-card { padding: 17px; }
        .admin-form-grid { grid-template-columns: 1fr; gap: 15px; }
        .admin-form-grid label.full { grid-column: auto; }
        .admin-list-heading { align-items: stretch; flex-direction: column; }
        .admin-search { max-width: none; }
        .admin-pizza-grid { grid-template-columns: 1fr; }
        .admin-pizza-image { height: 210px; }
        .admin-order-card { padding: 16px; }
        .admin-order-top { flex-direction: column; }
        .admin-order-total { align-items: flex-start; }
        .admin-order-info { grid-template-columns: 1fr; gap: 8px; }
        .admin-order-bottom { align-items: stretch; flex-direction: column; }
        .admin-order-bottom select { max-width: none; }
        .admin-form-actions { flex-direction: column-reverse; }
        .admin-form-actions .admin-btn { width: 100%; }
      }
    `}</style>
  );
}

export default AdminDashboard;