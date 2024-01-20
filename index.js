import axios from 'axios'
import fs from 'fs'
import { ChildProcess } from 'child_process';

async function run() {
  const GITHUB_REPOSITORY =
    "https://github.com/skarthikean96/solid-octo-broccoli";

  const commitHash = ChildProcess.execSync("git rev-parse HEAD").toString().trim();

  const repoOwner = GITHUB_REPOSITORY.split("/")[0];
  const repoName = GITHUB_REPOSITORY.split("/")[1];

  try {
    const commitResponse = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/commits/${commitHash}`);
    
    if (commitResponse.status === 200) {
      const data = commitResponse.data;

      // Filter and fetch the content of Markdown files
      const markdownFiles = data.files.filter(file => file.filename.endsWith('.md') || file.filename.endsWith('.mdx'));

      for (const file of markdownFiles) {
        const filePath = file.filename;
        const fileContentResponse = await axios.get(
          `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${commitHash}/${filePath}`
        );

        if (fileContentResponse.status === 200) {
          const fileContent = fileContentResponse.data;
          // Do something with the file content (e.g., save it to a file, process it, etc.)
          await fs.writeFile(filePath, fileContent, 'utf-8');
          console.log(`Content of ${filePath}:\n${fileContent}`);
        } else {
          console.error(`Failed to fetch content of ${filePath}:`, fileContentResponse.statusText);
        }
      }
    } else {
      console.error('Failed to fetch commit details:', commitResponse.statusText);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
 
}

run()