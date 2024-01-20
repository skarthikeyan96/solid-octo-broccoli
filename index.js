const fetch = require('node-fetch');
const fs = require('fs');


async function run() {
  const GITHUB_REPOSITORY =
    "https://github.com/skarthikean96/solid-octo-broccoli";

  const commitHash = require("child_process")
    .execSync("git rev-parse HEAD")
    .toString()
    .trim();

  const repoOwner = GITHUB_REPOSITORY.split("/")[0];
  const repoName = GITHUB_REPOSITORY.split("/")[1];

  const response = await fetch(
    `https://api.github.com/repos/${repoOwner}/${repoName}/commits/${commitHash}`
  );

  if (response.ok) {
    const data = await response.json();

    // Filter and fetch the content of Markdown files
    const markdownFiles = data.files.filter(
      (file) => file.filename.endsWith(".md") || file.filename.endsWith(".mdx")
    );

    markdownFiles.forEach(async (file) => {
      const filePath = file.filename;
      const fileContentResponse = await fetch(
        `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${commitHash}/${filePath}`
      );

      if (fileContentResponse.ok) {
        const fileContent = await fileContentResponse.text();
        // Do something with the file content (e.g., save it to a file, process it, etc.)
        //   fs.writeFileSync(filePath, fileContent);
        console.log(`Content of ${filePath}:\n${fileContent}`);
      } else {
        console.error(
          `Failed to fetch content of ${filePath}:`,
          fileContentResponse.statusText
        );
      }
    });
  } else {
    console.error("Failed to fetch commit details:", response.statusText);
  }
}

run()