console.log("Admin JS Loaded-NS");

const API = "https://buddyhelp-backend.onrender.com";

async function adminLogin() {
  console.log("Login clicked");

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const res = await fetch(API + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  console.log("Admin login response:", data);

  if (data.error) {
    alert("Login failed: " + data.error);
    return;
  }

  // Login successful → hide login box, show dashboard
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("dashboard").style.display = "block";

  loadUsers();
}

async function loadUsers() {
  console.log("Loading users...");

  const res = await fetch(API + "/admin/users");
  const data = await res.json();

  console.log("Users:", data);

  const container = document.getElementById("users");
  container.innerHTML = "";

  if (!data.users || data.users.length === 0) {
    container.innerHTML = "<p>No users found</p>";
    return;
  }

  data.users.forEach(u => {
    const div = document.createElement("div");
    div.className = "userCard";

    div.innerHTML = `
      <h3>${u.name} <small>(${u.country})</small></h3>
      <p>Status: <b>${u.status}</b></p>
      <p>Credits: <b>${u.credits.remaining_seconds}</b></p>

      <div class="btnRow">
        <button class="approveBtn" onclick="approveUser('${u.id}')">Approve</button>
        <button class="creditBtn" onclick="addCreditsPrompt('${u.id}')">Add Credits</button>
      </div>
    `;

    container.appendChild(div);
  });
}

async function approveUser(uid) {
  await fetch(API + "/admin/approve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: uid })
  });

  alert("User approved");
  loadUsers();
}

function addCreditsPrompt(uid) {
  const sec = prompt("Enter seconds to add:");
  if (!sec || isNaN(sec)) return;

  addCredits(uid, parseInt(sec));
}

async function addCredits(uid, sec) {
  await fetch(API + "/admin/add-credits", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: uid, seconds: sec })
  });

  alert("Credits added");
  loadUsers();
}
