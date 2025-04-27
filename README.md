# HashCommand

This is an Electron application for controlling Bitcoin miners on your local network, mainly Bitaxes and esp-miner devices. 

## Setup
Clone the repository

To pull the shared ui package you must login to Github npm registry. 

You must create a Personal Access Token though your GitHub account settings:
1. Click on your user icon in the upper right on github.com
2. Go to Settings
3. Go to `<> Developer Settings` -> Personal Access Tokens -> Tokens (classic)
4. In the upper right, click Generate New Token (classic)
5. check the box for write:packages
6. click generate token
7. copy the token

`npm login --scope=@bitaxeorg --registry=https://npm.pkg.github.com`

- login with your github username
- password is the token

Install dependencies 
`npm i`

Build the Angular UI application
`npm run build`

Run the application 
`npm run start`

or

Package for distribution
`npm run package`
