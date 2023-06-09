# Data Illustration Generator
![sdc-icon-grid-animation](https://user-images.githubusercontent.com/28394378/236026145-2c8a41a9-8c4f-4332-a8cd-ea59651a880c.gif)

This project has initially been created for a project for the Social Developers Club Conference 2023. However, it is set up in a generic way so it can be reused and further developed for various projects / purposes.

## Input
- Put a data.csv in the src folder
- The file must contain the column type (string) and count (integer) and should be comma seperated

## Output
Via the download button, you will get:
- The current image as SVG and PNG
- The current configuration as CSV (in order to be able to reprodue the result)
- The order of the icons as CSV (in order to be able to reprodue the result)

<img width="652" alt="data-illustration-generator-screenshot" src="https://user-images.githubusercontent.com/28394378/236028567-76c220d0-736f-4484-957f-72289e30dcc0.png">


## Setup
_The setup is based on the project template from Three.js Journey by Bruno Simon_

Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

``` bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:5173
npm run dev

# Build for production in the dist/ directory
npm run build
```
