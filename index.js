import axios from 'axios'
import fs from 'fs'
import { execSync } from 'child_process';
import grayMatter from 'gray-matter'

async function run() {
  const GITHUB_REPOSITORY =
    "https://github.com/skarthikean96/solid-octo-broccoli";

  const commitHash = execSync("git rev-parse HEAD").toString().trim();

  try {
    // axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.ENV_GITHUB_TOKEN}`;

    const commitResponse = await axios.get(`https://api.github.com/repos/skarthikeyan96/solid-octo-broccoli/commits/${commitHash}`);
    
    // console.log(`https://api.github.com/repos/${repoOwner}/${repoName}/commits/${commitHash}`)
    // console.log(commitResponse)
    if (commitResponse.status === 200) {
      console.log("gping in")
      const data = commitResponse.data;

      // Filter and fetch the content of Markdown files
      const markdownFiles = data.files.filter(file => file.filename.endsWith('.md') || file.filename.endsWith('.mdx'));

      for (const file of markdownFiles) {
        const filePath = file.filename;
    //    core.info('Output to the actions build log', filepath)

        const fileContentResponse = await axios.get(
          `https://raw.githubusercontent.com/skarthikeyan96/solid-octo-broccoli/${commitHash}/${filePath}`
        );

        // core.info('Output to the actions build log', fileContentResponse)


        if (fileContentResponse.status === 200) {
          const fileContent = fileContentResponse.data;
          //   await fs.writeFile(filePath, fileContent, 'utf-8');
          parseMdxFileContent(fileContent)
          // console.log(`Content of ${filePath}:\n${fileContent}`);
        } else {
          console.error(`Failed to fetch content of ${filePath}:`, fileContentResponse.statusText);
        }
      }
    } else {
      console.error('Failed to fetch commit details:', commitResponse.statusText);
    }

    //   console.log(res)
  } catch (error) {
    // console.log("asda")
    // console.error('Error:', error);
  }
 
}


const parseMdxFileContent = (fileContent) => {
 const data =  grayMatter(fileContent);
 console.log(data)
}

run()