async function search() {
  const username = document.getElementById("username").value.trim();
  const result = document.getElementById("result");

  if (!username) return;

  result.innerHTML = "Searching...";

  const res = await fetch("/api/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username })
  });

  const data = await res.json();

  if (data.error) {
    result.innerHTML = data.error;
    return;
  }

  const p = data.presence;
  const online = p.userPresenceType !== 0 ? "Yes" : "No";
  const ingame = p.userPresenceType === 2 ? "Yes" : "No";

  let itemsHTML = "";
  data.items.forEach(id => {
    itemsHTML += `<div>Item ID: ${id}</div>`;
  });

  let friendsHTML = "";
  if (data.friends && data.friends.length) {
    data.friends.slice(0, 10).forEach(friend => {
      friendsHTML += `<div>${friend.name}</div>`;
    });
  } else {
    friendsHTML = "<div>No friends visible</div>";
  }

  let nameHistoryHTML = "";
  if (data.usernameHistory && data.usernameHistory.length) {
    data.usernameHistory.forEach(name => {
      nameHistoryHTML += `<div>${name.name}</div>`;
    });
  } else {
    nameHistoryHTML = "<div>No previous usernames</div>";
  }

  result.innerHTML = `
    <img src="${data.avatar}" width="150">

    <h2>[#${data.userId}] ${data.displayName}</h2>
    <p>"${data.description || ""}"</p>

    <p>Joined on: ${new Date(data.joined).toDateString()}</p>
    <p>Online: ${online}</p>
    <p>In a game: ${ingame}</p>

    <h3>Estimated Account Value</h3>
    <p>${data.value.toLocaleString()} Robux</p>

    <h3>Avatar items</h3>
    ${itemsHTML}

    <h3>Friends</h3>
    ${friendsHTML}

    <h3>Username history</h3>
    ${nameHistoryHTML}

    <br><small>- made by joyful_pizzapartyl -</small>
  `;
}
