document.addEventListener("DOMContentLoaded", async () => {
  let tbody = document.querySelector("tbody");

  axios.defaults.baseURL = "http://localhost:3000";

  let users = await axios.get("/users");
  users.data.forEach((user, index) => {
    let tr = document.createElement("tr");

    let tds = [
      `${index + 1}.`,
      `<img
          src="${user.image}"
          alt=""
          class="rounded-circle object-fit-cover"
          width="50"
          height="50"
        />`,
      `${user.first_name} ${user.last_name}`,
      user.age,
      user.email,
      user.password,
    ];

    tds.forEach((td) => {
      let tdElement = document.createElement("td");
      tdElement.classList.add("align-middle");
      tdElement.innerHTML = td;
      tr.append(tdElement);
    });

    let actionsTd = document.createElement("td");
    let changePasswordBtn = document.createElement("button");
    let editBtn = document.createElement("button");
    let deleteBtn = document.createElement("button");
    actionsTd.classList.add("align-middle");
    changePasswordBtn.innerHTML =
      '<span class="material-icons-outlined fs-5"> key </span>';
    changePasswordBtn.classList.add("btn", "btn-warning", "btn-sm");
    editBtn.classList.add("btn", "btn-success", "btn-sm");
    editBtn.innerHTML =
      '<span class="material-icons-outlined fs-5"> edit </span>';
    deleteBtn.classList.add("btn", "btn-danger", "btn-sm");
    deleteBtn.innerHTML =
      '<span class="material-icons-outlined fs-5"> delete </span>';

    actionsTd.append(changePasswordBtn, editBtn, deleteBtn);

    tr.append(actionsTd);

    tbody.append(tr);
  });
});
