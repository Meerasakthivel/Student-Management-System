const DB_KEY="studenthub_db_v3", THEME_KEY="studenthub_theme_v3";
let currentUser=null, attendanceDraft={}, marksDraft={};
let charts={};

const DEMO_USERS={
  "admin@school.com":{password:"admin123",role:"admin",name:"Administrator"},
  "teacher@school.com":{password:"teacher123",role:"teacher",name:"Priya Teacher"},
  "parent@school.com":{password:"parent123",role:"parent",name:"Parent Portal"}
};

const $=id=>document.getElementById(id);
const uid=()=>crypto.randomUUID?crypto.randomUUID():Date.now()+"-"+Math.random();

function defaultDB(){
  const students=[
    {id:"STU1001",name:"Arun Kumar",age:20,section:"A",department:"Computer Science",parentName:"Kumar Raj",parentEmail:"parent@school.com"},
    {id:"STU1002",name:"Divya Priya",age:19,section:"A",department:"Information Technology",parentName:"Priya Devi",parentEmail:"parent2@school.com"},
    {id:"STU1003",name:"Rahul Das",age:21,section:"B",department:"ECE",parentName:"Das Family",parentEmail:"parent3@school.com"},
    {id:"STU1004",name:"Meena S",age:20,section:"C",department:"ADS",parentName:"Suresh S",parentEmail:"parent4@school.com"}
  ];
  return {
    students,
    attendance:[
      {studentId:"STU1001",date:today(-1),status:"present"},
      {studentId:"STU1002",date:today(-1),status:"present"},
      {studentId:"STU1003",date:today(-1),status:"absent"},
      {studentId:"STU1004",date:today(-1),status:"present"},
      {studentId:"STU1001",date:today(-2),status:"present"},
      {studentId:"STU1002",date:today(-2),status:"absent"},
      {studentId:"STU1003",date:today(-2),status:"present"},
      {studentId:"STU1004",date:today(-2),status:"present"}
    ],
    marks:[
      {id:uid(),studentId:"STU1001",exam:"Midterm",subject:"Programming",marks:88},
      {id:uid(),studentId:"STU1001",exam:"Midterm",subject:"Database",marks:82},
      {id:uid(),studentId:"STU1001",exam:"Midterm",subject:"Networking",marks:91},
      {id:uid(),studentId:"STU1002",exam:"Midterm",subject:"Programming",marks:94},
      {id:uid(),studentId:"STU1002",exam:"Midterm",subject:"Database",marks:89},
      {id:uid(),studentId:"STU1003",exam:"Midterm",subject:"Programming",marks:75},
      {id:uid(),studentId:"STU1003",exam:"Midterm",subject:"Database",marks:78},
      {id:uid(),studentId:"STU1004",exam:"Midterm",subject:"Programming",marks:86}
    ]
  };
}
function getDB(){let db=JSON.parse(localStorage.getItem(DB_KEY));if(!db){db=defaultDB();saveDB(db)}return db}
function saveDB(db){localStorage.setItem(DB_KEY,JSON.stringify(db))}
function today(offset=0){const d=new Date();d.setDate(d.getDate()+offset);return d.toISOString().slice(0,10)}
function initials(n){return n.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join("").toUpperCase()}
function studentById(id){return getDB().students.find(s=>s.id===id)}
function avg(arr){return arr.length?Math.round(arr.reduce((a,b)=>a+b,0)/arr.length):0}
function grade(m){if(m>=90)return"A+";if(m>=80)return"A";if(m>=70)return"B+";if(m>=60)return"B";if(m>=50)return"C";if(m>=40)return"D";return"F"}
function esc(v){return String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

document.addEventListener("DOMContentLoaded",()=>{
  $("loginForm").addEventListener("submit",login);
  $("logoutBtn").addEventListener("click",logout);
  $("themeBtn").addEventListener("click",toggleTheme);
  $("studentForm").addEventListener("submit",saveStudent);
  $("cancelStudentEdit").addEventListener("click",resetStudentForm);
  $("studentSearch").addEventListener("input",renderStudents);
  $("studentDeptFilter").addEventListener("change",renderStudents);
  $("attendanceDate").value=today();
  $("attendanceSectionFilter").addEventListener("change",renderAttendance);
  $("markAllPresent").addEventListener("click",()=>setAllAttendance("present"));
  $("saveAttendance").addEventListener("click",saveAttendance);
  $("examSelect").addEventListener("change",renderMarks);
  $("marksSubject").addEventListener("change",renderMarks);
  $("saveMarks").addEventListener("click",saveMarks);
  $("reportStudentSelect").addEventListener("change",renderReport);
  $("exportStudentsBtn").addEventListener("click",exportStudentsCSV);
  $("exportAllBtn").addEventListener("click",exportJSON);
  $("exportReportBtn").addEventListener("click",exportAcademicCSV);
  $("printReportBtn").addEventListener("click",()=>window.print());
  $("nav").addEventListener("click",e=>{
    const btn=e.target.closest("[data-page]");if(btn){showPage(btn.dataset.page);document.querySelectorAll(".nav-item[data-page]").forEach(x=>x.classList.remove("active"));btn.classList.add("active")}
  });
  document.body.addEventListener("click",e=>{
    const go=e.target.closest("[data-go]");if(go)showPage(go.dataset.go)
  });
  $("attendanceDate").addEventListener("change",renderAttendance);
  applyTheme();
  if(sessionStorage.getItem("studenthub_user")){currentUser=JSON.parse(sessionStorage.getItem("studenthub_user"));enterApp()}
  updateClock();
  setInterval(updateClock,30000);
});

function login(e){
  e.preventDefault();
  const user=DEMO_USERS[$("loginUser").value.trim().toLowerCase()];
  const role=$("loginRole").value;
  if(!user||user.password!==$("loginPassword").value||user.role!==role){
    $("loginError").textContent="Invalid login details or role.";return;
  }
  currentUser={email:$("loginUser").value.trim().toLowerCase(),...user};
  sessionStorage.setItem("studenthub_user",JSON.stringify(currentUser));$("loginError").textContent="";enterApp();
}
function enterApp(){
  $("loginScreen").classList.add("hidden");$("app").classList.remove("hidden");
  $("userName").textContent=currentUser.name;$("userRole").textContent=currentUser.role.toUpperCase();
  $("userAvatar").textContent=initials(currentUser.name);
  document.querySelectorAll(".admin-only").forEach(x=>x.classList.toggle("hidden",currentUser.role!=="admin"));
  document.querySelectorAll(".teacher-only").forEach(x=>x.classList.toggle("hidden",currentUser.role!=="teacher"));
  if(currentUser.role==="parent"){document.querySelectorAll(".report-access").forEach(x=>x.classList.remove("hidden"));showPage("reports")}
  else showPage("dashboard");
}
function logout(){sessionStorage.removeItem("studenthub_user");location.reload()}
function updateClock(){$("dateNow").textContent=new Date().toLocaleDateString("en-IN",{weekday:"short",day:"2-digit",month:"short",year:"numeric"})}

function showPage(page){
  const titles={dashboard:["Dashboard","Overview of student performance and attendance."],students:["Students","Manage student records and academic profiles."],addStudent:["Add Student","Create or update student profiles."],attendance:["Attendance","Record daily student attendance."],marks:["Marks","Enter and manage examination marks."],reports:["Student Reports","View attendance, marks and academic summaries."],export:["Export Center","Download reports and database backups."]};
  if((page==="students"||page==="addStudent"||page==="export")&&currentUser.role!=="admin")return;
  if((page==="attendance"||page==="marks")&&currentUser.role!=="teacher")return;
  document.querySelectorAll(".page").forEach(x=>x.classList.add("hidden"));
  $(page+"Page").classList.remove("hidden");$("pageTitle").textContent=titles[page][0];$("pageSubtitle").textContent=titles[page][1];
  if(page==="dashboard")renderDashboard();
  if(page==="students"){populateDeptFilter();renderStudents()}
  if(page==="attendance")renderAttendance();
  if(page==="marks")renderMarks();
  if(page==="reports"){populateReportStudents();renderReport()}
}

function renderDashboard(){
  const db=getDB(), students=db.students;
  $("statStudents").textContent=students.length;
  $("statDepartments").textContent=new Set(students.map(s=>s.department)).size;
  const attRate=avg(students.map(s=>attendanceRate(s.id)));$("statAttendance").textContent=attRate+"%";
  const allMarks=db.marks.map(m=>Number(m.marks));$("statMarks").textContent=avg(allMarks)+"%";
  const recent=students.slice(-5).reverse();
  $("recentStudents").innerHTML=`<div class="mini-row head"><span>Student</span><span>Department</span><span>Attendance</span><span>Average</span></div>`+
    recent.map(s=>`<div class="mini-row"><span><b>${esc(s.name)}</b></span><span>${esc(s.department)}</span><span>${attendanceRate(s.id)}%</span><span>${studentAverage(s.id)}%</span></div>`).join("");
  drawCharts();
}
function drawCharts(){
  const db=getDB();
  Object.values(charts).forEach(c=>c?.destroy());charts={};
  const bySubject={};db.marks.forEach(m=>(bySubject[m.subject]??=[]).push(+m.marks));
  charts.marks=new Chart($("marksChart"),{type:"bar",data:{labels:Object.keys(bySubject),datasets:[{label:"Average Marks",data:Object.values(bySubject).map(avg)}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,max:100}}}});
  const present=db.attendance.filter(a=>a.status==="present").length, absent=db.attendance.filter(a=>a.status==="absent").length;
  charts.att=new Chart($("attendanceChart"),{type:"doughnut",data:{labels:["Present","Absent"],datasets:[{data:[present,absent]}]},options:{responsive:true,plugins:{legend:{position:"bottom"}}}});
}
function attendanceRate(id){
  const a=getDB().attendance.filter(x=>x.studentId===id);return a.length?Math.round(a.filter(x=>x.status==="present").length/a.length*100):0
}
function studentAverage(id){return avg(getDB().marks.filter(m=>m.studentId===id).map(m=>+m.marks))}

function saveStudent(e){
  e.preventDefault();const db=getDB(), edit=$("editStudentId").value;
  const data={name:$("studentName").value.trim(),age:+$("studentAge").value,section:$("studentSection").value,department:$("studentDepartment").value,parentName:$("parentName").value.trim(),parentEmail:$("parentEmail").value.trim()};
  if(!data.name||data.age<5||!data.section||!data.department||!data.parentName||!data.parentEmail){toast("Please complete all fields.","error");return}
  if(edit){const s=db.students.find(x=>x.id===edit);Object.assign(s,data);toast("Student updated.","success")}
  else{const id="STU"+String(Math.max(1000,...db.students.map(s=>Number(s.id.replace("STU",""))||1000))+1);db.students.push({id,...data});toast("Student added successfully.","success")}
  saveDB(db);resetStudentForm();showPage("students")
}
function resetStudentForm(){$("studentForm").reset();$("editStudentId").value="";$("studentFormTitle").textContent="Add New Student";$("studentSubmitText").textContent="Add Student";$("cancelStudentEdit").classList.add("hidden")}
function editStudent(id){
  const s=studentById(id);if(!s)return;
  $("editStudentId").value=s.id;$("studentName").value=s.name;$("studentAge").value=s.age;$("studentSection").value=s.section;$("studentDepartment").value=s.department;$("parentName").value=s.parentName;$("parentEmail").value=s.parentEmail;
  $("studentFormTitle").textContent="Edit Student";$("studentSubmitText").textContent="Save Changes";$("cancelStudentEdit").classList.remove("hidden");showPage("addStudent")
}
function deleteStudent(id){
  const s=studentById(id);if(!s||!confirm(`Delete ${s.name}?`))return;const db=getDB();db.students=db.students.filter(x=>x.id!==id);db.attendance=db.attendance.filter(x=>x.studentId!==id);db.marks=db.marks.filter(x=>x.studentId!==id);saveDB(db);toast("Student deleted.","success");renderStudents();renderDashboard()
}
function populateDeptFilter(){
  const old=$("studentDeptFilter").value, deps=[...new Set(getDB().students.map(s=>s.department))].sort();
  $("studentDeptFilter").innerHTML='<option value="all">All Departments</option>'+deps.map(d=>`<option>${esc(d)}</option>`).join("");$("studentDeptFilter").value=deps.includes(old)?old:"all"
}
function renderStudents(){
  const db=getDB(),q=$("studentSearch").value.toLowerCase(),dep=$("studentDeptFilter").value;
  const list=db.students.filter(s=>(`${s.name} ${s.id} ${s.department}`.toLowerCase().includes(q))&&(dep==="all"||s.department===dep));
  $("studentsBody").innerHTML=list.map(s=>`<tr>
    <td><div class="student-cell"><div class="avatar">${initials(s.name)}</div><div><strong>${esc(s.name)}</strong><small>${s.id}</small></div></div></td>
    <td>${s.age}</td><td>Section ${esc(s.section)}</td><td>${esc(s.department)}</td><td><span class="badge">${attendanceRate(s.id)}%</span></td><td><span class="badge">${studentAverage(s.id)}%</span></td>
    <td><div class="action-row"><button class="small-btn" style="background:var(--primary)" onclick="editStudent('${s.id}')"><i class="fa-solid fa-pen"></i></button><button class="small-btn" style="background:var(--danger)" onclick="deleteStudent('${s.id}')"><i class="fa-solid fa-trash"></i></button></div></td>
  </tr>`).join("")||'<tr><td colspan="7" style="text-align:center;padding:35px;color:var(--muted)">No students found.</td></tr>'
}

function renderAttendance(){
  const db=getDB(),date=$("attendanceDate").value,sec=$("attendanceSectionFilter").value;
  const list=db.students.filter(s=>sec==="all"||s.section===sec);
  attendanceDraft={};list.forEach(s=>{const old=db.attendance.find(a=>a.studentId===s.id&&a.date===date);attendanceDraft[s.id]=old?.status||"present"});
  $("attendanceBody").innerHTML=list.map(s=>`<tr><td><div class="student-cell"><div class="avatar">${initials(s.name)}</div><div><strong>${esc(s.name)}</strong><small>${s.id}</small></div></div></td><td>${esc(s.department)}</td><td>
  <select data-att="${s.id}" onchange="attendanceDraft['${s.id}']=this.value"><option value="present" ${attendanceDraft[s.id]==="present"?"selected":""}>Present</option><option value="absent" ${attendanceDraft[s.id]==="absent"?"selected":""}>Absent</option></select></td></tr>`).join("");
}
function setAllAttendance(status){document.querySelectorAll("[data-att]").forEach(x=>{x.value=status;attendanceDraft[x.dataset.att]=status})}
function saveAttendance(){
  const db=getDB(),date=$("attendanceDate").value;
  Object.entries(attendanceDraft).forEach(([studentId,status])=>{
    const i=db.attendance.findIndex(a=>a.studentId===studentId&&a.date===date);
    if(i>=0)db.attendance[i].status=status;else db.attendance.push({studentId,date,status});
  });saveDB(db);toast("Attendance saved successfully.","success");renderDashboard()
}

function renderMarks(){
  const db=getDB(),exam=$("examSelect").value,subject=$("marksSubject").value;marksDraft={};
  $("marksBody").innerHTML=db.students.map(s=>{
    const m=db.marks.find(x=>x.studentId===s.id&&x.exam===exam&&x.subject===subject);marksDraft[s.id]=m?.marks??"";
    return `<tr><td><div class="student-cell"><div class="avatar">${initials(s.name)}</div><div><strong>${esc(s.name)}</strong><small>${s.id}</small></div></div></td><td>${esc(subject)}</td><td><input type="number" min="0" max="100" value="${m?.marks??""}" data-mark="${s.id}" oninput="marksDraft['${s.id}']=this.value"></td><td id="grade-${s.id}">${m?grade(m.marks):"—"}</td></tr>`
  }).join("");
}
function saveMarks(){
  const db=getDB(),exam=$("examSelect").value,subject=$("marksSubject").value;
  for(const [studentId,value] of Object.entries(marksDraft)){if(value===""||value<0||value>100)continue;const i=db.marks.findIndex(m=>m.studentId===studentId&&m.exam===exam&&m.subject===subject);const obj={id:i>=0?db.marks[i].id:uid(),studentId,exam,subject,marks:+value};if(i>=0)db.marks[i]=obj;else db.marks.push(obj)}
  saveDB(db);toast("Marks saved successfully.","success");renderMarks();renderDashboard()
}

function populateReportStudents(){
  const db=getDB();let list=db.students;
  if(currentUser.role==="parent")list=list.filter(s=>s.parentEmail.toLowerCase()===currentUser.email||s.id==="STU1001");
  $("reportStudentSelect").innerHTML=list.map(s=>`<option value="${s.id}">${esc(s.name)} — ${s.id}</option>`).join("")||"<option>No linked student</option>"
}
function renderReport(){
  const id=$("reportStudentSelect").value,s=studentById(id);if(!s){$("reportContent").innerHTML='<section class="card">No report available.</section>';return}
  const db=getDB(),marks=db.marks.filter(m=>m.studentId===id),att=db.attendance.filter(a=>a.studentId===id),avgMarks=avg(marks.map(m=>+m.marks)),attRate=attendanceRate(id);
  $("reportContent").innerHTML=`<section class="card">
    <div class="report-header"><div class="avatar">${initials(s.name)}</div><div><p class="eyebrow">Academic Report</p><h2>${esc(s.name)}</h2><p class="muted">${s.id} · Section ${esc(s.section)} · ${esc(s.department)}</p></div></div>
    <div class="report-grid" style="margin-top:20px"><div class="report-stat"><span>Attendance</span><strong>${attRate}%</strong></div><div class="report-stat"><span>Average Marks</span><strong>${avgMarks}%</strong></div><div class="report-stat"><span>Overall Grade</span><strong>${grade(avgMarks)}</strong></div></div>
  </section>
  <section class="card"><div class="card-title"><div><p class="eyebrow">Subject Performance</p><h2>Marks Breakdown</h2></div></div>
    <div class="subject-list">${marks.length?marks.map(m=>`<div class="subject-line"><span>${esc(m.subject)} <small class="muted">(${esc(m.exam)})</small></span><div class="progress"><i style="width:${m.marks}%"></i></div><b>${m.marks}</b></div>`).join(""):"<p class='muted'>No marks entered yet.</p>"}</div>
  </section>
  <section class="card"><div class="card-title"><div><p class="eyebrow">Attendance History</p><h2>Recent Attendance</h2></div></div>
    <div class="mini-table"><div class="mini-row head"><span>Date</span><span>Status</span><span></span><span></span></div>${att.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(a=>`<div class="mini-row"><span>${a.date}</span><span class="badge">${a.status.toUpperCase()}</span><span></span><span></span></div>`).join("")||"<p class='muted'>No attendance records yet.</p>"}</div>
  </section>`
}

function csvEscape(v){return `"${String(v).replaceAll('"','""')}"`}
function download(name,content,type="text/plain"){const a=document.createElement("a"),u=URL.createObjectURL(new Blob([content],{type}));a.href=u;a.download=name;a.click();URL.revokeObjectURL(u)}
function exportStudentsCSV(){
  const db=getDB(),rows=[["Student ID","Name","Age","Section","Department","Parent","Parent Email","Attendance %","Average Mark"]];
  db.students.forEach(s=>rows.push([s.id,s.name,s.age,s.section,s.department,s.parentName,s.parentEmail,attendanceRate(s.id),studentAverage(s.id)]));
  download("students.csv",rows.map(r=>r.map(csvEscape).join(",")).join("\n"),"text/csv");toast("Student CSV exported.","success")
}
function exportAcademicCSV(){
  const db=getDB(),rows=[["Student ID","Name","Department","Attendance %","Average Mark","Grade"]];
  db.students.forEach(s=>rows.push([s.id,s.name,s.department,attendanceRate(s.id),studentAverage(s.id),grade(studentAverage(s.id))]));
  download("academic-report.csv",rows.map(r=>r.map(csvEscape).join(",")).join("\n"),"text/csv");toast("Academic report exported.","success")
}
function exportJSON(){download("studenthub-backup.json",JSON.stringify(getDB(),null,2),"application/json");toast("Full database backup exported.","success")}

function toast(message,type=""){const t=document.createElement("div");t.className=`toast ${type}`;t.textContent=message;$("toastContainer").appendChild(t);setTimeout(()=>t.remove(),3000)}
function toggleTheme(){const dark=document.documentElement.getAttribute("data-theme")==="dark";document.documentElement.setAttribute("data-theme",dark?"light":"dark");localStorage.setItem(THEME_KEY,dark?"light":"dark")}
function applyTheme(){document.documentElement.setAttribute("data-theme",localStorage.getItem(THEME_KEY)||"light")}
