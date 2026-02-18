const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/search", async (req, res) => {
  const username = req.body.username;

  try {
    // username → userId
    const userRes = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({usernames: [username]})
    });

    const userData = await userRes.json();
    const user = userData.data[0];

    if (!user) return res.json({error: "User not found"});

    const userId = user.id;

    // profile
    const profileRes = await fetch(`https://users.roblox.com/v1/users/${userId}`);
    const profile = await profileRes.json();

    // avatar
    const thumbRes = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png`
    );
    const thumbData = await thumbRes.json();

    // presence
    const presenceRes = await fetch("https://presence.roblox.com/v1/presence/users", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({userIds: [userId]})
    });
    const presenceData = await presenceRes.json();

    // wearing items
    const avatarItemsRes = await fetch(
      `https://avatar.roblox.com/v1/users/${userId}/currently-wearing`
    );
    const avatarItems = await avatarItemsRes.json();

    res.json({
      userId,
      displayName: profile.displayName,
      description: profile.description,
      created: profile.created,
      avatar: thumbData.data[0].imageUrl,
      presence: presenceData.userPresences[0],
      items: avatarItems.assetIds
    });

  } catch (err) {
    res.json({error: "Server failed"});
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
