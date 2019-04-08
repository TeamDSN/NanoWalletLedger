const carlo = require("carlo");
const path = require("path");

(async () => {
  const app = await carlo.launch({});
  app.mainWindow().maximize();

  // Used to check if browser is started with carlo
  await app.exposeFunction('carlo', () => true);

  app.on("exit", () => process.exit());
  app.serveFolder(path.join(__dirname, "build"));
  await app.load("start.html");
})();
