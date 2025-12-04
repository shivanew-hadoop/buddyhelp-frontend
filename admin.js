console.log("Admin JS LOADED");

const BASE_URL = "https://buddyhelp-backend.onrender.com";
let adminToken = null;

// Admin login (using Supabase admin user)
async function adminLogin() {
    console.log("adminLogin called");

    const email = document.getElementById("adminEmail").value;
    const password = document.getElementById("adminPassword").value;

    if (!email || !password) {
        alert("Enter admin email & password");
        return;
    }

    const res = await fetch(BASE_URL + "/login", {
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

    adminToken = data.token;

    alert("Admin login successful!");
    loadUsers();
}

// Load all users
async function loadUsers() {
    console.log("loadUsers called");

    const res = await fetch(BASE_URL + "/admin/users");
    const data = await res.json();

    console.log("Users response:", data);

    if (!data.users) {
        document.getElementById("users").innerHTML = "No users found";
        return;
    }

    const html = data.users.map(u => `
        <div style="margin-bottom:10px;">
            <b>${u.name}</b> (${u.id})<br>
            Status: ${u.status}<br>
            Credits: ${u.credits?.remaining_seconds}<br>

            <button onclick="approve('${u.id}')">Approve</button>
            <button onclick="addCreditsPrompt('${u.id}')">Add Credits</button>
        </div>
    `).join("");

    document.getElementById("users").innerHTML = html;
}

async function approve(uid) {
    await fetch(BASE_URL + "/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: uid })
    });
    alert("Approved");
    loadUsers();
}

function addCreditsPrompt(uid) {
    const sec = prompt("Enter seconds to add:");
    if (!sec) return;
    addCredits(uid, parseInt(sec));
}

async function addCredits(uid, seconds) {
    await fetch(BASE_URL + "/admin/add-credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: uid, seconds })
    });
    alert("Credits added");
    loadUsers();
}
