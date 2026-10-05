"use strict";
const token = localStorage.getItem("bhurakshak-staff-token") || "";
const staffRole = localStorage.getItem("bhurakshak-staff-role") || "";
const role = localStorage.getItem("bhurakshak-staff-role") || "";
const staffName = localStorage.getItem("bhurakshak-staff-name") || "Staff";
const $ = id => document.getElementById(id);

if (!token || !["admin","officer"].includes(role)) window.location.replace("/");

function headers(json=false){
  const h={}; if(json) h["Content-Type"]="application/json"; h.Authorization=`Bearer ${token}`; return h;
}
function toast(message,type="info"){
  const el=document.createElement("div"); el.className=`toast ${type}`; el.textContent=message; document.body.appendChild(el); requestAnimationFrame(()=>el.classList.add("show")); setTimeout(()=>{el.classList.remove("show");setTimeout(()=>el.remove(),220)},4200);
}
function esc(v){return String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
function statusClass(v){return v==="Verified"?"verified":v==="Rejected"||v==="Flagged"?"rejected":v==="Draft"?"draft":"pending"}

const portalText = {
  en: {officerTitle:"Officer Verification Dashboard",adminTitle:"Administrator Dashboard",officerDesc:"Review submitted user records and open the original uploaded documents for verification.",adminDesc:"Manage digitized land records, inspect uploaded evidence and monitor verification status.",secureOfficer:"SECURE OFFICER AREA",secureAdmin:"SECURE ADMINISTRATOR AREA",signedIn:"Signed in as",total:"Total Records",pending:"Pending Verification",verified:"Verified",documents:"Uploaded Documents",userRecords:"User Land Records",inspect:"Inspect actual submitted records and open their uploaded documents.",search:"Search record ID, user, Khasra, village or district",allStatus:"All Status",recordId:"Record ID",user:"User",khasra:"Khasra",location:"Location",area:"Area",status:"Status",confidence:"Confidence",action:"Action",view:"View",refresh:"Refresh",logout:"Logout",review:"USER RECORD REVIEW",reject:"Reject Record",verify:"✓ Verify Record",rejection:"REJECTION",rejectHelp:"Enter a clear reason for rejecting this record. This reason is saved with the verification status.",cancel:"Cancel",confirmReject:"Reject Record",adminReadOnly:"Read-only administrator review. Verification and rejection are available in the Officer dashboard.",edit:"✎ Edit / Digitize",adminDigitize:"ADMIN DIGITIZATION",editTitle:"Edit / Digitize Record Details",saveEdit:"Save Digitized Details",prototype:"BhuRakshak • Intelligent Land Record System • Hackathon Prototype"},
  hi: {officerTitle:"अधिकारी सत्यापन डैशबोर्ड",adminTitle:"प्रशासक डैशबोर्ड",officerDesc:"जमा किए गए उपयोगकर्ता रिकॉर्ड की समीक्षा करें और सत्यापन के लिए मूल दस्तावेज़ खोलें।",adminDesc:"डिजिटाइज़ किए गए भूमि रिकॉर्ड प्रबंधित करें, दस्तावेज़ देखें और सत्यापन स्थिति देखें।",secureOfficer:"सुरक्षित अधिकारी क्षेत्र",secureAdmin:"सुरक्षित प्रशासक क्षेत्र",signedIn:"लॉगिन उपयोगकर्ता",total:"कुल रिकॉर्ड",pending:"सत्यापन लंबित",verified:"सत्यापित",documents:"अपलोड किए गए दस्तावेज़",userRecords:"उपयोगकर्ता भूमि रिकॉर्ड",inspect:"जमा किए गए रिकॉर्ड देखें और उनके अपलोड किए गए दस्तावेज़ खोलें।",search:"रिकॉर्ड ID, उपयोगकर्ता, खेसरा, गाँव या ज़िला खोजें",allStatus:"सभी स्थिति",recordId:"रिकॉर्ड ID",user:"उपयोगकर्ता",khasra:"खेसरा",location:"स्थान",area:"क्षेत्रफल",status:"स्थिति",confidence:"विश्वसनीयता",action:"कार्रवाई",view:"देखें",refresh:"रिफ्रेश",logout:"लॉगआउट",review:"उपयोगकर्ता रिकॉर्ड समीक्षा",reject:"रिकॉर्ड अस्वीकार करें",verify:"✓ रिकॉर्ड सत्यापित करें",rejection:"अस्वीकृति",rejectHelp:"रिकॉर्ड अस्वीकार करने का स्पष्ट कारण दर्ज करें। यह कारण सत्यापन स्थिति के साथ सेव होगा।",cancel:"रद्द करें",confirmReject:"अस्वीकृति की पुष्टि करें",adminReadOnly:"केवल-पठन प्रशासक समीक्षा। सत्यापन और अस्वीकृति अधिकारी डैशबोर्ड से की जाती है।",edit:"✎ संपादित / डिजिटाइज़ करें",adminDigitize:"प्रशासक डिजिटाइज़ेशन",editTitle:"रिकॉर्ड विवरण संपादित / डिजिटाइज़ करें",saveEdit:"डिजिटाइज़ विवरण सेव करें",prototype:"BhuRakshak • इंटेलिजेंट भूमि रिकॉर्ड सिस्टम • हैकाथॉन प्रोटोटाइप"}
};
let portalLanguage = localStorage.getItem("bhurakshak-language") === "hi" ? "hi" : "en";
function pt(k){ return portalText[portalLanguage][k] || portalText.en[k] || k; }
function applyPortalLanguage(lang){
  portalLanguage = lang === "hi" ? "hi" : "en";
  localStorage.setItem("bhurakshak-language", portalLanguage);
  document.documentElement.lang = portalLanguage;
  const isAdmin = role === "admin";
  $("portalTitle").textContent = isAdmin ? pt("adminTitle") : pt("officerTitle");
  $("portalDesc").textContent = isAdmin ? pt("adminDesc") : pt("officerDesc");
  const small = document.querySelector(".portal-hero small"); if (small) small.textContent = isAdmin ? pt("secureAdmin") : pt("secureOfficer");
  const signed = document.querySelector(".portal-hero p:last-child"); if (signed) signed.firstChild.textContent = pt("signedIn") + " ";
  const stats=document.querySelectorAll(".portal-stat span"); ["total","pending","verified","documents"].forEach((k,i)=>{if(stats[i])stats[i].textContent=pt(k);});
  const card=document.querySelector(".portal-card"); if(card){const h=card.querySelector("h3"); if(h)h.textContent=pt("userRecords"); const d=card.querySelector("p"); if(d)d.textContent=pt("inspect"); const s=card.querySelector("#search"); if(s)s.placeholder=pt("search"); const sel=card.querySelector("#status"); if(sel){sel.options[0].text=pt("allStatus");}}
  const th=document.querySelectorAll(".portal-table thead th"); ["recordId","user","khasra","location","area","status","confidence","action"].forEach((k,i)=>{if(th[i])th[i].textContent=pt(k);});
  const refresh=$("refresh"); if(refresh)refresh.textContent=pt("refresh"); const logout=$("logout"); if(logout)logout.textContent=pt("logout");
  const review=document.querySelector("#detailModal small"); if(review)review.textContent=pt("review");
  const reject=$("rejectRecord"); if(reject)reject.textContent=pt("reject");
  const verify=$("verifyRecord"); if(verify)verify.textContent=pt("verify");
  const rejectSmall=document.querySelector("#rejectModal small"); if(rejectSmall)rejectSmall.textContent=pt("rejection");
  const rejectHelp=document.querySelector("#rejectModal .portal-muted"); if(rejectHelp)rejectHelp.textContent=pt("rejectHelp");
  const cancel=$("cancelReject"); if(cancel)cancel.textContent=pt("cancel");
  const confirm=$("confirmReject"); if(confirm)confirm.textContent=pt("confirmReject");
  const readOnly=document.querySelector("#detailModal .portal-muted"); if(readOnly && role==="admin")readOnly.textContent=pt("adminReadOnly");
  const edit=$("editRecord"); if(edit)edit.textContent=pt("edit");
  const adminSmall=document.querySelector("#editModal small"); if(adminSmall)adminSmall.textContent=pt("adminDigitize");
  const editTitle=document.querySelector("#editModal h2"); if(editTitle)editTitle.textContent=pt("editTitle");
  const saveEdit=$("saveEdit"); if(saveEdit)saveEdit.textContent=pt("saveEdit");
  const footer=document.querySelector(".portal-footer"); if(footer)footer.textContent=pt("prototype");
  $("portalEnglish")?.classList.toggle("primary", portalLanguage==="en"); $("portalHindi")?.classList.toggle("primary", portalLanguage==="hi");
  renderRecords();
}


async function api(url, options={}){
  const response=await fetch(url,{...options,headers:{...headers(Boolean(options.body)),...(options.headers||{})}});
  let data={}; try{data=await response.json()}catch{throw new Error("The server returned an invalid response.")}
  if(response.status===401){ localStorage.removeItem("bhurakshak-staff-token"); localStorage.removeItem("bhurakshak-staff-role"); window.location.replace("/"); throw new Error("Session expired. Please sign in again.") }
  if(!response.ok||data.success===false) throw new Error(data.message||"Request failed.");
  return data;
}

function renderRole(){
  $("roleBadge").textContent=role==="admin"?"ADMINISTRATOR":"OFFICER";
  $("staffName").textContent=staffName;
  $("portalTitle").textContent=role==="admin"?"Administrator Dashboard":"Officer Verification Dashboard";
  $("portalDesc").textContent=role==="admin"?"Manage digitized land records, inspect uploaded evidence and monitor verification status.":"Review submitted user records and open the original uploaded documents for verification.";
}

async function loadStats(){
  try{
    const d=await api("/api/stats");
    $("statTotal").textContent=d.total??0;
    $("statPending").textContent=d.pending??0;
    $("statVerified").textContent=d.verified??0;
    $("statDocuments").textContent=d.documents??0;
  }catch(e){
    console.error("DASHBOARD STATS ERROR:",e);
    const source = Array.isArray(records) ? records : [];
    $("statTotal").textContent=source.length;
    $("statPending").textContent=source.filter(r=>r.status==="Pending").length;
    $("statVerified").textContent=source.filter(r=>r.status==="Verified").length;
  }
}

let records=[];
async function loadRecords(){
  const body=$("recordRows");
  try{
    records=await api("/api/records");
    $("statTotal").textContent = records.length;
    $("statPending").textContent = records.filter(r=>r.status==="Pending").length;
    $("statVerified").textContent = records.filter(r=>r.status==="Verified").length;
    renderRecords();
  }catch(e){body.innerHTML=`<tr><td colspan="8" class="portal-empty">${esc(e.message)}</td></tr>`;toast(e.message,"error")}
}
function renderRecords(){
  const q=($("search")?.value||"").toLowerCase().trim(); const filter=$("status")?.value||"All";
  const filtered=records.filter(r=>{
    const hay=[r.record_id,r.user_name,r.khasra_number,r.village,r.district,r.state].join(" ").toLowerCase();
    return hay.includes(q)&&(filter==="All"||r.status===filter);
  });
  const body=$("recordRows");
  if(!filtered.length){body.innerHTML=`<tr><td colspan="8" class="portal-empty">No user records found.</td></tr>`;return}
  body.innerHTML=filtered.map(r=>`<tr><td><b>${esc(r.record_id)}</b></td><td>${esc(r.user_name)}</td><td>${esc(r.khasra_number)}</td><td>${esc(r.village)}, ${esc(r.district)}</td><td>${esc(r.area)}</td><td><span class="status ${statusClass(r.status)}">${esc(r.status)}</span></td><td>${esc(r.confidence)}</td><td><button class="portal-btn primary" data-view="${esc(r.id)}">${esc(pt("view"))}</button></td></tr>`).join("");
  body.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>viewRecord(b.dataset.view)));
}

async function viewRecord(id){
  try{
    const d=await api(`/api/admin/records/${encodeURIComponent(id)}`);
    const r=d.record; const docs=d.documents||[];
    $("detailTitle").textContent=`${r.user_name||"User"} — ${r.record_id||"Record"}`;
    const digitalPanel = r.status === "Verified"
      ? `<div class="verification-complete"><strong>✓ Verification complete</strong><p>The verified digital record is ready. Use the button to generate it securely.</p><button class="portal-btn primary digital-document-btn" type="button" data-digital-id="${esc(id)}">▣ View / Print Digital Document</button></div>`
      : "";
    $("detailBody").innerHTML=`${digitalPanel}<div class="detail-grid">${[["Name",r.user_name],["Mobile",r.user_contact],["Email",r.user_email],["State",r.state],["District",r.district],["Subdivision",r.subdivision],["Tehsil",r.tehsil],["Circle / Anchal",r.circle],["Revenue Thana",r.revenue_thana],["Village",r.village],["Village Code",r.village_code],["Ward",r.ward],["Address",r.address],["PIN",r.pin_code],["Khesara",r.khasra_number],["Survey",r.survey_number],["Plot Number",r.plot_number],["Khata / Khatauni",r.khata_number],["Khatiyan / Jamabandi",r.khatiyan_number],["Area",r.area],["Land Type",r.land_type],["Land Classification",r.land_classification],["Ownership",r.ownership_type],["Mutation",r.mutation_status],["Registration ID",r.registration_id],["Registry / Deed Number",r.registry_deed_number],["Registry Date",r.registry_date],["Registration Office",r.registration_office],["Father",r.father_name],["Mother",r.mother_name],["Applicant Aadhaar (Last 4)",r.id_last4 ? `•••• ${r.id_last4}` : ""],["Father Aadhaar (Last 4)",r.father_id_last4 ? `•••• ${r.father_id_last4}` : ""],["ULPIN",r.ulpin],["East Boundary",r.boundary_east],["West Boundary",r.boundary_west],["North Boundary",r.boundary_north],["South Boundary",r.boundary_south],["Status",r.status] ].map(([a,b])=>`<div class="detail-item"><span>${esc(a)}</span><b>${esc(b)||"—"}</b></div>`).join("")}</div><h3>Uploaded Documents</h3><div class="docs">${docs.length?docs.map(d=>`<div class="doc-row"><div><b>${esc(d.document_type)}</b><small>${esc(d.original_name)} • ${Math.ceil((Number(d.size)||0)/1024)} KB</small></div><button class="portal-btn" type="button" data-document-id="${esc(d.id)}">Open Document ↗</button></div>`).join(""):`<div class="portal-empty">No documents uploaded.</div>`}</div>`;
    document.querySelectorAll("[data-digital-id]").forEach(btn => btn.addEventListener("click", () => openDigitalDocument(btn.dataset.digitalId)));
    document.querySelectorAll("[data-document-id]").forEach(btn => btn.addEventListener("click", () => openPortalDocument(btn.dataset.documentId)));
    const verifyButton = $("verifyRecord");
    const rejectButton = $("rejectRecord");
    const verified = r.status === "Verified";
    if (verifyButton) {
      verifyButton.dataset.id=id;
      verifyButton.style.display = role === "officer" && !verified ? "inline-flex" : "none";
    }
    if (rejectButton) {
      rejectButton.dataset.id=id;
      rejectButton.style.display = role === "officer" && !verified ? "inline-flex" : "none";
    }
    const editButton=$("editRecord");
    if(editButton){
      editButton.dataset.id=id;
      editButton.style.display=(role==="admin" && r.status!=="Verified")?"inline-flex":"none";
      editButton.__record=r;
      editButton.title=r.status==="Verified"?"Verified records are locked and cannot be edited.":"Edit before verification";
    }
    $("detailModal").classList.add("open");
  }catch(e){toast(e.message,"error")}
}

async function openDigitalDocument(id){
  try{
    const response=await fetch(`/api/admin/records/${encodeURIComponent(id)}/digital-document`,{headers:headers()});
    if(!response.ok){const d=await response.json().catch(()=>({}));throw new Error(d.message||"Digital document could not be generated.");}
    const html=await response.text();
    const blob=new Blob([html],{type:"text/html;charset=utf-8"});
    const url=URL.createObjectURL(blob);
    window.open(url,"_blank","noopener");
    setTimeout(()=>URL.revokeObjectURL(url),60000);
  }catch(e){toast(e.message,"error")}
}
async function openPortalDocument(id){
  try{
    const response=await fetch(`/api/admin/documents/${encodeURIComponent(id)}`,{headers:headers()});
    if(!response.ok){const d=await response.json().catch(()=>({}));throw new Error(d.message||"Document could not be opened.");}
    const blob=await response.blob();
    const url=URL.createObjectURL(blob);
    window.open(url,"_blank","noopener");
    setTimeout(()=>URL.revokeObjectURL(url),60000);
  }catch(e){toast(e.message,"error")}
}

function openEditModal(record){
  if(role!=="admin") return toast("Administrator access is required.","error");
  if(record.status==="Verified") return toast("This record has already been verified and can no longer be edited.","error");
  const form=$("editForm"); if(!form) return;
  const fields=[["user_name","Full Name"],["user_contact","Mobile Number"],["user_email","Email"],["state","State"],["district","District"],["subdivision","Subdivision"],["tehsil","Tehsil / Taluk"],["circle","Circle / Anchal"],["revenue_thana","Revenue Thana"],["village","Village"],["village_code","Village Code"],["ward","Ward"],["address","Full Address"],["pin_code","PIN Code"],["khasra_number","Khasra / Khesara Number"],["survey_number","Survey Number"],["plot_number","Plot Number"],["khata_number","Khata / Khatauni Number"],["khatiyan_number","Khatiyan / Jamabandi Number"],["area","Area"],["land_type","Land Type"],["land_classification","Land Classification"],["ownership_type","Ownership Type"],["mutation_status","Mutation Status"],["registration_id","Registration ID"],["registry_deed_number","Registry / Deed Number"],["registry_date","Registry Date"],["registration_office","Registration Office"],["father_name","Father Name"],["mother_name","Mother Name"],["father_id_last4","Father Aadhaar (Last 4)"],["ulpin","ULPIN / Parcel ID"],["boundary_east","East Boundary"],["boundary_west","West Boundary"],["boundary_north","North Boundary"],["boundary_south","South Boundary"]];
  form.innerHTML=fields.map(([key,label])=>{return `<label><span>${esc(label)}</span><input name="${key}" value="${esc(record[key])}" ${["user_name","father_name","mother_name"].includes(key)?"required":""}></label>`}).join("");
  $("editModal").classList.add("open");$("editModal").setAttribute("aria-hidden","false");
}
async function saveEditedRecord(event){
  event.preventDefault();const id=$("editRecord")?.dataset.id;if(!id)return;const payload=Object.fromEntries(new FormData($("editForm")).entries());const button=$("saveEdit");
  try{button.disabled=true;await api(`/api/admin/records/${encodeURIComponent(id)}/details`,{method:"PUT",body:JSON.stringify(payload)});toast("Record details digitized and saved.","success");$("editModal").classList.remove("open");await Promise.all([loadRecords(),loadStats()]);await viewRecord(id);}catch(e){toast(e.message,"error")}finally{button.disabled=false;}
}

let pendingRejectId = null;
function openRejectModal(id){
  pendingRejectId=id;
  $("rejectReason").value="";
  $("rejectModal").classList.add("open");
  $("rejectModal").setAttribute("aria-hidden","false");
  setTimeout(()=>$("rejectReason")?.focus(),50);
}
function closeRejectModal(){
  pendingRejectId=null;
  $("rejectModal")?.classList.remove("open");
  $("rejectModal")?.setAttribute("aria-hidden","true");
}
async function updateStatus(id,status,rejection_reason=""){
  if(role!=="officer"){ toast("Only an authorized Officer can verify or reject records.","error"); return; }
  try{
    const result = await api(`/api/admin/records/${encodeURIComponent(id)}/status`,{method:"PUT",body:JSON.stringify({status,rejection_reason})});
    toast(status==="Verified"?"Verification completed. The updated digital document is ready.":"Record rejected successfully.","success");
    closeRejectModal();
    $("detailModal")?.classList.remove("open");
    await Promise.all([loadRecords(),loadStats()]);
    if(status === "Verified") {
      // Close the officer verification view, then open the freshly generated
      // digital record built from the verified database values.
      await openDigitalDocument(id);
    }
  }catch(e){toast(e.message,"error")}
}

$("portalEnglish")?.addEventListener("click",()=>applyPortalLanguage("en"));
$("portalHindi")?.addEventListener("click",()=>applyPortalLanguage("hi"));
$("staffName").textContent=staffName; renderRole(); applyPortalLanguage(portalLanguage); loadStats(); loadRecords();
// Keep the dashboard counters/table in sync with new uploads without requiring a manual refresh.
const dashboardRefreshTimer = setInterval(() => { loadStats(); loadRecords(); }, 5000);
window.addEventListener("beforeunload", () => clearInterval(dashboardRefreshTimer));
$("search")?.addEventListener("input",renderRecords); $("status")?.addEventListener("change",renderRecords);
$("closeDetail")?.addEventListener("click",()=>$("detailModal").classList.remove("open")); $("detailModal")?.addEventListener("click",e=>{if(e.target.id==="detailModal")$("detailModal").classList.remove("open")});
$("verifyRecord")?.addEventListener("click",()=>updateStatus($("verifyRecord").dataset.id,"Verified"));
$("rejectRecord")?.addEventListener("click",()=>openRejectModal($("rejectRecord").dataset.id));
$("closeReject")?.addEventListener("click",closeRejectModal);
$("cancelReject")?.addEventListener("click",closeRejectModal);
$("rejectModal")?.addEventListener("click",e=>{if(e.target.id==="rejectModal")closeRejectModal()});
$("confirmReject")?.addEventListener("click",()=>{const reason=$("rejectReason")?.value.trim()||"";if(!reason){toast("Please enter a rejection reason.","error");$("rejectReason")?.focus();return;}updateStatus(pendingRejectId,"Rejected",reason)});
$("editRecord")?.addEventListener("click",()=>openEditModal($("editRecord").__record||{}));
$("closeEdit")?.addEventListener("click",()=>$("editModal").classList.remove("open"));
$("cancelEdit")?.addEventListener("click",()=>$("editModal").classList.remove("open"));
$("editForm")?.addEventListener("submit",saveEditedRecord);
$("refresh")?.addEventListener("click", async (event) => {
  event.preventDefault();
  // In this prototype, Refresh is also the explicit session-exit action:
  // return the staff user to the public Login screen.
  try { await fetch("/api/auth/logout", { method: "POST", headers: headers() }); } catch {}
  localStorage.removeItem("bhurakshak-staff-token");
  localStorage.removeItem("bhurakshak-staff-role");
  localStorage.removeItem("bhurakshak-staff-name");
  window.location.replace("/");
});
const portalRefreshTimer = setInterval(() => { loadStats(); loadRecords(); }, 5000);
window.addEventListener("beforeunload", () => clearInterval(portalRefreshTimer));
$("logout")?.addEventListener("click",async()=>{try{await api("/api/auth/logout",{method:"POST"})}catch{} localStorage.removeItem("bhurakshak-staff-token");localStorage.removeItem("bhurakshak-staff-role");localStorage.removeItem("bhurakshak-staff-name");window.location.replace("/")});


// Role hardening: admin pages are read-only for verification status.
document.addEventListener("DOMContentLoaded", () => {
  if (staffRole === "admin") {
    document.querySelectorAll("#verifyRecord,#rejectRecord,#approveApplicantRecord,#rejectApplicantRecord").forEach(el => el.remove());
  }
});
