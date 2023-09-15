const process = require('process');
const prompt = require('prompt-sync')();
const fs = require('fs');
const path = require('path');
const os = require('os');

// Function to remove dots (.) from directory names in 'Downloads' folder.
function removeDotsFromDirectoryName(downloadsFolderPath) {
  const directories = fs.readdirSync(downloadsFolderPath, {withFileTypes: true});

  directories.forEach((dir) => {
    if(dir.isDirectory() && dir.name.startsWith('.')) {
      const currentDirectory = path.join(downloadsFolderPath, dir.name);
      const newDirectory = path.join(downloadsFolderPath, dir.name.replace(/^\./, ''));

      fs.renameSync(currentDirectory, newDirectory);
      console.log(`Removed dot from directory name: '${dir.name}'`);
    }
  });
}


function organizeDownloads(downloadsFolderPath) {
  // Check if 'Downloads' folder exists
  if (!fs.existsSync(downloadsFolderPath)) {
    console.log("The 'Downloads' folder was not found.");
    return;
  }

  // Remove dots from directory names.
  removeDotsFromDirectoryName(downloadsFolderPath);


  const files = fs.readdirSync(downloadsFolderPath);

  // Create a dictionary to store file extensions and their corresponding directories.
  const extensionDirectories = {};

  // Iterate through the files in the 'Downloads' folder.
  files.forEach((file) => {
    const fileExtension = path.extname(file);
    const fileName = path.basename(file);

    // Skip directories and any files without extensions.
    if (!fileExtension || !fileExtension.length) {
      return;
    }

    // Clean up the file extension to remove leading dots.
    const cleanedFileExtension = fileExtension.replace(/^\./, '');

    // Create a directory for the file extension if it doesn't exist.
    if (!extensionDirectories[cleanedFileExtension]) {
      const extensionDirectory = path.join(downloadsFolderPath, cleanedFileExtension);

      // Check if the directory already exists before attempting to create it.
      if (!fs.existsSync(extensionDirectory)) {
        fs.mkdirSync(extensionDirectory);
        extensionDirectories[cleanedFileExtension] = extensionDirectory;
        console.log(`Created '${cleanedFileExtension}' directory.`);
      } else {
        // Directory already exists, update the dictionary.
        extensionDirectories[cleanedFileExtension] = extensionDirectory;
      }
    }

    // Move the file to the appropriate directory.
    const destinationPath = path.join(extensionDirectories[cleanedFileExtension], fileName);
    fs.renameSync(path.join(downloadsFolderPath, file), destinationPath);

    console.log(`Moved '${fileName}' to '${cleanedFileExtension}' folder`);
  });
}

function cleanUpFiles() {
  let foundDownloads = false;

  let response = prompt("Would you like your downloads folder cleaned? ");
  response = response.toLowerCase();

  if (response === 'yes') {
    // Check if 'Downloads' folder exists
    const downloadsFolderPath = path.join(os.homedir(), 'Downloads');

    if (fs.existsSync(downloadsFolderPath)) {
      console.log('Found the Downloads folder in', downloadsFolderPath);
      
      organizeDownloads(downloadsFolderPath);
    } else {
      console.log("The Downloads folder was not found.");
    }
  } else if (response === 'no') {
    process.exit();
  } else {
    console.log('Invalid response. Please type either yes or no next time.');
    process.exit();
  }
}
console.log('---------------------------------------------------------------');
console.log('Created by Giovanni Ramos\n');
console.log("List of supported Operating Systems:\n- Windows \n- Mac \n");
let response = prompt("What Operating System are you on? ");
response = response.toLowerCase();

if (response === 'windows') {
  cleanUpFiles();
} else if (response === 'mac') {
  cleanUpFiles();
} else {
    console.log("Input one of the two options listed above. Run the program again.")
}
