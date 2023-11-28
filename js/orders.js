async function nextStatus(e, orderId) {
  let span = e.target;

  let newStatus;
  let className;
  switch (span.innerText) {
    case "Created": {
      newStatus = "Packing";
      className = "warning";
      break;
    }
    case "Packing": {
      newStatus = "InCar";
      className = "info";
      break;
    }
    default: {
      newStatus = "Delivered";
      className = "success";
    }
  }
  span.classList.remove(span.classList[1]);

  span.classList.add(`text-bg-${className}`);
  span.innerText = newStatus;

  await axios.patch(`/orders/${orderId}`, { status: newStatus });
}

async function prevStatus(e, orderId) {
  e.preventDefault();
  let span = e.target;

  let newStatus;
  let className;
  switch (span.innerText) {
    case "InCar": {
      newStatus = "Packing";
      className = "warning";
      break;
    }
    case "Delivered": {
      newStatus = "InCar";
      className = "info";
      break;
    }
    default: {
      newStatus = "Created";
      className = "primary";
    }
  }
  span.classList.remove(span.classList[1]);

  span.classList.add(`text-bg-${className}`);
  span.innerText = newStatus;
  await axios.patch(`/orders/${orderId}`, { status: newStatus });
}

function displayStatus(status, orderId) {
  let className;
  if (status === "Delivered") {
    className = "success";
  } else if (status === "InCar") {
    className = "info";
  } else if (status === "Packing") {
    className = "warning";
  } else if (status === "Created") {
    className = "primary";
  }

  let template = `<span oncontextmenu="prevStatus(event, ${orderId})" onclick="nextStatus(event, ${orderId})" class="badge text-bg-${className}">${status}</span>`;
  return template;
}

document.addEventListener("DOMContentLoaded", async () => {
  axios.defaults.baseURL = "http://localhost:3000";

  let tbody = document.querySelector("tbody");
  let createOrderModal = document.querySelector("#create-order-modal");
  let createOrderBtn = document.querySelector("#create-order-btn");
  let createOrderForm = document.querySelector("#create-order-form");
  let createOrderClientSelect = document.querySelector(
    "#create-order-client-select"
  );

  let createOrderModalInstance = null;
  createOrderModal.addEventListener("shown.bs.modal", function () {
    createOrderModalInstance = bootstrap.Modal.getInstance(createOrderModal);
  });

  let [{ data: orders }, { data: clients }] = await Promise.all([
    axios.get("/orders"),
    axios.get("/users"),
  ]);

  function appendOrder(order) {
    let tr = document.createElement("tr");
    let idTd = document.createElement("td");
    let clientTd = document.createElement("td");
    let priceTd = document.createElement("td");
    let statusTd = document.createElement("td");
    let dateTd = document.createElement("td");
    let actionsTd = document.createElement("td");

    idTd.innerText = order.id + ".";
    clientTd.innerText = order.clientName;
    priceTd.innerText = "$" + order.totalPrice.toFixed(2);
    statusTd.innerHTML = displayStatus(order.status, order.id);
    dateTd.innerText = order.date;

    tr.append(idTd, clientTd, statusTd, priceTd, dateTd, actionsTd);
    tbody.append(tr);
  }

  orders.forEach(appendOrder);

  clients.forEach((client) => {
    let option = document.createElement("option");
    createOrderClientSelect.append(option);
    option.innerText = `${client.first_name} ${client.last_name}`;
  });

  createOrderBtn.addEventListener("click", async () => {
    let clientName = createOrderForm[0].value;
    let totalPrice = +createOrderForm[1].value;
    let status = "Created";
    let date;
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    date = `${year}-${month}-${day}`;

    let newOrder = {
      clientName,
      totalPrice,
      date,
      status,
    };

    let { data } = await axios.post("/orders", newOrder);

    appendOrder(data);
    createOrderForm.reset();
    createOrderModalInstance.hide();
  });
});
