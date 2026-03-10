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
const startBtn = document.getElementById("startBtn");

let cart = [];

// ---------- DATA ----------
const staples = [
  {id:"r1",name:"Rice (white)",cals:345,pro:6.8,carbs:78},
  {id:"r2",name:"Wheat Atta",cals:340,pro:11.5,carbs:71},
  {id:"r3",name:"Oats",cals:390,pro:16,carbs:66},
  {id:"p1",name:"Toor Dal",cals:335,pro:22,carbs:57},
  {id:"p2",name:"Moong Dal",cals:348,pro:24.5,carbs:59},
  {id:"p3",name:"Chana",cals:360,pro:19,carbs:60},
  {id:"d1",name:"Milk",cals:100,pro:3.8,carbs:5},
  {id:"d2",name:"Curd",cals:60,pro:3.1,carbs:4},
  {id:"d3",name:"Paneer",cals:265,pro:18.5,carbs:1.2},
  {id:"v1",name:"Potato",cals:77,pro:2,carbs:17},
  {id:"v2",name:"Spinach",cals:23,pro:2.9,carbs:3.6},
  {id:"n1",name:"Peanuts",cals:567,pro:25.8,carbs:16},
  {id:"n1",name:"radish",cals:600,pro:2.5,carbs:1000}
];

function toastMsg(msg){
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),2000);
}

function renderGrid(){
  productGrid.innerHTML="";
  staples.forEach(p=>{
    const card=document.createElement("div");
    card.className="card";
    card.innerHTML=`
      <h3>${p.name}</h3>
      <div class="nutri-row"><span>Calories</span><span>${p.cals}</span></div>
      <div class="nutri-row"><span>Protein</span><span>${p.pro} g</span></div>
      <button class="add-btn" data-id="${p.id}">Add</button>
    `;
    productGrid.appendChild(card);
  });
}

function refreshCart(){
  cartInfo.textContent = cart.length?`${cart.length} items`:"Cart empty";
}

document.addEventListener("click",e=>{
  if(e.target.classList.contains("add-btn")){
    const item=staples.find(s=>s.id===e.target.dataset.id);
    cart.push(item);
    toastMsg(`${item.name} added`);
    refreshCart();
  }
});

closeModal.addEventListener("click",()=>resultModal.classList.add("hidden"));

newPlanBtn.addEventListener("click",()=>{
  cart=[];
  refreshCart();
  resultModal.classList.add("hidden");
});

genBtn.addEventListener("click",async()=>{
  const w=document.getElementById("weight").value;
  const p=document.getElementById("proteinGoal").value;
  if(!w||!p)return toastMsg("Enter weight & protein goal");

  const names=cart.length?cart.map(i=>i.name).join(", "):"rice, dal, milk";

  const prompt=`I weigh ${w} kg and need ${p} g protein daily.
Create a simple 1-day Indian vegetarian meal plan using ONLY these foods: ${names}.
Include quantities and total protein & calories.i need the result in proper Bullet-points.`;

  planText.textContent="Generating...";
  resultModal.classList.remove("hidden");

  try{
    const res=await fetch("/generate",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({prompt})
    });

    const data=await res.json();
    const reply=data?.text||"No response from Gemini.";

    planText.textContent=reply;
  }catch(err){
    planText.textContent="Server error.";
  }
});

startBtn.addEventListener("click",()=>{
  if(!document.getElementById("weight").value||
     !document.getElementById("proteinGoal").value)
     return toastMsg("Fill both fields");

  landing.classList.add("hidden");
  foodSec.classList.remove("hidden");
  cartBar.classList.remove("hidden");
  renderGrid();
});


