import axios from 'axios'
import fs from 'fs'
import { execSync } from 'child_process';
import { Octokit } from "@octokit/core";

const octokit = new Octokit({ auth: process.env.ENV_GITHUB_TOKEN });


async function run() {
  const GITHUB_REPOSITORY =
    "https://github.com/skarthikean96/solid-octo-broccoli";

  const commitHash = execSync("git rev-parse HEAD").toString().trim();

  const repoOwner = GITHUB_REPOSITORY.split("/")[0];
  const repoName = GITHUB_REPOSITORY.split("/")[1];

  console.log(`https://api.github.com/repos/skarthikeyan96/solid-octo-broccoli/commits/${commitHash}`)
  try {
    const commitResponse = await axios.get(`https://api.github.com/repos/skarthikeyan96/solid-octo-broccoli/commits/${commitHash}`);
    
    // console.log(`https://api.github.com/repos/${repoOwner}/${repoName}/commits/${commitHash}`)
    // console.log(commitResponse)
    if (commitResponse.status === 200) {
      const data = commitResponse.data;

      // Filter and fetch the content of Markdown files
      const markdownFiles = data.files.filter(file => file.filename.endsWith('.md') || file.filename.endsWith('.mdx'));

      for (const file of markdownFiles) {
        const filePath = file.filename;
        console.log("filePath", filePath)
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

    // const res = await octokit.request('GET /repos/{owner}/{repo}/commits/{commitHash}', {
    //     owner: 'skarthikeyan96',
    //     repo: 'solid-octo-broccoli',
    //     ref: commitHash,
    //     headers: {
    //       'X-GitHub-Api-Version': '2022-11-28'
    //     }
    //   })

    //   console.log(res)
  } catch (error) {
    console.error('Error:', error.message);
  }
 
}

run()