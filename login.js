async function login() {
  const body = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };

  const res = await fetch("https://buddyhelp-backend.onrender.com", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(body)
  });

  const data = await res.json();

  if (data.error) return alert(data.error);

  localStorage.setItem("token", data.token);
  localStorage.setItem("userId", data.userId);

  window.location = "app.html";
}
