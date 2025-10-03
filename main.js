function showSection(id) {
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// روابط الكتب
const books = [
  { name: "📕 الاجتماعيات", url: "https://drive.google.com/file/d/16Q5BdiQ66spmioFBYwc2HcqABmxVzl7O/view" },
  { name: "📕 الرياضيات", url: "https://drive.google.com/file/d/1Fbg3oG9okburkz10e3jy1eW-LDmremsA/view" },
  { name: "📕 الاسلامية", url: "https://drive.google.com/file/d/1fgVXQf8t2czQrTBpWZ5IqFBzHRSH9Mtj/view" },
  { name: "📕 اللغة العربية (ج1)", url: "https://drive.google.com/file/d/1MTGDHwq2otPMsUDIs2OcngH5VNQb23KJ/view" },
  { name: "📕 اللغة العربية (ج2)", url: "https://drive.google.com/file/d/1cxk-MWLakARNXNTbL8eZjbL08JTkO8Ue/view" },
  { name: "📕 الحاسوب", url: "https://drive.google.com/file/d/1A6nGumwN0RXL9h4G0_5fQYtGQA6emr6h/view" },
  { name: "📕 اللغة الانكليزية", url: "https://drive.google.com/file/d/1HL3Wak7iGIH5VvnnJdRMIs2sz-059P63/view" },
  { name: "📕 نشاط الانكليزي", url: "https://drive.google.com/file/d/1FzNb-2dpgGxDX9k-MxZ68NBfs10lTCh3/view" },
  { name: "📕 الكيمياء", url: "https://drive.google.com/file/d/1556Wqvs4HXxLyJxHDwgF7znRbooVFAjl/view" },
  { name: "📕 الاحياء", url: "https://drive.google.com/file/d/1LYQfsvNQDJ5T2YI-eBiEbGYGs1XZrciQ/view" }
];

// روابط الملازم
const malazem = [
  { name: "📑 الفيزياء", url: "https://drive.google.com/file/d/1tNS70RdL3KcrgKNiVzUKRoCKc2qCYaVd/view" },
  { name: "📑 الكيمياء", url: "https://drive.google.com/file/d/1Q6E8XyumkomM7LzXNX04LuZ89irSmDRb/view" },
  { name: "📑 الاحياء", url: "https://drive.google.com/file/d/14SpJNuvK2p_skrnGZq-WXOA1qPBI_yBE/view" },
  { name: "📑 الاجتماعيات", url: "https://drive.google.com/file/d/1oIGD2RQ_NJVcX_Yhvy5UTBP4M_Mpj0jK/view" },
  { name: "📑 اللغة العربية (ج1)", url: "https://drive.google.com/file/d/1Cypj2pG5IsfEBCgF5S3kTFKq9J2LZuxn/view" },
  { name: "📑 اللغة العربية (ج2)", url: "https://drive.google.com/file/d/1Om0KngYuSIuGhAY6gtbcvWMO-a0WKdjF/view" },
  { name: "📑 الرياضيات", url: "https://drive.google.com/file/d/1v7JT7H3XXvoZ0WkZBnocXr7gLdR6Pa3T/view" },
  { name: "📑 الاسلامية", url: "https://drive.google.com/file/d/10l8n_L9X1BnBNMr-Tvo6b8T_rOAIfnji/view" },
  { name: "📑 الانكليزي", url: "https://drive.google.com/file/d/1X5x2pBJOHcmLiFFRF2DEsKFlqOzXpfba/view" }
];

// توليد القوائم
function loadLists() {
  const booksList = document.getElementById("books-list");
  books.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${item.url}" target="_blank">${item.name}</a>`;
    booksList.appendChild(li);
  });

  const malazemList = document.getElementById("malazem-list");
  malazem.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${item.url}" target="_blank">${item.name}</a>`;
    malazemList.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", loadLists);