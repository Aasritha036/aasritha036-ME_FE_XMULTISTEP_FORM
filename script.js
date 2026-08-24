let currentStep = 1;
let maxStepReached = 1;

let selectedPlan = null;
let billingType = "Monthly";
let selectedAddons = [];

// =========================
// PLAN DATA
// =========================

const plans = {
  Arcade: {
    Monthly: 9,
    Yearly: 90
  },
  Advanced: {
    Monthly: 12,
    Yearly: 120
  },
  Pro: {
    Monthly: 15,
    Yearly: 150
  }
};

// =========================
// ADD-ON DATA
// =========================

const addons = {
  "Online service": {
    Monthly: 1,
    Yearly: 10
  },
  "Larger storage": {
    Monthly: 2,
    Yearly: 20
  },
  "Customizable Profile": {
    Monthly: 2,
    Yearly: 20
  }
};

// =========================
// STEP CONTROL
// =========================

function showStep(step) {
  // Hide every form step
  document.querySelectorAll(".form-step").forEach((element) => {
    element.classList.remove("active");
  });

  // Show requested step
  const target = document.getElementById(`step-${step}`);

  if (!target) {
    return;
  }

  target.classList.add("active");

  // Keep #next-button available on the currently visible step.
  // This maintains compatibility with the Cypress tests.
  document.querySelectorAll(".next-button").forEach((button) => {
    button.removeAttribute("id");
  });

  const nextButton = target.querySelector(".next-button");

  if (nextButton) {
    nextButton.id = "next-button";
  }

  // Update sidebar
  document.querySelectorAll(".step").forEach((element, index) => {
    element.classList.toggle("active", index === step - 1);
  });

  currentStep = step;

  if (step > maxStepReached) {
    maxStepReached = step;
  }
}

// =========================
// SIDEBAR NAVIGATION
// =========================

document.querySelectorAll(".step").forEach((stepElement, index) => {
  stepElement.addEventListener("click", () => {
    const clickedStep = index + 1;

    if (clickedStep <= maxStepReached) {
      showStep(clickedStep);
    }
  });
});

// =========================
// STEP 1 VALIDATION
// =========================

function validatePersonalInfo() {
  const name = document.querySelector('input[name="userName"]');
  const email = document.querySelector('input[name="email"]');
  const phone = document.querySelector('input[name="phone"]');

  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");
  const phoneError = document.getElementById("phone-error");

  let valid = true;

  // Clear errors
  nameError.textContent = "";
  emailError.textContent = "";
  phoneError.textContent = "";

  name.classList.remove("error-input");
  email.classList.remove("error-input");
  phone.classList.remove("error-input");

  // Name
  if (name.value.trim() === "") {
    nameError.textContent = "This field is required";
    name.classList.add("error-input");
    valid = false;
  }

  // Email
  if (email.value.trim() === "") {
    emailError.textContent = "This field is required";
    email.classList.add("error-input");
    valid = false;
  } else {
    // IMPORTANT:
    // Use \. rather than \\.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.value.trim())) {
      emailError.textContent = "Please enter a valid email address";
      email.classList.add("error-input");
      valid = false;
    }
  }

  // Phone
  if (phone.value.trim() === "") {
    phoneError.textContent = "This field is required";
    phone.classList.add("error-input");
    valid = false;
  }

  return valid;
}

// =========================
// NEXT BUTTON
// =========================

document.addEventListener("click", (event) => {

  const button = event.target.closest("#next-button");

  if (!button) {
    return;
  }


  // STEP 1 → STEP 2
  if (currentStep === 1) {

    if (validatePersonalInfo()) {
      showStep(2);
    }

    return;
  }


  // STEP 2 → STEP 3
  if (currentStep === 2) {

    if (!selectedPlan) {

      document.getElementById("plan-error").textContent =
        "Please select a plan";

      return;
    }

    document.getElementById("plan-error").textContent = "";

    showStep(3);

    return;
  }


  // STEP 3 → STEP 4
  if (currentStep === 3) {

    updateSummary();

    showStep(4);

    return;
  }


  // STEP 4 → THANK YOU
  if (currentStep === 4) {

    document
      .querySelectorAll(".form-step")
      .forEach((step) => {
        step.classList.remove("active");
      });

    document
      .getElementById("thank-you")
      .classList.add("active");

    document
      .querySelectorAll(".step")
      .forEach((step) => {
        step.classList.remove("active");
      });

    return;
  }

});

// =========================
// PLAN SELECTION
// =========================

document.querySelectorAll(".plan_card").forEach((card) => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".plan_card").forEach((item) => {
      item.classList.remove("selected");
    });

    card.classList.add("selected");

    selectedPlan = card.dataset.plan;

    document.getElementById("plan-error").textContent = "";
  });
});

// =========================
// BILLING TOGGLE
// =========================

const billingToggle = document.getElementById("billing-toggle");

billingToggle.addEventListener("change", () => {
  billingType = billingToggle.checked ? "Yearly" : "Monthly";

  document.querySelector(".monthly").classList.toggle(
    "active",
    billingType === "Monthly"
  );

  document.querySelector(".yearly").classList.toggle(
    "active",
    billingType === "Yearly"
  );

  document.querySelectorAll(".monthly-price").forEach((element) => {
    element.style.display =
      billingType === "Monthly" ? "block" : "none";
  });

  document.querySelectorAll(".yearly-price").forEach((element) => {
    element.style.display =
      billingType === "Yearly" ? "block" : "none";
  });

  document.querySelectorAll(".yearly-benefit").forEach((element) => {
    element.style.display =
      billingType === "Yearly" ? "block" : "none";
  });
});

// =========================
// ADD-ONS
// =========================

document.querySelectorAll(".addon_card").forEach((card) => {
  const checkbox = card.querySelector("input");

  card.addEventListener("click", (event) => {
    // If the card itself was clicked, toggle the checkbox.
    // If the checkbox was clicked, the browser already toggled it.
    if (event.target !== checkbox) {
      checkbox.checked = !checkbox.checked;
    }

    const addonName = card.dataset.addon;

    if (checkbox.checked) {
      card.classList.add("selected");

      if (!selectedAddons.includes(addonName)) {
        selectedAddons.push(addonName);
      }
    } else {
      card.classList.remove("selected");

      selectedAddons = selectedAddons.filter(
        (item) => item !== addonName
      );
    }
  });
});

// =========================
// UPDATE SUMMARY
// =========================

function updateSummary() {
  if (!selectedPlan) {
    return;
  }

  const planPrice = plans[selectedPlan][billingType];

  document.getElementById("summary-plan-name").textContent =
    `${selectedPlan} (${billingType})`;

  document.getElementById("summary-plan-price").textContent =
    billingType === "Monthly"
      ? `$${planPrice}/mo`
      : `$${planPrice}/yr`;

  const summaryAddons =
    document.getElementById("summary-addons");

  summaryAddons.innerHTML = "";

  let total = planPrice;

  selectedAddons.forEach((addon) => {
    const price = addons[addon][billingType];

    total += price;

    const div = document.createElement("div");
    div.className = "summary-addon";

    const duration =
      billingType === "Monthly" ? "/mo" : "/yr";

    const addonName = document.createElement("span");
    addonName.textContent = addon;

    const addonPrice = document.createElement("span");
    addonPrice.textContent = `+$${price}${duration}`;

    div.appendChild(addonName);
    div.appendChild(addonPrice);

    summaryAddons.appendChild(div);
  });

  document.getElementById("total-price").textContent =
    billingType === "Monthly"
      ? `$${total}/mo`
      : `$${total}/yr`;
}

// =========================
// CHANGE PLAN
// =========================

document
  .getElementById("change-plan")
  .addEventListener("click", (event) => {
    event.preventDefault();

    showStep(2);
  });

// =========================
// CONFIRM
// =========================


// =========================
// BACK BUTTONS
// =========================

// Step 2 → Step 1
document
  .getElementById("back-button")
  .addEventListener("click", () => {
    showStep(1);
  });

// Step 3 → Step 2
document
  .getElementById("addon-back")
  .addEventListener("click", () => {
    showStep(2);
  });

// Step 4 → Step 3
document
  .getElementById("summary-back")
  .addEventListener("click", () => {
    showStep(3);
  });

// =========================
// INITIAL STEP
// =========================

showStep(1);