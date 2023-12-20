//penger
let poeng = 0;

//spill variabler
let multiplikator = 4;
let animasjonSpeed = 3; // maks 13
let prisOkning = 1.07; // dette er for eksponentiell økning av pris

// Instillinger
const maxFrameAnimimasjon = 59; // maks 60
const poeng_klikk = 1;
const poeng_skroll = poeng_klikk * 0.069;
const KlikkPerPoeng = maxFrameAnimimasjon / animasjonSpeed;

// dom elementer
const dom_poeng = document.getElementById("poeng");
const dom_klikkPerPoeng = document.getElementById("klikkPerPoeng");
const spriteElement = document.getElementById("sprite");
const progressBar = document.getElementById("bar");
let frame = 0;

// butikk
const storeItems = [
  {
    name: "OP 1",
    cost: 30,
    quantity: 0,
    mp: 2,
    aktiver: function () {
      multiplikator += this.mp;
    },
  },
  {
    name: "OP 2",
    cost: 720,
    quantity: 0,
    mp: 12 * 2,
    aktiver: function () {
      multiplikator += this.mp;
    },
  },
  {
    name: "OP 3",
    cost: 3738,
    quantity: 0,
    mp: 62 * 2,
    aktiver: function () {
      multiplikator += this.mp;
    },
  },
  {
    name: "OP 4",
    cost: 8640,
    quantity: 0,
    mp: 144 * 2,
    aktiver: function () {
      multiplikator += this.mp;
    },
  },
  {
    name: "OP 5",
    cost: 103680,
    quantity: 0,
    mp: 1728 * 2,
    aktiver: function () {
      multiplikator += this.mp;
    },
  },
];

function giPoeng(poengType) {
  poeng += poengType * multiplikator;
  poeng = Number(poeng.toFixed(1));
  renderText();
}

function taPoeng(_p) {
  poeng -= _p;
  poeng = Number(poeng.toFixed(1));
  renderText();
}

function animasjonFerdig() {
  frame += animasjonSpeed;
  if (frame > maxFrameAnimimasjon) {
    frame = 0;
    return true;
  }
  return false;
}

function handleEvent(poengType) {
  if (animasjonFerdig()) {
    giPoeng(poengType);
  }
  updateProgressBar();
  updateSpritePosition();
}

function addEventListeners(elementId) {
  const element = document.getElementById(elementId);
  element.addEventListener("click", () => handleEvent(poeng_klikk));
  element.addEventListener("mousewheel", () => handleEvent(poeng_skroll));
}

function updateProgressBar() {
  const width = Math.floor(
    (KlikkPerPoeng - frame / animasjonSpeed) * (100 / KlikkPerPoeng) +
      100 / KlikkPerPoeng
  );
  progressBar.className = `bar striped w-${width}`;
}

function updateSpritePosition() {
  spriteElement.style.backgroundPosition = `${-frame * 300}px 0`;
}

function renderText() {
  dom_poeng.innerText = poeng;
  dom_klikkPerPoeng.innerText = (
    (poeng_klikk * multiplikator) /
    KlikkPerPoeng
  ).toFixed(2);
  renderStoreItems();
}

function renderStoreItems() {
  const storeContainer = document.getElementById("storeItems");
  storeContainer.innerHTML = ""; // Clear existing items
  storeItems.forEach((item, index) => {
    const estimatedIncrease = (poeng_klikk * item.mp) / KlikkPerPoeng;
    const itemElement = document.createElement("div");
    itemElement.classList.add("card");
    itemElement.classList.add(
      poeng > item.cost ? "text-success" : "text-danger"
    );
    itemElement.innerHTML = `${item.name} - ${
      item.cost
    } poeng <i class="text-muted"> +${estimatedIncrease.toFixed(2)} PPK </i>`;
    itemElement.onclick = () => purchaseItem(index);
    storeContainer.appendChild(itemElement);
  });
}

function purchaseItem(index) {
  const item = storeItems[index];
  if (poeng >= item.cost) {
    taPoeng(item.cost);
    item.quantity++;
    item.aktiver.call(item);
    item.cost = Math.ceil(item.cost * prisOkning);
    renderText();
    renderStoreItems();
  } else {
    alert("Ikke nok poeng!");
  }
}

function pengerTimer() {
  giPoeng(0.1);
}

setInterval(pengerTimer, 1000);

// loader
window.onload = () => {
  renderText();
  addEventListeners("sprite");
  renderStoreItems();
};
