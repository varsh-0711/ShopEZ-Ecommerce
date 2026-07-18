import { useState } from "react";
import { useApp } from "../context/AppContext";
import ProductImage from "../components/ProductImage";
import { fmt } from "../utils/format";

export default function CartPage() {
  const { cart, changeCartQty, removeFromCart, navigate, user, setShowLogin, showToast, placeOrder } = useApp();
  const [checkoutStep, setCheckoutStep] = useState("cart"); // "cart" or "checkout"
  const [paymentMethod, setPaymentMethod] = useState("upi"); // "upi", "card", "netbanking", "cod"
  const [address, setAddress] = useState("123, Sample Street, Hyderabad – 500001");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [selectedBank, setSelectedBank] = useState("State Bank of India (SBI)");
  const [formError, setFormError] = useState("");
  const [placing, setPlacing] = useState(false);

  const subtotal = cart.reduce((a, c) => a + c.price * c.qty, 0);
  const origTotal = cart.reduce((a, c) => a + c.originalPrice * c.qty, 0);
  const savings = origTotal - subtotal;
  const shipping = subtotal > 500 ? 0 : 49;
  const total = subtotal + shipping;

  const handleProceed = () => {
    if (!user) { setShowLogin(true); return; }
    setCheckoutStep("checkout");
  };

  const handlePlaceOrder = async () => {
    if (!user) { setShowLogin(true); return; }

    setFormError("");
    if (!address.trim()) { setFormError("Delivery address is required."); return; }
    if (paymentMethod === "upi" && !upiId.trim()) { setFormError("Please enter your UPI ID."); return; }
    if (paymentMethod === "card") {
      if (!cardNumber.trim() || cardNumber.length < 16) { setFormError("Please enter a valid 16-digit Card Number."); return; }
      if (!cardExpiry.trim()) { setFormError("Please enter Expiry Date (MM/YY)."); return; }
      if (!cardCvv.trim() || cardCvv.length < 3) { setFormError("Please enter a valid CVV."); return; }
    }

    try {
      setPlacing(true);
      await placeOrder({
        address,
        paymentMethod,
        upiId,
        cardNumber,
        cardExpiry,
        cardCvv,
        selectedBank,
      });
      showToast("Order placed successfully! 🎉", "success");
      navigate("orders");
    } catch (e) {
      setFormError(e?.response?.data?.message || "Could not place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (cart.length === 0) return (
    <div style={{ textAlign: "center", padding: 80, background: "#fff", margin: 16, borderRadius: 8 }}>
      <div style={{ fontSize: 80 }}>🛒</div>
      <div style={{ fontSize: 22, fontWeight: 700, marginTop: 16 }}>Your cart is empty!</div>
      <div style={{ fontSize: 14, color: "#878787", marginTop: 8 }}>Add items to continue shopping</div>
      <button style={{
        marginTop: 24, background: "#ff9f00", color: "#fff", border: "none", borderRadius: 4,
        padding: "12px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer"
      }}
        onClick={() => navigate("home")}>Continue Shopping</button>
    </div>
  );
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 12, padding: 12 }}>
      {checkoutStep === "cart" ? (
        <div>
          <div style={{ background: "#fff", borderRadius: 8, padding: "12px 18px", marginBottom: 8, fontWeight: 700, fontSize: 16 }}>
            My Cart ({cart.length} item{cart.length !== 1 ? "s" : ""})
          </div>
          {cart.map(item => (
            <div key={item.cartId} style={{
              background: "#fff", borderRadius: 8, padding: 16,
              display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 8, boxShadow: "0 1px 4px rgba(0,0,0,.06)"
            }}>
              <div style={{ width: 76, minWidth: 76 }}>
                <ProductImage product={item} height={76} emojiSize={40} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: "#878787", fontWeight: 600 }}>{item.brand}</div>
                <div style={{ fontWeight: 600, fontSize: 14, margin: "4px 0" }}>{item.name}</div>
                {item.selectedSize && (
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>
                    <span style={{ background: "#e8f0fe", color: "#2874f0", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                      Option/Size: {item.selectedSize}
                    </span>
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 18, fontWeight: 700 }}>{fmt(item.price)}</span>
                  <span style={{ fontSize: 12, color: "#878787", textDecoration: "line-through" }}>{fmt(item.originalPrice)}</span>
                  <span style={{ fontSize: 12, color: "#388e3c", fontWeight: 700 }}>{item.discount}% off</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button style={{
                      width: 30, height: 30, borderRadius: "50%", border: "1px solid #c2c2c2",
                      background: "#fff", cursor: "pointer", fontSize: 16, fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}
                      onClick={() => changeCartQty(item, item.qty - 1)}>−</button>
                    <span style={{ width: 32, textAlign: "center", fontWeight: 700 }}>{item.qty}</span>
                    <button style={{
                      width: 30, height: 30, borderRadius: "50%", border: "1px solid #c2c2c2",
                      background: "#fff", cursor: "pointer", fontSize: 16, fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}
                      onClick={() => changeCartQty(item, item.qty + 1)}>+</button>
                  </div>
                  <button style={{
                    background: "#fff", color: "#ff6161", border: "1px solid #ff6161",
                    borderRadius: 4, padding: "5px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer"
                  }}
                    onClick={() => removeFromCart(item)}>Remove</button>
                  <button style={{
                    background: "#fff", color: "#2874f0", border: "1px solid #2874f0",
                    borderRadius: 4, padding: "5px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer"
                  }}>
                    Save for Later
                  </button>
                </div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 17, minWidth: 80, textAlign: "right" }}>{fmt(item.price * item.qty)}</div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {/* Back button */}
          <button onClick={() => setCheckoutStep("cart")}
            style={{ background: "none", border: "none", color: "#2874f0", fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 14, display: "flex", alignItems: "center", gap: 4 }}>
            ← Back to Cart
          </button>

          {/* Delivery Address */}
          <div style={{ background: "#fff", borderRadius: 8, padding: 20, marginBottom: 12, boxShadow: "0 1px 4px rgba(0,0,0,.08)" }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, color: "#212121" }}>📍 Delivery Address</div>
            <textarea
              value={address}
              onChange={e => setAddress(e.target.value)}
              style={{ width: "100%", height: 70, border: "1px solid #ccc", borderRadius: 6, padding: "8px 12px", fontSize: 13, fontFamily: "inherit", outline: "none", resize: "none" }}
              placeholder="Enter complete shipping address..."
            />
          </div>

          {/* Payment Selection */}
          <div style={{ background: "#fff", borderRadius: 8, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,.08)" }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, color: "#212121" }}>💳 Payment Method</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* UPI */}
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                <input type="radio" name="payment" checked={paymentMethod === "upi"} onChange={() => setPaymentMethod("upi")} style={{ accentColor: "#2874f0", marginTop: 3 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>UPI (GPay / PhonePe / Paytm)</div>
                  <div style={{ fontSize: 12, color: "#878787", marginTop: 2 }}>Pay instantly from your bank account using UPI apps.</div>
                  {paymentMethod === "upi" && (
                    <div style={{ marginTop: 10, background: "#f9f9f9", padding: 10, borderRadius: 6, border: "1px solid #e0e0e0" }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>Enter UPI ID</div>
                      <input type="text" placeholder="username@bank" value={upiId} onChange={e => setUpiId(e.target.value)}
                        style={{ width: "100%", padding: "8px 12px", borderRadius: 4, border: "1px solid #ccc", fontSize: 13, outline: "none" }} />
                      <div style={{ fontSize: 11, color: "#878787", marginTop: 4 }}>Your transaction is secured with standard UPI encryption.</div>
                    </div>
                  )}
                </div>
              </label>

              <div style={{ height: 1, background: "#f0f0f0" }} />

              {/* Card */}
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                <input type="radio" name="payment" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} style={{ accentColor: "#2874f0", marginTop: 3 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Credit / Debit Card</div>
                  <div style={{ fontSize: 12, color: "#878787", marginTop: 2 }}>All major Visa, MasterCard, RuPay, and Amex cards supported.</div>
                  {paymentMethod === "card" && (
                    <div style={{ marginTop: 10, background: "#f9f9f9", padding: 12, borderRadius: 6, border: "1px solid #e0e0e0", display: "flex", flexDirection: "column", gap: 8 }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#555", marginBottom: 4 }}>Card Number</div>
                        <input type="text" maxLength="16" placeholder="XXXX XXXX XXXX XXXX" value={cardNumber} onChange={e => setCardNumber(e.target.value.replace(/\D/g, ""))}
                          style={{ width: "100%", padding: "8px 12px", borderRadius: 4, border: "1px solid #ccc", fontSize: 13, outline: "none" }} />
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: "#555", marginBottom: 4 }}>Expiry Date</div>
                          <input type="text" maxLength="5" placeholder="MM/YY" value={cardExpiry} onChange={e => setCardExpiry(e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: 4, border: "1px solid #ccc", fontSize: 13, outline: "none" }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: "#555", marginBottom: 4 }}>CVV</div>
                          <input type="password" maxLength="3" placeholder="***" value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g, ""))}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: 4, border: "1px solid #ccc", fontSize: 13, outline: "none" }} />
                        </div>
                      </div>
                      <div style={{ fontSize: 11, color: "#388e3c", marginTop: 4 }}>🔒 Secure 256-bit SSL encrypted connection.</div>
                    </div>
                  )}
                </div>
              </label>

              <div style={{ height: 1, background: "#f0f0f0" }} />

              {/* Net Banking */}
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                <input type="radio" name="payment" checked={paymentMethod === "netbanking"} onChange={() => setPaymentMethod("netbanking")} style={{ accentColor: "#2874f0", marginTop: 3 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Net Banking</div>
                  <div style={{ fontSize: 12, color: "#878787", marginTop: 2 }}>Select your bank to redirect to their secure website.</div>
                  {paymentMethod === "netbanking" && (
                    <div style={{ marginTop: 10, background: "#f9f9f9", padding: 10, borderRadius: 6, border: "1px solid #e0e0e0" }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>Select Bank</div>
                      <select value={selectedBank} onChange={e => setSelectedBank(e.target.value)}
                        style={{ width: "100%", padding: "8px 12px", borderRadius: 4, border: "1px solid #ccc", fontSize: 13, outline: "none", background: "#fff" }}>
                        <option>State Bank of India (SBI)</option>
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>Axis Bank</option>
                        <option>Kotak Mahindra Bank</option>
                      </select>
                    </div>
                  )}
                </div>
              </label>

              <div style={{ height: 1, background: "#f0f0f0" }} />

              {/* COD */}
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                <input type="radio" name="payment" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} style={{ accentColor: "#2874f0", marginTop: 3 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Cash on Delivery (COD)</div>
                  <div style={{ fontSize: 12, color: "#878787", marginTop: 2 }}>Pay with cash when your package is delivered.</div>
                  {paymentMethod === "cod" && (
                    <div style={{ marginTop: 10, background: "#fff3e0", padding: 12, borderRadius: 6, border: "1px solid #ffe0b2", fontSize: 12, color: "#e65100", lineHeight: 1.5 }}>
                      ⚠️ Please ensure exact cash is ready at the time of delivery. A standard COD handling fee of ₹20 applies, but has been <strong>waived</strong> for this promotional order!
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>
      )}
      {/* Summary */}
      <div>
        <div style={{ background: "#fff", borderRadius: 8, padding: 20, position: "sticky", top: 70, boxShadow: "0 1px 4px rgba(0,0,0,.08)" }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: "#878787", marginBottom: 16, letterSpacing: 1 }}>PRICE DETAILS</div>
          {[[`Price (${cart.length} items)`, fmt(origTotal)], ["Discount", "− " + fmt(savings), "#388e3c"], ["Delivery Charges", shipping === 0 ? "FREE ✓" : fmt(shipping), "#388e3c"]].map(([k, v, c]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 14 }}>
              <span>{k}</span><span style={{ fontWeight: 500, color: c || "#212121" }}>{v}</span>
            </div>
          ))}
          <div style={{
            borderTop: "1px dashed #e0e0e0", paddingTop: 12, marginTop: 4,
            display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 18
          }}>
            <span>Total Amount</span><span>{fmt(total)}</span>
          </div>
          <div style={{
            background: "#e8f5e9", color: "#388e3c", borderRadius: 4,
            padding: "9px 12px", fontSize: 13, fontWeight: 600, marginTop: 14
          }}>
            🎉 You will save {fmt(savings)} on this order!
          </div>
          {formError && (
            <div style={{ color: "#d32f2f", background: "#ffebee", padding: "8px 12px", borderRadius: 4, fontSize: 12, fontWeight: 600, marginTop: 12 }}>
              ⚠️ {formError}
            </div>
          )}
          <button disabled={placing} style={{
            width: "100%", marginTop: 16, background: "#fb641b", color: "#fff", border: "none",
            borderRadius: 4, padding: 14, fontSize: 16, fontWeight: 700, cursor: placing ? "default" : "pointer",
            opacity: placing ? .7 : 1
          }}
            onClick={checkoutStep === "cart" ? handleProceed : handlePlaceOrder}>
            {placing ? "Placing order..." : checkoutStep === "cart" ? "Proceed to Checkout →" : "Confirm & Place Order →"}
          </button>
          <div style={{ marginTop: 14, textAlign: "center" }}>
            <div style={{ fontSize: 12, color: "#878787", marginBottom: 6 }}>🔒 Safe & Secure Payments</div>
            <div style={{ fontSize: 20 }}>💳 🏦 📱 💵</div>
          </div>
        </div>
      </div>
    </div>
  );
}
