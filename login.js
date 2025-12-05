const API = "https://buddyhelp-backend.onrender.com";

/* ---------------------------------------
   LOGIN  (FINAL WORKING VERSION)
--------------------------------------- */
async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const res = await fetch(API + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.error) {
    alert(data.error);
    return;
  }

  // STORE TOKEN + FULL USER
  localStorage.setItem("bh_token", data.token);
  localStorage.setItem("bh_user", JSON.stringify(data.user));

  window.location.href = "app.html";
}

/* ---------------------------------------
   SIGNUP (unchanged)
--------------------------------------- */
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

/* ---------------------------------------
   PASSWORD RESET (unchanged)
--------------------------------------- */
async function resetPassword() {
  const email = document.getElementById("forgotEmail").value;

  await fetch(API + "/auth/v1/recover", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });

  alert("If email exists, reset link sent.");
}

/* ---------------------------------------
   TAB SWITCH
--------------------------------------- */
function switchTab(tab) {
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("signupForm").classList.add("hidden");
  document.getElementById("forgotForm").classList.add("hidden");

  document.getElementById("loginTab").classList.remove("activeTab");
  document.getElementById("signupTab").classList.remove("activeTab");
  document.getElementById("forgotTab").classList.remove("activeTab");

  document.getElementById(tab + "Form").classList.remove("hidden");
  document.getElementById(tab + "Tab").classList.add("activeTab");
}
