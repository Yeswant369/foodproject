// ---------- CONFIG ----------
const GEMINI_KEY = ""; // ← your key
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;

// ---------- DOM ----------
const landing = document.getElementById("landing");
const foodSec = document.getElementById("foodSec");
const productGrid = document.getElementById("productGrid");
const cartBar = document.getElementById("cartBar");
const cartInfo = document.getElementById("cartInfo");
const genBtn = document.getElementById("genBtn");
const resultModal = document.getElementById("resultModal");
const planText = document.getElementById("planText");
const closeModal = document.getElementById("closeModal");
const newPlanBtn = document.getElementById("newPlanBtn");
const toast = document.getElementById("toast");

let cart = [];

// ---------- DATA ----------
const staples = [
  {id: "r1", name: "Rice (white)", cals: 345, pro: 6.8, carbs: 78, fats: 0.5, b12: 0, o3: 0},
  {id: "r2", name: "Wheat Atta", cals: 340, pro: 11.5, carbs: 71, fats: 2, b12: 0, o3: 0},
  {id: "r3", name: "Oats", cals: 390, pro: 16, carbs: 66, fats: 7, b12: 0, o3: 100},
  {id: "p1", name: "Toor Dal", cals: 335, pro: 22, carbs: 57, fats: 1.7, b12: 0, o3: "Trace"},
  {id: "p2", name: "Moong Dal", cals: 348, pro: 24.5, carbs: 59, fats: 1.2, b12: 0, o3: "Trace"},
  {id: "p3", name: "Chana", cals: 360, pro: 19, carbs: 60, fats: 6, b12: 0, o3: 100},
  {id: "d1", name: "Milk (Buffalo)", cals: 100, pro: 3.8, carbs: 5, fats: 7, b12: 0.4, o3: "Trace"},
  {id: "d2", name: "Curd", cals: 60, pro: 3.1, carbs: 4, fats: 4, b12: 0.5, o3: "Trace"},
  {id: "d3", name: "Paneer", cals: 265, pro: 18.5, carbs: 1.2, fats: 20, b12: 0.8, o3: "Trace"},
  {id: "v1", name: "Potato", cals: 77, pro: 2, carbs: 17, fats: 0.1, b12: 0, fiber: 2.2},
  {id: "v2", name: "Spinach", cals: 23, pro: 2.9, carbs: 3.6, fats: 0.4, b12: 0, fiber: 2.2},
  {id: "n1", name: "Peanuts", cals: 567, pro: 25.8, carbs: 16, fats: 49, b12: 0, o3: "Trace"}
];

function toastMsg(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

function renderGrid() {
  productGrid.innerHTML = "";
  staples.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${p.name}</h3>
      <div class="nutri-row"><span>Calories</span><span>${p.cals}</span></div>
      <div class="nutri-row"><span>Protein</span><span>${p.pro} g</span></div>
      <div class="nutri-row"><span>Carbs</span><span>${p.carbs} g</span></div>
      <button class="add-btn" data-id="${p.id}">Add</button>
    `;
    productGrid.appendChild(card);
  });
}

function refreshCart() {
  cartInfo.textContent = cart.length ? `${cart.length} items` : "Cart empty";
}

document.addEventListener("click", e => {
  if (e.target.classList.contains("add-btn")) {
    const item = staples.find(s => s.id === e.target.dataset.id);
    cart.push(item);
    toastMsg(`${item.name} added`);
    refreshCart();
  }
});

closeModal.addEventListener("click", () => resultModal.classList.add("hidden"));
newPlanBtn.addEventListener("click", () => {
  cart = [];
  refreshCart();
  resultModal.classList.add("hidden");
  landing.scrollIntoView({ behavior: "smooth" });
});

genBtn.addEventListener("click", async () => {
  const w = document.getElementById("weight").value;
  const p = document.getElementById("proteinGoal").value;
  if (!w || !p) return toastMsg("Enter weight & protein goal");

  const names = cart.length ? cart.map(i => i.name).join(", ") : "rice, wheat, toor dal, milk, potato, spinach";
  const prompt = `I weigh ${w} kg and need ${p} g protein daily.  
Create a simple 1-day Indian vegetarian meal plan (breakfast, lunch, dinner, snack) using ONLY these foods: ${names}.  
Include quantities (g or ml) and total daily protein & calories.  
Keep language friendly and concise.`;

  planText.textContent = "Generating...";
  resultModal.classList.remove("hidden");

  try {
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    const json = await res.json();

    let reply =
      json?.candidates?.[0]?.content?.parts?.[0]?.text ||
      json?.text ||
      json?.result ||
      "Gemini returned empty content – please try again.";

    planText.textContent = reply.trim();
  } catch (err) {
    console.error(err);
    planText.textContent = "Network error – check API key or internet.";
  }
});

startBtn.addEventListener("click", () => {
  if (!document.getElementById("weight").value || !document.getElementById("proteinGoal").value) return toastMsg("Fill both fields");
  landing.classList.add("hidden");
  foodSec.classList.remove("hidden");
  cartBar.classList.remove("hidden");
  renderGrid();
});

