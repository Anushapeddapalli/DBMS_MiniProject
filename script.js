// Check if user is logged in
const user = localStorage.getItem("user");
if (!user) {
  window.location.href = "login.html";
}

// Logout function
function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

// Search food function (LIVE + RELEVANT)
function searchFood() {
  const food = document.getElementById("foodInput").value.trim().toLowerCase();
  const location = document.getElementById("locationInput").value.trim().toLowerCase();
  const list = document.getElementById("restaurantList");

  if (!food && !location) {
    list.innerHTML = "";
    return;
  }

  list.innerHTML = "Searching...";

  fetch(`/search-food?q=${encodeURIComponent(food)}`)
    .then(res => res.json())
    .then(data => {
      let results = data;

      if (location) {
        results = results.filter(item =>
          item.location.toLowerCase().includes(location)
        );
      }

      list.innerHTML = "";

      if (results.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No matching food or place found 😔";
        list.appendChild(li);
        return;
      }

      results.forEach(item => {
        const li = document.createElement("li");

        const text = document.createElement("span");
        text.textContent = `${item.food_name} - ₹${item.price} | ${item.restaurant_name} (${item.location})`;

        const btn = document.createElement("button");
        btn.textContent = "View Menu";
        btn.onclick = function () {
          window.location.href = "menu.html?rid=" + item.restaurant_id;
        };

        li.appendChild(text);
        li.appendChild(btn);
        list.appendChild(li);
      });
    })
    .catch(err => {
      console.error("Search error:", err);
      list.innerHTML = "";
      alert("Error searching food. Check console.");
    });
}