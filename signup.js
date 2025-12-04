console.log("Signup JS Loaded");

const API = "https://buddyhelp-backend.onrender.com";

async function signup() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const country = document.getElementById("country").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Email and password required");
        return;
    }

    const res = await fetch(`${API}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, country, password })
    });

    const data = await res.json();
    console.log("Signup response:", data);

    if (data.error) {
        alert("Signup failed: " + data.error);
        return;
    }

    alert("Signup successful, waiting for admin approval!");
}
