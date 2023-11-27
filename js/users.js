document.addEventListener("DOMContentLoaded", async () => {
  axios.defaults.baseURL = "http://localhost:3000";

  let tbody = document.querySelector("tbody");
  let createUserModal = document.querySelector("#create-user-modal");

  let createUserModalInstance = null;
  createUserModal.addEventListener("shown.bs.modal", function () {
    createUserModalInstance = bootstrap.Modal.getInstance(createUserModal);
  });

  const appendUser = (user) => {
    let tr = document.createElement("tr");

    let tds = [
      user.id,
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

    deleteBtn.addEventListener("click", async () => {
      tr.remove();

      await axios.delete(`/users/${user.id}`);
    });
  };

  let users = await axios.get("/users");

  users.data.forEach(appendUser);

  let createUserBtn = document.querySelector("#create-user-btn");

  async function createUser() {
    let form = document.querySelector("#create-user-form");

    let first_name = form[0].value;
    let last_name = form[1].value;
    let age = +form[2].value;
    let email = form[3].value;
    let password = form[4].value;
    let image = form[5].value;

    let newUser = {
      first_name,
      last_name,
      age,
      email,
      password,
      image,
    };

    // await fetch("http://localhost:3000/users", {
    //   method: "POST",
    //   body: JSON.stringify(newUser),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // }).then((res) => res.json());

    let res = await axios.post("/users", newUser);

    form.reset();

    createUserModalInstance.hide();

    appendUser(res.data);
  }

  createUserBtn.addEventListener("click", createUser);
});
