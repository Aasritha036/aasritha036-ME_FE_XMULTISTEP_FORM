let currentStep = 1;

let selectedPlan = null;

let maxStepReached = 1;

let billingType = "Monthly";

let selectedAddons = [];

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


/* =========================
   STEP CONTROL
========================= */

function showStep(step) {
    document.querySelectorAll(".form-step").forEach((element) => {
      element.classList.remove("active");
    });
  
    const target = document.getElementById(`step-${step}`);
  
    if (target) {
      target.classList.add("active");
    }
  
    // Remove id from all next buttons
    document.querySelectorAll(".next-button").forEach((button) => {
      button.removeAttribute("id");
    });
  
    // Give #next-button only to the visible step's Next button
    if (target) {
      const nextButton = target.querySelector(".next-button");
  
      if (nextButton) {
        nextButton.id = "next-button";
      }
    }
  
    document.querySelectorAll(".step").forEach((element, index) => {
      element.classList.remove("active");
  
      if (index === step - 1) {
        element.classList.add("active");
      }
    });
  
    currentStep = step;

    if (step > maxStepReached) {
        maxStepReached = step;
    }
  }


  document.querySelectorAll(".step").forEach((stepElement, index) => {

    stepElement.addEventListener("click", () => {
  
      const clickedStep = index + 1;
  
      if (clickedStep <= maxStepReached) {
        showStep(clickedStep);
      }
  
    });
  
  });

/* =========================
   STEP 1 VALIDATION
========================= */

function validatePersonalInfo() {

  const name = document.querySelector(
    'input[name="userName"]'
  );

  const email = document.querySelector(
    'input[name="email"]'
  );

  const phone = document.querySelector(
    'input[name="phone"]'
  );

  const nameError = document.getElementById("name-error");

  const emailError = document.getElementById("email-error");

  const phoneError = document.getElementById("phone-error");

  let valid = true;


  nameError.textContent = "";
  emailError.textContent = "";
  phoneError.textContent = "";

  name.classList.remove("error-input");
  email.classList.remove("error-input");
  phone.classList.remove("error-input");


  if (name.value.trim() === "") {

    nameError.textContent = "This field is required";

    name.classList.add("error-input");

    valid = false;
  }


  if (email.value.trim() === "") {

    emailError.textContent = "This field is required";

    email.classList.add("error-input");

    valid = false;

  } else {

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.value.trim())) {

      emailError.textContent =
        "Please enter a valid email address";

      email.classList.add("error-input");

      valid = false;
    }
  }


  if (phone.value.trim() === "") {

    phoneError.textContent = "This field is required";

    phone.classList.add("error-input");

    valid = false;
  }


  return valid;
}


/* =========================
   NEXT STEP
========================= */

document.addEventListener("click", (event) => {
    if (event.target.id !== "next-button") return;
  
    if (currentStep === 1) {
      if (validatePersonalInfo()) {
        showStep(2);
      }
    }
  
    else if (currentStep === 2) {
      if (!selectedPlan) {
        document.getElementById("plan-error").textContent =
          "Please select a plan";
        return;
      }
  
      document.getElementById("plan-error").textContent = "";
      showStep(3);
    }
  
    else if (currentStep === 3) {
      updateSummary();
      showStep(4);
    }
  });


/* =========================
   PLAN SELECTION
========================= */

document
  .querySelectorAll(".plan_card")
  .forEach((card) => {

    card.addEventListener("click", () => {

      document
        .querySelectorAll(".plan_card")
        .forEach((item) => {
          item.classList.remove("selected");
        });

      card.classList.add("selected");

      selectedPlan = card.dataset.plan;

      document.getElementById("plan-error").textContent = "";

    });

  });


/* =========================
   BILLING TOGGLE
========================= */

const billingToggle =
  document.getElementById("billing-toggle");

billingToggle.addEventListener("change", () => {

  billingType =
    billingToggle.checked ? "Yearly" : "Monthly";


  document
    .querySelector(".monthly")
    .classList.toggle(
      "active",
      billingType === "Monthly"
    );

  document
    .querySelector(".yearly")
    .classList.toggle(
      "active",
      billingType === "Yearly"
    );


  document
    .querySelectorAll(".monthly-price")
    .forEach((element) => {

      element.style.display =
        billingType === "Monthly"
          ? "block"
          : "none";

    });


  document
    .querySelectorAll(".yearly-price")
    .forEach((element) => {

      element.style.display =
        billingType === "Yearly"
          ? "block"
          : "none";

    });


  document
    .querySelectorAll(".yearly-benefit")
    .forEach((element) => {

      element.style.display =
        billingType === "Yearly"
          ? "block"
          : "none";

    });

});


/* =========================
   PLAN NEXT
========================= 

document
  .getElementById("plan-next")
  .addEventListener("click", () => {

    if (!selectedPlan) {

      document.getElementById("plan-error").textContent =
        "Please select a plan";

      return;
    }

    showStep(3);

  });
*/

/* =========================
   ADDONS
========================= */

document
  .querySelectorAll(".addon_card")
  .forEach((card) => {

    const checkbox =
      card.querySelector("input");

    card.addEventListener("click", (event) => {

      if (event.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
      }

      const addonName =
        card.dataset.addon;


      if (checkbox.checked) {

        card.classList.add("selected");

        if (!selectedAddons.includes(addonName)) {
          selectedAddons.push(addonName);
        }

      } else {

        card.classList.remove("selected");

        selectedAddons =
          selectedAddons.filter(
            (item) => item !== addonName
          );

      }

    });

  });


/* =========================
   ADDON NEXT
========================= 

document
  .getElementById("addon-next")
  .addEventListener("click", () => {

    updateSummary();

    showStep(4);

  });
*/

/* =========================
   SUMMARY
========================= */

function updateSummary() {

  const planPrice =
    plans[selectedPlan][billingType];


  document.getElementById(
    "summary-plan-name"
  ).textContent =
    `${selectedPlan} (${billingType})`;


  document.getElementById(
    "summary-plan-price"
  ).textContent =
    billingType === "Monthly"
      ? `$${planPrice}/mo`
      : `$${planPrice}/yr`;


  const summaryAddons =
    document.getElementById("summary-addons");

  summaryAddons.innerHTML = "";


  let total = planPrice;


  selectedAddons.forEach((addon) => {

    const price =
      addons[addon][billingType];

    total += price;


    const div =
      document.createElement("div");

    div.className = "summary-addon";


    const duration =
      billingType === "Monthly"
        ? "/mo"
        : "/yr";


    div.innerHTML = `
      <span>${addon}</span>
      <span>+$${price}${duration}</span>
    `;


    summaryAddons.appendChild(div);

  });


  document.getElementById(
    "total-price"
  ).textContent =
    billingType === "Monthly"
      ? `$${total}/mo`
      : `$${total}/yr`;

}


/* =========================
   CHANGE PLAN
========================= */

document
  .getElementById("change-plan")
  .addEventListener("click", (event) => {

    event.preventDefault();

    showStep(2);

  });


/* =========================
   CONFIRM
========================= */

document
  .getElementById("confirm-button")
  .addEventListener("click", () => {

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

  });


/* =========================
   BACK BUTTONS
========================= */

document
  .getElementById("back-button")
  .addEventListener("click", () => {

    showStep(1);

  });


document
  .getElementById("addon-back")
  .addEventListener("click", () => {

    showStep(2);

  });


document
  .getElementById("summary-back")
  .addEventListener("click", () => {

    showStep(3);

  });

  showStep(1);