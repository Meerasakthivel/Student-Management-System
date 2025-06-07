let students = JSON.parse(localStorage.getItem("students")) || [];

function addStudent() {
  const name = document.getElementById("name").value.trim();
  const age = document.getElementById("age").value.trim();
  const grade = document.getElementById("grade").value.trim();
  const section = document.getElementById("section").value.trim();
  const department = document.getElementById("department").value.trim();

  if (!name || !age || !grade || !section || !department) {
    alert("❗ Please fill out all fields.");
    return;
  }

  students.push({ name, age, grade, section, department });
  localStorage.setItem("students", JSON.stringify(students));
  renderStudents();
  clearForm();
}

function renderStudents() {
  const tbody = document.getElementById("studentTableBody");
  tbody.innerHTML = "";

  students.forEach((student, index) => {
    const row = `<tr>
      <td contenteditable="true" onblur="updateStudent(${index}, 'name', this.innerText)">${student.name}</td>
      <td contenteditable="true" onblur="updateStudent(${index}, 'age', this.innerText)">${student.age}</td>
      <td contenteditable="true" onblur="updateStudent(${index}, 'grade', this.innerText)">${student.grade}</td>
      <td contenteditable="true" onblur="updateStudent(${index}, 'section', this.innerText)">${student.section}</td>
      <td contenteditable="true" onblur="updateStudent(${index}, 'department', this.innerText)">${student.department}</td>
      <td><button class="delete-btn" onclick="deleteStudent(${index})">🗑️ Delete</button></td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

function updateStudent(index, key, value) {
  if (key === "age" && isNaN(value)) {
    alert("Age must be a number.");
    renderStudents(); // Revert invalid change
    return;
  }
  students[index][key] = value.trim();
  localStorage.setItem("students", JSON.stringify(students));
}

function deleteStudent(index) {
  if (confirm("Are you sure you want to delete this student?")) {
    students.splice(index, 1);
    localStorage.setItem("students", JSON.stringify(students));
    renderStudents();
  }
}

function searchStudent() {
  const query = document.getElementById("search").value.toLowerCase();
  const rows = document.querySelectorAll("#studentTableBody tr");

  rows.forEach(row => {
    const name = row.children[0].textContent.toLowerCase();
    row.style.display = name.includes(query) ? "" : "none";
  });
}

function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("age").value = "";
  document.getElementById("grade").value = "";
  document.getElementById("section").value = "";
  document.getElementById("department").value = "";
}

renderStudents();
function exportToCSV() {
  if (students.length === 0) {
    alert("No student data to export.");
    return;
  }

  const headers = ["Name", "Age", "Grade", "Section", "Department"];
  const rows = students.map(s => [s.name, s.age, s.grade, s.section, s.department]);

  let csvContent = "data:text/csv;charset=utf-8," 
    + headers.join(",") + "\n"
    + rows.map(row => row.map(value => `"${value}"`).join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "students.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}