async function signup() {
  const body = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    country: document.getElementById("country").value,
    password: document.getElementById("password").value
  };

  const res = await fetch("https://your-backend.onrender.com/signup", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(body)
  });

  const data = await res.json();
  alert(data.message || data.error);
}
