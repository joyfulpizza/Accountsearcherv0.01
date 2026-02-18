async function searchPlayer() {
  const username = document.getElementById("username").value.trim();
  const result = document.getElementById("result");

  if (!username) return;

  result.innerHTML = "Searching...";

  try {
    // Convert username → userId
    const userRes = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernames: [username] })
    });

    const userData = await userRes.json();
    const user = userData.data[0];

    if (!user) {
      result.innerHTML = "User not found.";
      return;
    }

    const userId = user.id;

    // Get profile info
    const profileRes = await fetch(`https://users.roblox.com/v1/users/${userId}`);
    const profile = await profileRes.json();

    // Avatar image
    const thumbRes = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png`
    );
    const thumbData = await thumbRes.json();
    const avatarUrl = thumbData.data[0].imageUrl;

    // Presence
    const presenceRes = await fetch("https://presence.roblox.com/v1/presence/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userIds: [userId] })
    });
    const presenceData = await presenceRes.json();
    const presence = presenceData.userPresences[0];

    // Avatar items (currently wearing)
    const avatarItemsRes = await fetch(
      `https://avatar.roblox.com/v1/users/${userId}/currently-wearing`
    );
    const avatarItems = await avatarItemsRes.json();

    let itemsHTML = "";
    avatarItems.assetIds.forEach(id => {
      itemsHTML += `<div>Item ID: ${id}</div>`;
    });

    // Presence translation
    let online = "No";
    let ingame = "No";

    if (presence.userPresenceType === 1) online = "Yes";
    if (presence.userPresenceType === 2) {
      online = "Yes";
      ingame = "Yes";
    }

    result.innerHTML = `
      <img src="${avatarUrl}" width="150">

      <h2>[#${userId}] ${profile.displayName}</h2>
      <p>"${profile.description || ""}"</p>

      <p>Joined on: ${new Date(profile.created).toDateString()}</p>
      <p>Online: ${online}</p>
      <p>In a game: ${ingame}</p>

      <h3>Avatar items currently wearing:</h3>
      ${itemsHTML}

      <br>
      <small>- made by joyful_pizzapartyl -</small>
    `;

  } catch (err) {
    result.innerHTML = "Error retrieving player data.";
    console.error(err);
  }
}
