const menuItems=[
{id:1,name:"Paneer Butter Masala",price:250,image:"images/veg1.jpeg"},
{id:2,name:"Veg Biryani",price:200,image:"images/veg2.jpeg"},
{id:3,name:"Chicken Biryani",price:300,image:"images/nonveg1.jpeg"},
{id:4,name:"Chocolate Cake",price:150,image:"images/desert1.jpeg"},
{id:5,name:"Cold Drink",price:80,image:"images/drink1.jpeg"}
];

let cart=JSON.parse(localStorage.getItem("cart"))||[];
let orders=JSON.parse(localStorage.getItem("orders"))||[];
let discount=0;

/* ---------- MENU ---------- */
function displayMenu(){
if(!document.getElementById("menu-container"))return;
const container=document.getElementById("menu-container");
container.innerHTML="";
menuItems.forEach(item=>{
container.innerHTML+=`
<div class="card">
<img src="${item.image}">
<h3>${item.name}</h3>
<p>₹${item.price}</p>
<button class="btn" onclick="addToCart(${item.id})">Add to Cart</button>
</div>`;
});
}
displayMenu();

/* ---------- ADD TO CART ---------- */
function addToCart(id){
let item=menuItems.find(i=>i.id===id);
let existing=cart.find(i=>i.id===id);

if(existing){existing.qty+=1;}
else{cart.push({...item,qty:1});}

localStorage.setItem("cart",JSON.stringify(cart));
updateCartCount();
showToast("Item Added to Cart 🛒");
}

/* ---------- CART COUNT ---------- */
function updateCartCount(){
let totalQty=cart.reduce((sum,item)=>sum+item.qty,0);
if(document.getElementById("cart-count"))
document.getElementById("cart-count").innerText=totalQty;
}
updateCartCount();

/* ---------- LOAD CART ---------- */
function loadCart(){
if(!document.getElementById("cart-items"))return;
let container=document.getElementById("cart-items");
let total=0;
container.innerHTML="";

cart.forEach((item,index)=>{
total+=item.price*item.qty;
container.innerHTML+=`
<div class="card">
<h4>${item.name}</h4>
<div class="qty-box">
<button onclick="changeQty(${index},-1)">-</button>
<span>${item.qty}</span>
<button onclick="changeQty(${index},1)">+</button>
</div>
<p>₹${item.price*item.qty}</p>
<button onclick="removeItem(${index})">Remove</button>
</div>`;
});
document.getElementById("total").innerText=total-discount;
}
loadCart();

/* ---------- CHANGE QUANTITY ---------- */
function changeQty(index,val){
cart[index].qty+=val;
if(cart[index].qty<=0)cart.splice(index,1);
localStorage.setItem("cart",JSON.stringify(cart));
loadCart();
updateCartCount();
}

/* ---------- REMOVE ---------- */
function removeItem(index){
cart.splice(index,1);
localStorage.setItem("cart",JSON.stringify(cart));
loadCart();
updateCartCount();
}

/* ---------- COUPON ---------- */
function applyCoupon(){
let code=document.getElementById("coupon").value;
if(code==="FLAT50"){discount=50;}
else if(code==="SAVE20"){discount=20;}
else{discount=0;showToast("Invalid Coupon ❌");}
loadCart();
}

/* ---------- CHECKOUT ---------- */
function placeOrder(e){
e.preventDefault();
document.getElementById("paymentModal").style.display="flex";
}

/* ---------- PAYMENT ---------- */
function selectPayment(method){
showToast(method+" Payment Selected");
setTimeout(()=>{
completeOrder();
},1500);
}

function completeOrder(){
orders.push({items:cart,date:new Date().toLocaleString()});
localStorage.setItem("orders",JSON.stringify(orders));
cart=[];
localStorage.setItem("cart",JSON.stringify(cart));
window.location.href="orders.html";
}

/* ---------- LOAD ORDERS ---------- */
function loadOrders(){
if(!document.getElementById("orders-container"))return;
let container=document.getElementById("orders-container");
container.innerHTML="";
orders.forEach(order=>{
container.innerHTML+=`
<div class="card">
<p><strong>Date:</strong> ${order.date}</p>
<p>${order.items.map(i=>i.name+" x"+i.qty).join(", ")}</p>
</div>`;
});
}
loadOrders();

/* ---------- TOAST ---------- */
function showToast(msg){
let toast=document.createElement("div");
toast.className="toast";
toast.innerText=msg;
document.body.appendChild(toast);
toast.style.display="block";
setTimeout(()=>{toast.remove();},2000);
}

/* ---------- DARK MODE ---------- */
function toggleMode(){
document.body.classList.toggle("light-mode");
}

/* SHOW UPI */
function showUPI(){
document.getElementById("upiDetails").style.display="block";
document.getElementById("bankDetails").style.display="none";
}

/* SHOW BANKING */
function showBanking(){
document.getElementById("bankDetails").style.display="block";
document.getElementById("upiDetails").style.display="none";
}

/* PROCESS PAYMENT */
function processPayment(method){

let otp = prompt("Enter OTP sent to your phone (Use 1234)");
if(otp !== "1234"){
alert("Payment Failed ❌");
return;
}

document.getElementById("paymentLoader").style.display="block";

setTimeout(()=>{
document.getElementById("paymentLoader").style.display="none";
document.getElementById("successScreen").style.display="block";

setTimeout(()=>{
completeOrderWithStatus(method);
},2000);

},2000);
}


/* COMPLETE ORDER WITH STATUS */
function completeOrderWithStatus(method){

function updateOrderStatus(){
let orders=JSON.parse(localStorage.getItem("orders"))||[];

orders.forEach(order=>{
if(order.status==="Preparing") order.status="Out for Delivery";
else if(order.status==="Out for Delivery") order.status="Delivered";
});

localStorage.setItem("orders",JSON.stringify(orders));
}


localStorage.setItem("orders",JSON.stringify(orders));
cart=[];
localStorage.setItem("cart",JSON.stringify(cart));

generateInvoice();
updateCartCount();

setTimeout(()=>{
window.location.href="orders.html";
},2000);
}

/* INVOICE GENERATION */
function generateInvoice(){
let invoice = "----- Khana Khazana Invoice -----\n";
invoice += "Date: "+new Date().toLocaleString()+"\n\n";

cart.forEach(item=>{
invoice += item.name+" x"+item.qty+" = ₹"+(item.price*item.qty)+"\n";
});

invoice += "\nThank You For Ordering!";
localStorage.setItem("lastInvoice",invoice);
}



function signup(){
let user=document.getElementById("username").value;
let pass=document.getElementById("password").value;

if(!user || !pass) return alert("Fill all fields");

localStorage.setItem("user",JSON.stringify({user,pass}));
alert("Signup Successful!");
}

function login(){
let user=document.getElementById("username").value;
let pass=document.getElementById("password").value;

let saved=JSON.parse(localStorage.getItem("user"));

if(saved && saved.user===user && saved.pass===pass){
localStorage.setItem("loggedIn","true");
window.location.href="index.html";
}else{
alert("Invalid Credentials");
}
}

function checkAuth(){
if(localStorage.getItem("loggedIn")!=="true"){
window.location.href="auth.html";
}
}

function downloadInvoice(){

let orders=JSON.parse(localStorage.getItem("orders"));
let lastOrder=orders[orders.length-1];

let content="Khana Khazana Invoice\n\n";
content+="Date: "+lastOrder.date+"\n\n";

lastOrder.items.forEach(item=>{
content+=item.name+" x"+item.qty+" = ₹"+(item.price*item.qty)+"\n";
});

let blob = new Blob([content], {type:"application/pdf"});
let link = document.createElement("a");
link.href = URL.createObjectURL(blob);
link.download = "invoice.pdf";
link.click();
}

