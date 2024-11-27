var siteName = document.getElementById("bookmarkName");
var siteURL = document.getElementById("bookmarkURL");
var submitBtn = document.getElementById("submitBtn");
var tableContent = document.getElementById("tableContent");
var searchBookMark = document.getElementById("searchBookMark");
var closeBtn = document.getElementById("closeBtn");
var boxModal = document.querySelector(".box-info");

var bookmarks = [];

// =====> تحميل العلامات المرجعية من LocalStorage
if (localStorage.getItem("bookmarksList")) {
  bookmarks = JSON.parse(localStorage.getItem("bookmarksList"));
  bookmarks.forEach((_, index) => displayBookmark(index));
}

// =====> وظيفة عرض العلامة المرجعية
function displayBookmark(index) {
  var bookmark = bookmarks[index];
  var httpsRegex = /^https?:\/\//g;

  var validURL = httpsRegex.test(bookmark.siteURL) ? bookmark.siteURL : `https://${bookmark.siteURL}`;
  var fixedURL = bookmark.siteURL.replace(httpsRegex, "");

  var newBookmark = `
    <tr>
      <td>${index + 1}</td>
      <td>${bookmark.siteName}</td>
      <td>
        <button class="btn btn-visit" data-index="${index}">
          <i class="fa-solid fa-eye pe-3"></i>Visit
        </button>
      </td>
      <td>
        <button class="btn btn-delete" data-index="${index}">
          <i class="fa-solid fa-trash-can pe-3"></i>Delete
        </button>
      </td>
      <td>
        <button class="btn btn-info" data-index="${index}">
          <i class="fa-solid fa-refresh pe-3"></i>Update
        </button>
      </td>
    </tr>
  `;
  tableContent.innerHTML += newBookmark;
}

// =====> وظيفة البحث
searchBookMark.addEventListener("keyup", function () {
  var searchData = searchBookMark.value.toLowerCase();
  tableContent.innerHTML = "";
  bookmarks.forEach((bookmark, index) => {
    if (bookmark.siteName.toLowerCase().includes(searchData)) {
      displayBookmark(index);
    }
  });
});

// =====> وظيفة التحديث
function updateBookmark(index) {
  var bookmark = bookmarks[index];
  var newName = prompt("Enter the new site name:", bookmark.siteName);
  var newURL = prompt("Enter the new site URL:", bookmark.siteURL);

  if (newName && newURL) {
    bookmarks[index] = {
      siteName: capitalize(newName),
      siteURL: newURL,
    };
    localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));
    tableContent.innerHTML = "";
    bookmarks.forEach((_, index) => displayBookmark(index));
  } else {
    alert("Both site name and URL are required!");
  }
}

// =====> وظيفة الحذف
function deleteBookmark(index) {
  bookmarks.splice(index, 1);
  localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));
  tableContent.innerHTML = "";
  bookmarks.forEach((_, index) => displayBookmark(index));
}

// =====> وظيفة زيارة الموقع
function visitWebsite(index) {
  var bookmark = bookmarks[index];
  var httpsRegex = /^https?:\/\//;
  var validURL = httpsRegex.test(bookmark.siteURL) ? bookmark.siteURL : `https://${bookmark.siteURL}`;
  window.open(validURL, "_blank");
}

// =====> تفويض الأحداث
tableContent.addEventListener("click", function (e) {
  var target = e.target.closest("button");
  if (!target) return;

  var index = target.dataset.index;
  if (target.classList.contains("btn-delete")) {
    deleteBookmark(index);
  } else if (target.classList.contains("btn-visit")) {
    visitWebsite(index);
  } else if (target.classList.contains("btn-info")) {
    updateBookmark(index);
  }
});

// =====> تنظيف الحقول
function clearInput() {
  siteName.value = "";
  siteURL.value = "";
}

// =====> جعل أول حرف من النص كبيرًا
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// =====> التحقق من الإدخال
function validate(element, regex) {
  if (regex.test(element.value)) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
  } else {
    element.classList.add("is-invalid");
    element.classList.remove("is-valid");
  }
}

// =====> التحقق من صحة الإدخال
var nameRegex = /^\w{3,}(\s+\w+)*$/;
var urlRegex = /^(https?:\/\/)?(w{3}\.)?\w+\.\w{2,}(:\d{2,5})?(\/\w+)*$/;

siteName.addEventListener("input", function () {
  validate(siteName, nameRegex);
});

siteURL.addEventListener("input", function () {
  validate(siteURL, urlRegex);
});

// =====> إضافة علامة مرجعية جديدة
submitBtn.addEventListener("click", function () {
  if (
    siteName.classList.contains("is-valid") &&
    siteURL.classList.contains("is-valid")
  ) {
    var bookmark = {
      siteName: capitalize(siteName.value),
      siteURL: siteURL.value,
    };
    bookmarks.push(bookmark);
    localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));
    displayBookmark(bookmarks.length - 1);
    clearInput();
    siteName.classList.remove("is-valid");
    siteURL.classList.remove("is-valid");
  } else {
    boxModal.classList.remove("d-none");
  }
});


// =====> إغلاق المودال

function closeModal() {
  boxModal.classList.add("d-none");
}

// 3 ways to close modal => close button -  Esc key - clicking outside modal

closeBtn.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key == "Escape") {
    closeModal();
  }
});

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("box-info")) {
    closeModal();
  }
});
