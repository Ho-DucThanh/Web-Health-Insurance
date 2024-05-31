document.addEventListener("DOMContentLoaded", () => {
  let customers = [];
  let idCounter = 0;

  // Fetch initial data
  fetch("/users")
    .then((response) => response.json())
    .then((data) => {
      customers = data;
      idCounter = customers.length;
      renderTable();
    });

  document
    .getElementById("customer-form")
    .addEventListener("submit", saveCustomer);
  document.getElementById("search-btn").addEventListener("click", search);
  document.querySelector(".close-btn").addEventListener("click", closeModal);

  function openModal(mode, index = -1) {
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const customerForm = document.getElementById("customer-form");

    if (mode === "add") {
      modalTitle.textContent = "Đăng ký bảo hiểm";
      customerForm.reset();
      customerForm.dataset.index = -1;
      document.getElementById("customer-id").value = idCounter + 1;
    } else if (mode === "edit") {
      modalTitle.textContent = "Chỉnh sửa khách hàng";
      const customer = customers[index];
      document.getElementById("customer-id").value = customer._id;
      document.getElementById("customer-name").value = customer.name;
      document.getElementById("customer-age").value = customer.age;
      document.getElementById("customer-gender").value = customer.sex;
      document.getElementById("customer-phone").value = customer.phone;
      document.getElementById("customer-address").value = customer.address;
      document.getElementById("customer-insurance").value = customer.type;
      document.getElementById("customer-years").value = customer.duration;
      customerForm.dataset.index = index;
    }

    modal.style.display = "block";
  }

  function closeModal() {
    document.getElementById("modal").style.display = "none";
  }

  function saveCustomer(event) {
    event.preventDefault();

    const index = document.getElementById("customer-form").dataset.index;
    const customerId = document.getElementById("customer-id").value;
    const user = {
      name: document.getElementById("customer-name").value,
      age: parseInt(document.getElementById("customer-age").value),
      sex: document.getElementById("customer-gender").value,
      phone: document.getElementById("customer-phone").value,
      address: document.getElementById("customer-address").value,
      type: document.getElementById("customer-insurance").value,
      duration: parseInt(document.getElementById("customer-years").value),
    };

    if (!isValidUser(user)) {
      alert("Thông tin người dùng không hợp lệ!");
      return;
    }

    if (index === "-1") {
      fetch("/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })
        .then((response) => response.json())
        .then((newCustomer) => {
          customers.push(newCustomer);
          renderTable();
          closeModal();
          alert("Thêm thành công!");
        })
        .catch((error) => console.error("Error:", error));
    } else {
      fetch(`/user/${customerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })
        .then((response) => response.json())
        .then((updatedCustomer) => {
          customers[index] = updatedCustomer;
          renderTable();
          closeModal();
          alert("Cập nhật thành công!");
        })
        .catch((error) => console.error("Error:", error));
    }
  }

  let customerIdCounter = 0; // Biến đếm số lượng đối tượng

  function calculateInsuranceCost(type, duration) {
    if (type.toLowerCase() === "vip") {
      return duration * 800000;
    } else if (type.toLowerCase() === "thường") {
      return duration * 500000;
    } else {
      return 0; // Trả về 0 nếu loại bảo hiểm không hợp lệ
    }
  }

  function renderTable() {
    const tbody = document.querySelector("#customer-table tbody");
    tbody.innerHTML = "";

    // Reset customerIdCounter
    customerIdCounter = 0;

    customers.forEach((customer, index) => {
      const insuranceCost = calculateInsuranceCost(
        customer.type,
        customer.duration
      ); // Tính tổng số tiền bảo hiểm
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${++customerIdCounter}</td>
        <td>${customer.name}</td>
        <td>${customer.age}</td>
        <td>${customer.sex}</td>
        <td>${customer.phone}</td>
        <td>${customer.address}</td>
        <td>${customer.type}</td>
        <td>${customer.duration}</td>
        <td>${insuranceCost.toLocaleString()}</td> <!-- Hiển thị số tiền bảo hiểm -->
        <td class="btn-container">
          <button class="btn edit-btn" onclick="openModal('edit', ${index})">Sửa</button>
          <button class="btn delete-btn" onclick="deleteCustomer(${index})">Xóa</button> 
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function deleteCustomer(index) {
    const customerId = customers[index]._id;
    fetch(`/user/${customerId}`, {
      method: "DELETE",
    })
      .then(() => {
        customers.splice(index, 1);
        renderTable();
      })
      .catch((error) => console.error("Error:", error));
  }

  function search() {
    const searchInput = document
      .getElementById("search-input")
      .value.toLowerCase();
    const filteredCustomers = customers.filter(
      (customer) =>
        customer._id.toString().includes(searchInput) ||
        customer.name.toLowerCase().includes(searchInput)
    );

    const tbody = document.querySelector("#customer-table tbody");
    tbody.innerHTML = "";

    let searchIdCounter = 0; // Biến đếm số lượng kết quả tìm kiếm

    filteredCustomers.forEach((customer, index) => {
      const insuranceCost = calculateInsuranceCost(
        customer.type,
        customer.duration
      );
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${++searchIdCounter}</td> <!-- Sử dụng biến đếm thứ tự cho kết quả tìm kiếm -->
        <td>${customer.name}</td>
        <td>${customer.age}</td>
        <td>${customer.sex}</td>
        <td>${customer.phone}</td>
        <td>${customer.address}</td>
        <td>${customer.type}</td>
        <td>${customer.duration}</td>
        <td>${insuranceCost.toLocaleString()}</td>
        <td class="btn-container">
          <button class="btn edit-btn" onclick="openModal('edit', ${index})">Sửa</button>
          <button class="btn delete-btn" onclick="deleteCustomer(${index})">Xóa</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.openModal = openModal;
  window.deleteCustomer = deleteCustomer;
});

function isValidUser(user) {
  const nameRegex = /^[a-zA-Z\s]+$/;
  const phoneRegex = /^0\d{9}$/;
  const addressRegex = /^[a-zA-Z0-9\s]+$/;

  return (
    user.name &&
    nameRegex.test(user.name) &&
    Number.isInteger(user.age) &&
    user.age > 0 &&
    user.age < 101 &&
    (user.sex === "Nam" || user.sex === "Nữ") &&
    phoneRegex.test(user.phone) &&
    addressRegex.test(user.address) &&
    ["vip", "thường"].includes(user.type.toLowerCase()) &&
    Number.isInteger(user.duration) &&
    user.duration >= 1 &&
    user.duration <= 5
  );
}
