
import { Link } from "react-router-dom";

function Home() {
  const features = [
    {
      icon: "🍕",
      title: "Freshly Baked",
      description:
        "Made fresh to order with quality ingredients and delicious toppings.",
      color: "#fff0e6",
    },
    {
      icon: "🛵",
      title: "Fast Delivery",
      description:
        "Your favorite pizza delivered to your doorstep, hot and ready to enjoy.",
      color: "#e8f5e9",
    },
    {
      icon: "💳",
      title: "Easy Payments",
      description:
        "Choose Cash on Delivery or Razorpay online payment at checkout.",
      color: "#eaf0ff",
    },
  ];

  return (
    <main style={{ backgroundColor: "#fffdf9" }}>
      {/* Hero Section */}
      <section
        className="position-relative overflow-hidden text-white"
        style={{
          background:
            "radial-gradient(ellipse at 80% 45%, #51251a 0%, #241512 42%, #171211 100%)",
        }}
      >
        <div
          className="position-absolute rounded-circle"
          aria-hidden="true"
          style={{
            width: "350px",
            height: "350px",
            background: "rgba(255, 153, 51, 0.08)",
            filter: "blur(45px)",
            top: "-130px",
            right: "-80px",
          }}
        />

        <div className="container position-relative py-4 py-lg-5">
          <div className="row align-items-center">
            <div className="col-lg-6 py-4 text-center text-lg-start">
              <span
                className="d-inline-block rounded-pill px-3 py-2 mb-4 fw-semibold"
                style={{
                  backgroundColor: "rgba(255, 174, 66, 0.14)",
                  color: "#ffbd69",
                  border: "1px solid rgba(255, 189, 105, 0.25)",
                  fontSize: "0.85rem",
                }}
              >
                ✦ FRESHLY BAKED, MADE WITH LOVE
              </span>

              <h1
  className="fw-bold mb-4"
  style={{
    color: "#fffaf4",
    fontSize: "clamp(2.7rem, 5vw, 4.5rem)",
    lineHeight: 1.08,
    letterSpacing: "-2px",
  }}
>
  Good pizza.
  <br />
  <span style={{ color: "#ffb347" }}>
    Great moments.
  </span>
</h1>

              <p
                className="mb-4 mx-auto mx-lg-0"
                style={{
                  color: "#d5c8c2",
                  fontSize: "1.1rem",
                  lineHeight: 1.9,
                  maxWidth: "490px",
                }}
              >
                Crispy crusts, rich cheese, and your favorite
                toppings. Find your perfect pizza and make
                every bite count.
              </p>

              <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3">
                <Link
                  to="/pizzas"
                  className="btn btn-lg fw-bold px-4 py-3"
                  style={{
                    backgroundColor: "#ffad42",
                    color: "#241512",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 8px 25px rgba(255, 173, 66, 0.2)",
                  }}
                >
                  Order Your Pizza <span aria-hidden="true">→</span>
                </Link>

                <Link
                  to="/pizzas"
                  className="btn btn-outline-light btn-lg px-4 py-3"
                  style={{ borderRadius: "12px" }}
                >
                  Explore Menu
                </Link>
              </div>

              <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-4 mt-5">
                <div>
                  <div className="fw-bold fs-5">Fresh</div>
                  <small style={{ color: "#bca9a0" }}>
                    Made to order
                  </small>
                </div>

                <div
                  style={{
                    width: "1px",
                    backgroundColor: "#59423a",
                  }}
                />

                <div>
                  <div className="fw-bold fs-5">Flavorful</div>
                  <small style={{ color: "#bca9a0" }}>
                    Every single bite
                  </small>
                </div>

                <div
                  style={{
                    width: "1px",
                    backgroundColor: "#59423a",
                  }}
                />

                <div>
                  <div className="fw-bold fs-5">Easy</div>
                  <small style={{ color: "#bca9a0" }}>
                    Simple ordering
                  </small>
                </div>
              </div>
            </div>

            <div className="col-lg-6 text-center mt-5 mt-lg-0">
              <div
                className="position-relative mx-auto"
                style={{ maxWidth: "490px" }}
              >
                <div
                  className="position-absolute top-50 start-50 translate-middle rounded-circle"
                  aria-hidden="true"
                  style={{
                    width: "78%",
                    aspectRatio: "1",
                    backgroundColor: "#ffad42",
                    opacity: 0.12,
                    filter: "blur(35px)",
                  }}
                />

                <img
                  src="https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=1000&q=85"
                  alt="Freshly baked pizza with cheese and toppings"
                  className="position-relative img-fluid"
                  style={{
                    width: "100%",
                    maxWidth: "460px",
                    aspectRatio: "1",
                    objectFit: "cover",
                    borderRadius: "50%",
                    border: "8px solid rgba(255, 255, 255, 0.08)",
                    boxShadow: "0 25px 70px rgba(0, 0, 0, 0.4)",
                  }}
                />

                <div
                  className="position-absolute bottom-0 start-50 translate-middle-x mb-3 rounded-pill px-4 py-3 fw-semibold"
                  style={{
                    backgroundColor: "#fffaf4",
                    color: "#382016",
                    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.25)",
                    whiteSpace: "nowrap",
                  }}
                >
                  🍕 Your next favorite is waiting
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container py-lg-4">
          <div className="text-center mb-5">
            <span
              className="fw-bold text-uppercase"
              style={{
                color: "#d97722",
                letterSpacing: "2px",
                fontSize: "0.8rem",
              }}
            >
              THE DIFFERENCE
            </span>

            <h2
              className="fw-bold mt-3 mb-3"
              style={{
                color: "#271a16",
                fontSize: "clamp(1.9rem, 3vw, 2.7rem)",
              }}
            >
              A little more delicious.
            </h2>

            <p className="text-secondary mx-auto" style={{ maxWidth: "550px" }}>
              Great ingredients, convenient ordering, and a
              pizza experience made for your cravings.
            </p>
          </div>

          <div className="row g-4">
            {features.map((feature) => (
              <div className="col-md-4" key={feature.title}>
                <article
                  className="h-100 p-4 p-lg-5"
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #f0e9e1",
                    borderRadius: "20px",
                    boxShadow: "0 8px 30px rgba(51, 33, 20, 0.045)",
                    transition:
                      "transform 180ms ease, box-shadow 180ms ease",
                  }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.transform =
                      "translateY(-5px)";
                    event.currentTarget.style.boxShadow =
                      "0 16px 35px rgba(51, 33, 20, 0.09)";
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.transform = "translateY(0)";
                    event.currentTarget.style.boxShadow =
                      "0 8px 30px rgba(51, 33, 20, 0.045)";
                  }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center mb-4"
                    style={{
                      width: "66px",
                      height: "66px",
                      borderRadius: "18px",
                      backgroundColor: feature.color,
                      fontSize: "2rem",
                    }}
                    aria-hidden="true"
                  >
                    {feature.icon}
                  </div>

                  <h3
                    className="fw-bold mb-3"
                    style={{ color: "#2b1b16", fontSize: "1.3rem" }}
                  >
                    {feature.title}
                  </h3>

                  <p
                    className="mb-0"
                    style={{ color: "#746963", lineHeight: 1.8 }}
                  >
                    {feature.description}
                  </p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call To Action */}
      <section className="pb-5">
        <div className="container pb-lg-4">
          <div
            className="text-center text-white p-4 p-md-5"
            style={{
              background:
                "linear-gradient(120deg, #3a2019, #211412)",
              borderRadius: "24px",
            }}
          >
            <div className="mb-3" style={{ fontSize: "2.5rem" }}>
              🍕
            </div>

            <h2
              className="fw-bold mb-3"
              style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}
            >
              Your pizza moment starts here.
            </h2>

            <p
              className="mb-4 mx-auto"
              style={{ color: "#d8c8c0", maxWidth: "500px" }}
            >
              Explore the menu, pick your favorites, and get
              ready for something delicious.
            </p>

            <Link
              to="/pizzas"
              className="btn btn-lg fw-bold px-4 py-3"
              style={{
                backgroundColor: "#ffad42",
                color: "#241512",
                borderRadius: "12px",
                border: "none",
              }}
            >
              Browse Our Pizzas →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
