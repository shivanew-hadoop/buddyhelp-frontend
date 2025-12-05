//--------------------------------------------------------------
// CONFIG
//--------------------------------------------------------------
const API = "https://buddyhelp-backend.onrender.com";

const TARGET_SR = 16000;
const FLUSH_EVERY_MS = 1100;
const OVERLAP_MS = 250;

let mediaRecorder = null;
let mixedStream = null;
let audioChunks = [];
let systemEnabled = false;
let context;
let analyser;

//--------------------------------------------------------------
// SESSION VALIDATION
//--------------------------------------------------------------
const token = localStorage.getItem("bh_token");
const user = JSON.parse(localStorage.getItem("bh_user") || "{}");

if (!token || !user.id) {
  window.location.href = "login.html";
}

document.getElementById("emailBox").innerText = user.email;
document.getElementById("creditBox").innerText = user.credits;

//--------------------------------------------------------------
// LOGOUT
//--------------------------------------------------------------
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

//--------------------------------------------------------------
// DOM ELEMENTS
//--------------------------------------------------------------
const promptBox = document.getElementById("promptBox");
const responseBox = document.getElementById("responseBox");

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const sysBtn = document.getElementById("sysBtn");
const resetBtn = document.getElementById("resetBtn");
const sendBtn = document.getElementById("sendBtn");

const instructionsBox = document.getElementById("instructionsBox");
const resumeInput = document.getElementById("resumeInput");

const sendStatus = document.getElementById("sendStatus");
const audioStatus = document.getElementById("audioStatus");
const instrStatus = document.getElementById("instrStatus");
const resumeStatus = document.getElementById("resumeStatus");

//--------------------------------------------------------------
// TIMELINE / TRANSCRIPT MGMT
//--------------------------------------------------------------
resetBtn.onclick = () => {
  promptBox.value = "";
  sendStatus.innerText = "Transcript cleared.";
};

//--------------------------------------------------------------
// SEND TO CHATGPT
//--------------------------------------------------------------
sendBtn.onclick = async () => {
  const text = promptBox.value.trim();
  if (!text) return;

  sendStatus.innerText = "Sending...";

  const payload = {
    prompt:
      text +
      "\n\nCUSTOM INSTRUCTIONS:\n" +
      (instructionsBox.value || "") +
      "\n\nRESUME:\n" +
      (localStorage.getItem("resumeText") || "")
  };

  const res = await fetch(API + "/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  responseBox.innerText = "";
  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    responseBox.innerText += decoder.decode(value);
  }

  sendStatus.innerText = "Response received.";
};

//--------------------------------------------------------------
// CUSTOM INSTRUCTIONS SAVE
//--------------------------------------------------------------
instructionsBox.oninput = () => {
  localStorage.setItem("customInstructions", instructionsBox.value);
  instrStatus.innerText = "Saved.";
};
instructionsBox.value = localStorage.getItem("customInstructions") || "";

//--------------------------------------------------------------
// RESUME UPLOAD
//--------------------------------------------------------------
resumeInput.onchange = async () => {
  const file = resumeInput.files[0];
  if (!file) return;

  resumeStatus.innerText = "Extracting...";

  const form = new FormData();
  form.append("file", file);

  const res = await fetch(API + "/extract", {
    method: "POST",
    body: form
  });

  const data = await res.json();
  localStorage.setItem("resumeText", data.text);

  resumeStatus.innerText = "Resume saved.";
};

//--------------------------------------------------------------
// AUDIO PIPELINE
//--------------------------------------------------------------
async function getMicStream() {
  return await navigator.mediaDevices.getUserMedia({ audio: true });
}

async function getSystemStream() {
  return await navigator.mediaDevices.getDisplayMedia({
    audio: true,
    video: true
  });
}

async function startRecording() {
  try {
    audioStatus.innerText = "Starting...";

    const micStream = await getMicStream();
    const tracks = [...micStream.getAudioTracks()];

    if (systemEnabled) {
      const sysStream = await getSystemStream();
      tracks.push(...sysStream.getAudioTracks());
    }

    mixedStream = new MediaStream(tracks);

    mediaRecorder = new MediaRecorder(mixedStream, {
      mimeType: "audio/webm"
    });

    mediaRecorder.ondataavailable = (e) => {
      audioChunks.push(e.data);
      if (audioChunks.length >= 1) sendChunk();
    };

    mediaRecorder.start(1000);
    audioStatus.innerText = "Recording...";
  } catch (err) {
    audioStatus.innerText = "Mic/System failure.";
    console.error(err);
  }
}

async function stopRecording() {
  if (mediaRecorder) mediaRecorder.stop();
  if (mixedStream)
    mixedStream.getTracks().forEach((track) => track.stop());

  audioStatus.innerText = "Stopped.";
}

startBtn.onclick = startRecording;
stopBtn.onclick = stopRecording;

sysBtn.onclick = () => {
  systemEnabled = !systemEnabled;
  sysBtn.innerText = systemEnabled
    ? "System Audio ON"
    : "Enable System Audio";
};

//--------------------------------------------------------------
// SEND CHUNK TO WHISPER
//--------------------------------------------------------------
async function sendChunk() {
  if (!audioChunks.length) return;

  const blob = new Blob(audioChunks, { type: "audio/webm" });
  audioChunks = [];

  const form = new FormData();
  form.append("audio", blob);

  const res = await fetch(API + "/whisper", {
    method: "POST",
    body: form
  });

  const data = await res.json();
  if (data?.text) {
    promptBox.value += "\n" + data.text;
  }
}
