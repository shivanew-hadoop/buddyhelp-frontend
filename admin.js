async function loadUsers() {
  const res = await fetch("https://your-backend.onrender.com/admin/users");
  const data = await res.json();

  const box = document.getElementById("users");
  box.innerHTML = "";

  data.users.forEach(u => {
    box.innerHTML += `
      <hr>
      <b>${u.name}</b> (${u.status})<br>
      Email: ${u.email}<br>
      Phone: ${u.phone}<br>
      Country: ${u.country}<br>
      Credits: ${u.credits?.remaining_seconds || 0}<br><br>

      <button onclick="approve('${u.id}')">Approve</button>
      <button onclick="addCredits('${u.id}')">Add 3600 Sec</button>
      <br><br>
    `;
  });
}

async function approve(id) {
  await fetch("https://your-backend.onrender.com/admin/approve", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ userId: id })
  });
  loadUsers();
}

async function addCredits(id) {
  await fetch("https://your-backend.onrender.com/admin/add-credits", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ userId: id, seconds: 3600 })
  });
  loadUsers();
}

loadUsers();
