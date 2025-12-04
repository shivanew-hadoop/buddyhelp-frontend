const BASE_URL = "https://buddyhelp-backend.onrender.com";

let adminToken = null;

async function adminLogin() {
    const email = document.getElementById("adminEmail").value;
    const password = document.getElementById("adminPassword").value;

    const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!data.token) {
        alert(data.error || "Login failed");
        return;
    }

    adminToken = data.token;
    loadUsers();
}

async function loadUsers() {
    const res = await fetch(`${BASE_URL}/admin/users`);
    const data = await res.json();

    const usersDiv = document.getElementById("users");
    usersDiv.innerHTML = "";

    let html = `
        <table>
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Country</th>
            <th>Status</th>
            <th>Credits</th>
            <th>Approve</th>
            <th>Add Credits</th>
        </tr>
    `;

    data.users.forEach(u => {
        html += `
            <tr>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td>${u.country}</td>
                <td>${u.status}</td>
                <td>${u.credits?.remaining_seconds || 0}</td>
                <td>
                    <button onclick="approveUser('${u.id}')">Approve</button>
                </td>
                <td>
                    <button onclick="addCreditsPrompt('${u.id}')">Add</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";
    usersDiv.innerHTML = html;
}

async function approveUser(userId) {
    await fetch(`${BASE_URL}/admin/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
    });

    alert("Approved");
    loadUsers();
}

async function addCreditsPrompt(userId) {
    const seconds = prompt("Enter seconds to add:");
    if (!seconds) return;

    await fetch(`${BASE_URL}/admin/add-credits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, seconds: Number(seconds) })
    });

    alert("Credits added");
    loadUsers();
}
