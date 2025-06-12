const showFormBtn = document.getElementById('showFormBtn');
const studentForm = document.getElementById('studentForm');
const tableBody = document.querySelector('#studentTable tbody');

let students = []; 


showFormBtn.addEventListener('click', () => {
  studentForm.classList.toggle('hidden');
});


studentForm.addEventListener('submit', function (e) {
  e.preventDefault();

 
  const name = document.getElementById('name').value.trim();
  const id = document.getElementById('studentId').value.trim();
  const term1 = Number(document.getElementById('term1').value);
  const term2 = Number(document.getElementById('term2').value);
  const term3 = Number(document.getElementById('term3').value);


  const average = ((term1 + term2 + term3) / 3).toFixed(2);

  
  const status = average >= 70
    ? "✅ Eligible for SID Scholarship"
    : "❌ Not Eligible for SID Scholarship";

 
  const student = {
    name,
    id,
    term1,
    term2,
    term3,
    average: Number(average),
    status
  };

  students.push(student); 
  renderTable();          
  studentForm.reset();    
});


const renderTable = () => {
  tableBody.innerHTML = "";

  students.forEach((student, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.id}</td>
      <td>${student.term1}</td>
      <td>${student.term2}</td>
      <td>${student.term3}</td>
      <td>${student.average}</td>
      <td>${student.status}</td>
    `;

    tableBody.appendChild(row);
  });

  logExtras(); // 
};


const logExtras = () => {
  
  const names = students.map(student => student.name);
  console.log("Student Names:", names);

 
  const eligible = students.filter(s => s.average >= 70);
  console.log("Eligible Students:", eligible);

 
  const total = students.reduce((sum, s) => sum + s.average, 0);
  const classAvg = (total / students.length).toFixed(2);
  console.log("Class Average:", classAvg);

 
  console.log("Student IDs:");
  students.forEach(s => console.log(s.id));

 
  if (students.length > 10) {
    students.splice(0, 1);
    console.log("Removed oldest student to keep list short.");
  }
};