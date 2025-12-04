console.log("Admin JS LOADED");

const API = "https://buddyhelp-backend.onrender.com";

async function adminLogin() {
    console.log("adminLogin called");

    const email = document.getElementById("adminEmail").value;
    const password = document.getElementById("adminPassword").value;

    const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    console.log("Admin login response:", data);

    if (data.error) {
        alert("Login failed: " + data.error);
        return;
    }

    localStorage.setItem("adminToken", data.token);
    loadUsers();
}

async function loadUsers() {
    console.log("loadUsers called");

    const res = await fetch(`${API}/admin/users`);
    const data = await res.json();

    console.log("Users response:", data);

    const container = document.getElementById("users");

    if (!data.users || data.users.length === 0) {
        container.innerHTML = "<p>No users found</p>";
        return;
    }

    container.innerHTML = "";

    data.users.forEach(u => {
        const div = document.createElement("div");
        div.innerHTML = `
            <p><strong>${u.name}</strong> (${u.country})  
            - Status: ${u.status}  
            - Credits: ${u.credits?.remaining_seconds}</p>
            <button onclick="approve('${u.id}')">Approve</button>
            <button onclick="addCredits('${u.id}')">Add Credits</button>
            <hr/>
        `;
        container.appendChild(div);
    });
}

async function approve(userId) {
    await fetch(`${API}/admin/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
    });

    loadUsers();
}

async function addCredits(userId) {
    const sec = prompt("Enter seconds to add:");
    await fetch(`${API}/admin/add-credits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, seconds: Number(sec) })
    });

    loadUsers();
}
