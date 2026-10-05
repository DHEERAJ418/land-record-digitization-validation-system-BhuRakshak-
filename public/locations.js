"use strict";

// State/UT names are kept locally so the selector works offline.
// District lists are loaded from a maintained public dataset when available;
// the application never invents a district when the source cannot be reached.
window.BHURAKSHAK_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"
];

window.BHURAKSHAK_DISTRICT_SOURCE = "https://raw.githubusercontent.com/KTBsomen/Indian-state-district-json/main/india-states-districts-latest.json";
window.BHURAKSHAK_LOCATION_CACHE = new Map();
window.BHURAKSHAK_DISTRICT_FALLBACK = null;

async function loadBundledDistricts() {
  if (window.BHURAKSHAK_DISTRICT_FALLBACK) return window.BHURAKSHAK_DISTRICT_FALLBACK;
  try {
    const response = await fetch("/assets/district-registry.json", { cache: "no-store" });
    if (!response.ok) throw new Error("bundled district registry unavailable");
    const data = await response.json();
    window.BHURAKSHAK_DISTRICT_FALLBACK = data && data.states ? data.states : {};
  } catch (error) {
    console.warn("Bundled district registry unavailable:", error.message);
    window.BHURAKSHAK_DISTRICT_FALLBACK = {};
  }
  return window.BHURAKSHAK_DISTRICT_FALLBACK;
}

async function loadDistrictOptions(state) {
  const key = String(state || "").trim();
  if (!key) return [];
  if (window.BHURAKSHAK_LOCATION_CACHE.has(key)) return window.BHURAKSHAK_LOCATION_CACHE.get(key);
  try {
    const response = await fetch(`/api/locations/districts?state=${encodeURIComponent(key)}`, { cache: "no-store" });
    if (!response.ok) throw new Error("server district source unavailable");
    const data = await response.json();
    const districts = Array.isArray(data.districts) ? data.districts.map(v => String(v).trim()).filter(Boolean) : [];
    window.BHURAKSHAK_LOCATION_CACHE.set(key, districts);
    return districts;
  } catch (error) {
    console.warn("Server district dataset unavailable; using bundled registry:", error.message);
    const fallback = await loadBundledDistricts();
    const districts = Array.isArray(fallback[key]) ? fallback[key].map(v => String(v).trim()).filter(Boolean) : [];
    window.BHURAKSHAK_LOCATION_CACHE.set(key, districts);
    return districts;
  }
}

function fillStateSelect(select, placeholder = "Select State / UT", selected = "") {
  if (!select) return;
  const states = window.BHURAKSHAK_STATES || [];
  select.innerHTML = `<option value="">${placeholder}</option>` + states.map(state => `<option value="${escapeHTML(state)}">${escapeHTML(state)}</option>`).join("");
  if (selected) select.value = selected;
}

async function populateDistrictSelect(select, state, placeholder = "Select District", selected = "") {
  if (!select) return;
  select.disabled = true;
  select.innerHTML = `<option value="">Loading districts…</option>`;
  const districts = await loadDistrictOptions(state);
  select.innerHTML = `<option value="">${placeholder}</option>` + districts.map(d => `<option value="${escapeHTML(d)}">${escapeHTML(d)}</option>`).join("");
  select.disabled = !districts.length;
  if (selected && districts.includes(selected)) select.value = selected;
}
