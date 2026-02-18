async function searchPlayer() {
  const username = document.getElementById("username").value;
  const result = document.getElementById("result");

  result.innerHTML = "Searching...";

  const res = await fetch("/search", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({username})
  });

  const data = await res.json();

  if (data.error) {
    result.innerHTML = data.error;
    return;
  }

  let itemsHTML = "";
  data.items.forEach(id => itemsHTML += `<div>Item ID: ${id}</div>`);

  let online = "No";
  let ingame = "No";

  if (data.presence.userPresenceType === 1) online = "Yes";
  if (data.presence.userPresenceType === 2) {
    online = "Yes";
    ingame = "Yes";
  }

  result.innerHTML = `
    <img src="${data.avatar}" width="150">

    <h2>[#${data.userId}] ${data.displayName}</h2>
    <p>"${data.description || ""}"</p>

    <p>Joined on: ${new Date(data.created).toDateString()}</p>
    <p>Online: ${online}</p>
    <p>In a game: ${ingame}</p>

    <h3>Avatar items:</h3>
    ${itemsHTML}

    <br>
    <small>- made by joyful_pizzapartyl -</small>
  `;
}
