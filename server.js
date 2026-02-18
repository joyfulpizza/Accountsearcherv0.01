import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());
app.use(express.static("public"));

async function rbxFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  return res.json();
}

app.post("/api/search", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: "No username" });

    // Username -> UserId
    const userData = await rbxFetch(
      "https://users.roblox.com/v1/usernames/users",
      {
        method: "POST",
        body: JSON.stringify({ usernames: [username] })
      }
    );

    const user = userData.data[0];
    if (!user) return res.status(404).json({ error: "User not found" });

    const userId = user.id;

    const profile = await rbxFetch(
      `https://users.roblox.com/v1/users/${userId}`
    );

    const avatar = await rbxFetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png`
    );

    const presence = await rbxFetch(
      "https://presence.roblox.com/v1/presence/users",
      {
        method: "POST",
        body: JSON.stringify({ userIds: [userId] })
      }
    );

    const avatarItems = await rbxFetch(
      `https://avatar.roblox.com/v1/users/${userId}/currently-wearing`
    );

    res.json({
      userId,
      displayName: profile.displayName,
      description: profile.description,
      joined: profile.created,
      avatar: avatar.data[0].imageUrl,
      presence: presence.userPresences[0],
      items: avatarItems.assetIds
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Roblox API error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log("Server running on port " + PORT)
);
