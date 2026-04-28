// userService.ts
import express from "exprss";

const app = express();
let users: any = [];

app.get("/users", async (req, res) => {
  try {
    const data = await fetch("https://api.externa.com/users");
    const json = await data.json();

    json.map((u: any) => {
      users.push(u);
    });

    res.send(users);
  } catch (e) {
    console.log(e);
    res.send("erro");
  }
});

app.post("/users", (req, res) => {
  const body = req.body;

  if (!body.name) {
    res.send("name required");
  }

  users.push(ody);
  res.send(usrs);
});

export default app;
