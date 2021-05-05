# Cloud Phony
## _Nodejs app to make call using Plivo voip_

This application consist of two parts, client and server.

## Installation

Application requires [Node.js](https://nodejs.org/) v14.15.1 to run.

Install the dependencies and devDependencies and start the server.

### Client:

```sh
cd client
npm i
npm start
```
 URL: http://localhost:3000/
  The applciation can be accessed by using the above URL.

### Server:

```sh
cd server
npm i
```
##### To update the database config in server
- Goto server folder(cmd: cd sever)
- edit the app.js(cmd: vi app.js)
- please update the database config(Line: 16 in app.js),
    > const dbClient = new Client({
    > user: {username},
    >  host: {host},
    >  database: {databaseName},
    >  password: {password},
    >  port: {port},
    > });


###### Start the server by runing the cmd(node app.js).

### Database:
- Login into postgresql in terminal.
- Create a database
  > CREATE DATABASE cloudPhone;
- Create a table by runing query below,
  > CREATE TABLE call_details (
  >	id serial PRIMARY KEY,
  >	name VARCHAR ( 255 ) NOT NULL,
  >	from_number VARCHAR ( 13 ) NOT NULL,
  >	to_number VARCHAR ( 13 ) NOT NULL,
  > time_minutes INT NOT NULL,
  >	created_on TIMESTAMP default current_timestamp
  > );

### Ngrok:
To host the server application in local machine, we need to use tunneling script like ngrok.

##### Install ngrok:
Download: https://ngrok.com/download
###### Steps:
  - Goto the downloaded folder.
  - Run the cmd(./ngrok http 4000 -host-header="localhost:4000")
  - Once the server is started, copy the http url(Eg:http://5a7edf575e07.ngrok.io) and update the config in the plivo account.

### Configure Plivo account:
###### Credentials:
  usrname: chiranjeevi.ramesh@cohere-med.com
  pwd: Venkatesh@22
  
###### Steps:
  - GOTO this url(https://console.plivo.com/login/) and login.
  - To update the EndPoint URL, goto this url(https://console.plivo.com/voice/endpoints/) and edit the existing endpoint.Then update the 'Alias Name'(Eg:http://5a7edf575e07.ngrok.io) and save.
  - To change the xml application config, goto this url(https://console.plivo.com/voice/applications/edit/99050408707887692/).Then update the 'Primary Answer URL' same as endpoint url(Eg: http://5a7edf575e07.ngrok.io) and save.

#### Instructions To make a call:
- Goto the url(http://localhost:3000/).
- Fill the form and click on the call button.
Note:-
    - The application will request for microphone access.
    - Please make sure microphone and system volume is not on mute.
 
