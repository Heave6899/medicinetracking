# Medicine Tracking System
You can create a medicine tracking system using this guide.

### Prerequisites
These dependencies should be installed in order to run this project on your pc.

- npm
- truffle
- ganache
- metamask

You can also run the project without installing these dependencies via this:
```sh
connect metamask to browser
start the lite server
npm run dev
```
### 1.Clone the project
Clone the project and install all the dependencies.
```sh
$ git clone https://github.com/Heave6899/medicinetracking
```
### 2.Open ganache 
![image](https://1.bp.blogspot.com/-hqMhtEh0AH0/XEIUQH7YT6I/AAAAAAAAb5g/7MkrdQigbaIq7-cXhFsscl8zxu1QfQqJgCK4BGAYYCw/s1600/Screenshot%2Bfrom%2B2019-01-18%2B23-28-07.png)

Open the ganache workspace. A local blockchain workspace will be initiated. 
### 3.Contracts
Compile and deploy the contracts.
```sh
$ truffle migrate ---reset
```
### 4. Setup Metamask
Open metamask and connect it to local ethereum. 
Import an account using the keys provided by ganache.
![](metamask.png)
The key-shaped option should be clicked to get the private key, which has to be imported.
![](key.png)

### Final step
To run the project on your browser with proper frontend.
```sh 
$ npm run dev
```
