// Starting price and amount of cash on hand
let price = 19.5;
let cid = [
  ["PENNY", 0.5],
  ["NICKEL", 0],
  ["DIME", 0],
  ["QUARTER", 0],
  ["ONE", 0],
  ["FIVE", 0],
  ["TEN", 0],
  ["TWENTY", 0],
  ["ONE HUNDRED", 0],
];

// Pulling elements from HTML
const displayChangeDue = document.getElementById("change-due");
const cash = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const totalPriceElement = document.getElementById("total-price");
const changeInDrawerElement = document.getElementById("change-in-drawer");

// Format the results to print out on the screen
const formatResults = (status, change) => {
  displayChangeDue.innerHTML = `<p>Status: ${status}</p>`;

  // If CLOSED, only show denominations with amount > 0
  const filteredChange =
    status === "CLOSED" ? change.filter(([_, amount]) => amount > 0) : change;

  displayChangeDue.innerHTML += filteredChange
    .map(
      ([denominationName, amount]) =>
        `<p>${denominationName}: $${amount.toFixed(2)}</p>`
    )
    .join("");
};

// Use the cash register
const checkRegister = () => {
  // Convert the prices to cents for easier calculations/comparisons
  const cashInCents = Math.round(Number(cash.value) * 100);
  const priceInCents = Math.round(price * 100);

  // Check if cash > price
  if (cashInCents < priceInCents) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }

  // Check if cash = price
  if (cashInCents === priceInCents) {
    displayChangeDue.innerHTML =
      "<p>No change due - customer paid with exact cash</p>";
    cash.value = "";
    return;
  }

  // Calculate the amount of change due
  let changeDue = cashInCents - priceInCents;

  // Reverse the cid array to loop through largest to smallest
  const reversedCid = [...cid]
    .reverse()
    .map(([denominationName, amount]) => [
      denominationName,
      Math.round(amount * 100),
    ]);
  const denominations = [10000, 2000, 1000, 500, 100, 25, 10, 5, 1];
  const result = { status: "OPEN", change: [] };
  const totalCID = reversedCid.reduce((prev, [_, amount]) => prev + amount, 0);

  // Check if the change due > total cash in register
  if (totalCID < changeDue) {
    displayChangeDue.innerHTML = "<p>Status: INSUFFICIENT_FUNDS</p>";
    return;
  }

  // Check if the change due = total cash in register
  if (totalCID === changeDue) {
    formatResults("CLOSED", cid);
    return;
  }

  // Calculate the change due in coins and bills, sort highest to lowest
  for (let i = 0; i <= reversedCid.length; i++) {
    if (changeDue >= denominations[i] && changeDue > 0) {
      const [denominationName, total] = reversedCid[i];
      const possibleChange = Math.min(total, changeDue);
      const count = Math.floor(possibleChange / denominations[i]);
      const amountInChange = count * denominations[i];
      changeDue -= amountInChange;

      if (count > 0) {
        result.change.push([denominationName, amountInChange / 100]);
      }
    }
  }
  // Check if the change due drops to 0, otherwise you don't have enough change
  if (changeDue > 0) {
    displayChangeDue.innerHTML = "<p>Status: INSUFFICIENT_FUNDS</p>";
    return;
  }
  formatResults(result.status, result.change);
  updateUI(result.change);
};

// Don't do anything if there's not a value entered
const checkResults = () => {
  if (!cash.value) {
    return;
  }
  checkRegister();
};

// Update the new amounts in the cash register drawer
const updateUI = (change) => {
  const currencyNameMap = {
    PENNY: "Pennies",
    NICKEL: "Nickels",
    DIME: "Dimes",
    QUARTER: "Quarters",
    ONE: "Ones",
    FIVE: "Fives",
    TEN: "Tens",
    TWENTY: "Twenties",
    "ONE HUNDRED": "Hundreds",
  };

  if (change) {
    change.forEach(([changeDenomination, changeAmount]) => {
      const targetArr = cid.find(
        ([denominationName]) => denominationName === changeDenomination
      );

      targetArr[1] = Math.round(targetArr[1] * 100 - changeAmount * 100) / 100;
    });
  }

  cash.value = "";
  totalPriceElement.textContent = `Total: $${price}`;
  changeInDrawerElement.innerHTML = `
    <p><strong>Change in drawer:</strong></p>
    ${cid
      .map(
        ([denominationName, amount]) =>
          `<p>${currencyNameMap[denominationName]}: $${amount}</p>`
      )
      .join("")}
  `;
};

// Add click and keydown event listeners
purchaseBtn.addEventListener("click", checkResults);

cash.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    checkResults();
  }
});

// Update the UI
updateUI();
