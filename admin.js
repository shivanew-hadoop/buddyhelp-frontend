console.log("Admin JS Loaded-NB");

const API = "https://buddyhelp-backend.onrender.com";
let ADMIN_EMAIL = ""; // Show admin name in UI

/* -------------------- ADMIN LOGIN -------------------- */
async function adminLogin() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  ADMIN_EMAIL = email; // Save admin name for display

  const res = await fetch(API + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.error) {
    alert("Login failed: " + data.error);
    return;
  }

  // Hide login screen
  document.getElementById("loginBox").style.display = "none";

  // Show dashboard & header
  document.getElementById("dashboard").style.display = "block";
  document.getElementById("header").style.display = "flex";

  // Display admin name
  document.getElementById("adminName").innerText = "Logged in as: " + ADMIN_EMAIL;

  loadUsers();
}

/* -------------------- LOAD USERS -------------------- */
async function loadUsers() {
  const res = await fetch(API + "/admin/users");
  const data = await res.json();

  const container = document.getElementById("users");
  container.innerHTML = "";

  if (!data.users || data.users.length === 0) {
    container.innerHTML = "<p>No users found</p>";
    return;
  }

  data.users.forEach(u => {
    const joined = u.created_at ? u.created_at.substring(0, 10) : "N/A";

    const card = document.createElement("div");
    card.className = "userCard";

    card.innerHTML = `
      <h3>${u.name}</h3>
      <div class="userDetail"><b>Email:</b> ${u.email}</div>
      <div class="userDetail"><b>Phone:</b> ${u.phone}</div>
      <div class="userDetail"><b>Country:</b> ${u.country}</div>
      <div class="userDetail"><b>Joined:</b> ${joined}</div>
      <div class="userDetail"><b>Status:</b> <span id="status-${u.id}">${u.status}</span></div>
      <div class="userDetail"><b>Credits:</b> <span id="credits-${u.id}">${u.credits.remaining_seconds}</span></div>

      <div class="btnRow">
        <button class="approveBtn" onclick="approveUser('${u.id}')">Approve</button>
        <button class="creditBtn" onclick="addCreditsPrompt('${u.id}')">Add Credits</button>
      </div>
    `;

    container.appendChild(card);
  });
}

/* -------------------- APPROVE USER -------------------- */
async function approveUser(uid) {
  await fetch(API + "/admin/approve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: uid })
  });

  document.getElementById("status-" + uid).innerText = "ACTIVE";
  alert("User approved successfully");
}

/* -------------------- ADD CREDITS -------------------- */
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

  // Refresh UI for this user only
  const res = await fetch(API + "/admin/users");
  const data = await res.json();
  const updatedUser = data.users.find(x => x.id === uid);

  if (updatedUser) {
    document.getElementById("credits-" + uid).innerText = updatedUser.credits.remaining_seconds;
  }
}
