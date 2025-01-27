// variables
const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;
// functions
// Syntax of a function
const someName = (name) =>{
  console.log("Your name is " + name);
}
someName("Camilo")

const server = http.createServer((req, res) => {
  console.log(req.url);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'html');
  fs.readFile('./public/home.html', (error,content)=>{
    // We need to handle errors first

    // If there are no errors, we can output the content
    res.end(content);
  })

});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/ ...Press ctrl + c to close`);
});