const API = "https://buddyhelp-backend.onrender.com";

/* LOGIN */
async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const res = await fetch(API + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.error) return alert(data.error);

  alert("Login successful");
  window.location.href = "app.html";
}

/* SIGNUP */
async function signup() {
  const body = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    country: document.getElementById("country").value,
    password: document.getElementById("password").value
  };

  const res = await fetch(API + "/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  alert(data.message || data.error);
}

/* PASSWORD RESET */
async function resetPassword() {
  const email = document.getElementById("forgotEmail").value;

  const res = await fetch(API + "/auth/v1/recover", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });

  alert("If the email exists, reset link has been sent.");
}
