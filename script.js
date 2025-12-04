const API = "https://buddyhelp-backend.onrender.com";

// LOGIN CHECK
if (!localStorage.getItem("userId")) {
  window.location = "login.html";
}

const userId = localStorage.getItem("userId");
const email = localStorage.getItem("email");

// DISPLAY EMAIL
document.getElementById("emailBox").innerText = email;

// UPDATE CREDITS DISPLAY
async function fetchCredits() {
  const res = await fetch(`${API}/credits/${userId}`);
  const data = await res.json();
  document.getElementById("creditBox").innerText = data.remaining;
  return data.remaining;
}
setInterval(fetchCredits, 3000);
fetchCredits();

// LOGOUT
function logout() {
  localStorage.clear();
  window.location = "login.html";
}

// ==============================
// AUDIO + CHAT + WHISPER LOGIC
// ==============================
//
// (You MUST paste your entire working audio logic here.
//  I am adding only the credit enforcement + tick system.)

let isRunning = false;

// START BUTTON HANDLER
document.getElementById("startBtn").onclick = async () => {
  const remaining = await fetchCredits();
  if (remaining <= 0) {
    alert("Your credits are finished. Contact admin.");
    return;
  }

  startTick();
  startMic(); // your mic logic
  isRunning = true;
};

// STOP BUTTON HANDLER
document.getElementById("stopBtn").onclick = () => {
  stopTick();
  stopAllAudio(); // your audio stop logic
  isRunning = false;
};

// ========== CREDIT TICK SYSTEM ==========
let tickTimer = null;

function startTick() {
  tickTimer = setInterval(async () => {
    const res = await fetch(`${API}/tick`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    });
    const data = await res.json();

    if (data.exhausted) {
      stopTick();
      stopAllAudio();
      alert("Your credits are finished.");
      return;
    }
  }, 1000);
}

function stopTick() {
  if (tickTimer) clearInterval(tickTimer);
}

// ========== SEND TO CHAT ==========
document.getElementById("sendBtn").onclick = async () => {
  const text = document.getElementById("promptBox").value.trim();
  if (!text) return;

  const res = await fetch(`${API}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: text })
  });

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  const box = document.getElementById("responseBox");
  box.innerText = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    box.innerText += decoder.decode(value);
  }
};

// ========== CLEAR ==========
document.getElementById("resetBtn").onclick = () => {
  document.getElementById("promptBox").value = "";
};

// ========== SYSTEM AUDIO ==========
document.getElementById("sysBtn").onclick = () => {
  enableSystemAudio(); // from your full audio code
};
