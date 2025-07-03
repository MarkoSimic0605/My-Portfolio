import inquirer from "inquirer";
import { exec } from "child_process";
import kill from "kill-port";

const choices = [
  { name: "Landing Page", value: "npm run dev:landing" },
  { name: "Dashboard CRUD", value: "npm run dev:dashboard" },
  { name: "Movie App (TMDB)", value: "npm run dev:movie" },
  { name: "E-commerce App", value: "npm run dev:ecommerce" },
];

inquirer
  .prompt([
    {
      type: "list",
      name: "command",
      message: "Choose your project!",
      choices,
    },
  ])
  .then(async (answers) => {
    // kill all 1234
    try {
      await kill(1234);
      console.log("🛑 Last server shutdown...");
    } catch (err) {
      console.log("⚠️ No active server found");
    }

    // start new server
    const subprocess = exec(answers.command);
    subprocess.stdout.pipe(process.stdout);
    subprocess.stderr.pipe(process.stderr);
  });
