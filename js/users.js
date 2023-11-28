document.addEventListener("DOMContentLoaded", async () => {
  axios.defaults.baseURL = "http://localhost:3000";

  let tbody = document.querySelector("tbody");
  let createUserModal = document.querySelector("#create-user-modal");
  let editUserModal = document.querySelector("#edit-user-modal");
  let updatePasswordModal = document.querySelector("#update-password-modal");
  let alertsWrapper = document.querySelector(".alerts-wrapper");
  let eyes = document.querySelectorAll(".show-password");

  eyes.forEach((eye) => {
    eye.addEventListener("click", () => {
      eye.querySelector("span").innerHTML =
        eye.querySelector("span").innerHTML === "visibility"
          ? "visibility_off"
          : "visibility";

      eye.previousElementSibling.setAttribute(
        "type",
        eye.previousElementSibling.getAttribute("type") === "text"
          ? "password"
          : "text"
      );
    });
  });

  let createUserModalInstance = null;
  createUserModal.addEventListener("shown.bs.modal", function () {
    createUserModalInstance = bootstrap.Modal.getInstance(createUserModal);
  });

  let editUserModalInstance = null;
  editUserModal.addEventListener("shown.bs.modal", function () {
    editUserModalInstance = bootstrap.Modal.getInstance(editUserModal);
  });

  let updatePasswordModalInstance = null;
  updatePasswordModal.addEventListener("shown.bs.modal", function () {
    updatePasswordModalInstance =
      bootstrap.Modal.getInstance(updatePasswordModal);
  });

  const showAlert = (msg) => {
    let alert = `
            <div class="alert alert-danger alert-dismissible">
              ${msg}
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="alert"
              ></button>
            </div>
            `;

    alertsWrapper.innerHTML += alert;
  };

  const updateUser = (user) => {
    let tr = document.querySelector(`#user-${user.id}`);

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

    tds.forEach((td, index) => {
      tr.children[index].innerHTML = td;
    });
  };

  const appendUser = (user) => {
    let tr = document.createElement("tr");
    tr.id = `user-${user.id}`;

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

    editBtn.addEventListener("click", () => {
      let form = document.querySelector("#edit-user-form");
      new bootstrap.Modal("#edit-user-modal").show();

      form.querySelector("#edit-first-name").value = user.first_name;
      form.querySelector("#edit-last-name").value = user.last_name;
      form.querySelector("#edit-age").value = user.age;
      form.querySelector("#edit-email").value = user.email;
      form.querySelector("#edit-image").value = user.image;

      document
        .querySelector("#edit-user-btn")
        .addEventListener("click", async () => {
          let first_name = form[0].value;
          let last_name = form[1].value;
          let age = +form[2].value;
          let email = form[3].value;
          let image = form[4].value;

          let newUserInfo = {
            first_name,
            last_name,
            age,
            email,
            password: user.password,
            image,
          };

          let { data } = await axios.put(`/users/${user.id}`, newUserInfo);

          updateUser(data);

          user = data;

          editUserModalInstance.hide();
        });
    });

    changePasswordBtn.addEventListener("click", () => {
      let form = document.querySelector("#update-password-form");
      new bootstrap.Modal("#update-password-modal").show();

      document
        .querySelector("#update-password-btn")
        .addEventListener("click", async () => {
          let currentPassword = form[0].value;
          let newPassword = form[1].value;
          let confirmPassword = form[2].value;

          if (!currentPassword || !newPassword || !confirmPassword) {
            showAlert("All Fields Are Required!s");
            return;
          }

          if (currentPassword !== user.password) {
            showAlert("Wrong password");
            return;
          }

          if (newPassword !== confirmPassword) {
            showAlert("New passwords do not match");
            return;
          }

          if (newPassword === user.password) {
            showAlert("New password must be different from current password");
            return;
          }

          let newUserInfo = {
            ...user,
            password: newPassword,
          };

          let { data } = await axios.put(`/users/${user.id}`, newUserInfo);

          updateUser(data);

          user = data;

          updatePasswordModalInstance.hide();

          form.reset();
        });
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
