const saveBtn = document.getElementById("saveBtn");
const userTable = document.getElementById("userTable");
const statusText = document.getElementById("status");
const tableContainer = document.getElementById("tableContainer");

let editId = null;

async function fetchUsers() {
    const res = await fetch("http://localhost:3000/users");
    const data = await res.json();
    renderTable(data);
    return data;
}

function renderTable(users) {
    if (users.length > 0) {
        tableContainer.style.display = "block";  // Show the table when there are users
    } else {
        tableContainer.style.display = "none";   // Keep the table hidden if there are no users
    }

    userTable.innerHTML = "";
    
    users.forEach((user) => {
        userTable.innerHTML += `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.address}</td>
            </tr>
        `;
    });
}

function validateForm(name, email, phone, address) {
    if (!name || !email || !phone || !address) return "All fields are required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email format";
    if (!/^\d{10}$/.test(phone)) return "Phone must be 10 digits";
    return null;
}

saveBtn.addEventListener("click", async function () {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();

    const error = validateForm(name, email, phone, address);
    if (error) {
        statusText.innerText = error;
        statusText.style.color = "red";
        return;
    }

    const users = await fetchUsers();

    if (!editId) {
        if (users.some(u => u.email === email)) {
            statusText.innerText = "Email already exists";
            statusText.style.color = "red";
            return;
        }
        if (users.some(u => u.phone === phone)) {
            statusText.innerText = "Phone already exists";
            statusText.style.color = "red";
            return;
        }
        if (users.some(u => u.name === name)) {
            statusText.innerText = "Name already exists";
            statusText.style.color = "red";
            return;
        }
        if (users.some(u => u.address === address)) {
            statusText.innerText = "Address already exists";
            statusText.style.color = "red";
            return;
        }
    } else {
        if (users.some(u => u.id !== editId && u.email === email)) {
            statusText.innerText = "Email already exists";
            statusText.style.color = "red";
            return;
        }
        if (users.some(u => u.id !== editId && u.phone === phone)) {
            statusText.innerText = "Phone already exists";
            statusText.style.color = "red";
            return;
        }
        if (users.some(u => u.id !== editId && u.name === name)) {
            statusText.innerText = "Name already exists";
            statusText.style.color = "red";
            return;
        }
        if (users.some(u => u.id !== editId && u.address === address)) {
            statusText.innerText = "Address already exists";
            statusText.style.color = "red";
            return;
        }
    }

    let url = "http://localhost:3000/users";
    let method = "POST";
    if (editId) {
        url += `/${editId}`;
        method = "PUT";
    }

    try {
        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, phone, address }),
        });

        if (!response.ok) {
            const resText = await response.json();
            statusText.innerText = resText.message || "Server error";
            statusText.style.color = "red";
            return;
        }

        document.querySelector("form").reset();
        statusText.innerText = "Saved successfully!";
        statusText.style.color = "green";
        editId = null;
        
        // Fetch the updated users list only after save
        fetchUsers();
    } catch (err) {
        statusText.innerText = "Cannot connect to server";
        statusText.style.color = "red";
    }
});
