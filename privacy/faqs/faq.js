// ===== WAIT FOR PAGE LOAD (VERY IMPORTANT) =====
document.addEventListener("DOMContentLoaded", () => {

  // ===== INITIAL FIX (ONLY GENERAL SHOW) =====
  document.querySelectorAll(".faq-content").forEach(content => {
    content.style.display = "none";
  });

  document.getElementById("general").style.display = "block";


  // ===== TAB SWITCH =====
  document.querySelectorAll(".tab").forEach(tab => {
    tab.onclick = () => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      document.querySelectorAll(".faq-content").forEach(c => c.style.display = "none");
      document.getElementById(tab.dataset.category).style.display = "block";
    };
  });


  // ===== ACCORDION (AUTO CLOSE) =====
  document.querySelectorAll(".faq-question").forEach(q => {
    q.onclick = () => {

      let currentItem = q.parentElement;

      document.querySelectorAll(".faq-item").forEach(item => {
        if (item !== currentItem) {
          item.classList.remove("active");
        }
      });

      currentItem.classList.toggle("active");
    };
  });

});