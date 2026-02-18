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

  let items = "";
  data.items.forEach(id => items += `<div>Item ID: ${id}</div>`);

  result.innerHTML = `
    <img src="${data.avatar}">
    <h2>[#${data.userId}] ${data.displayName}</h2>
    <p>"${data.description || ""}"</p>
    <p>Joined on: ${new Date(data.joined).toDateString()}</p>
    <p>Online: ${online}</p>
    <p>In a game: ${ingame}</p>
    <h3>Avatar items:</h3>
    ${items}
    <br><small>- made by joyful_pizzapartyl -</small>
  `;
}
