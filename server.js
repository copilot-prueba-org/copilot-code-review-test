const http = require('http')
const fs = require('fs')
const url = require('url')
const { exec } = require('child_process')

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true)
  const path = parsedUrl.pathname
  const name = parsedUrl.query.name

  // Security issue: unsanitized user input in exec
  if (path === '/ping') {
    exec(`ping -c 1 ${name}`, (err, stdout, stderr) => {
      if (err) {
        res.writeHead(500)
        return res.end('Error')
      }
      res.writeHead(200)
      res.end(stdout)
    })
  } else if (path === '/read') {
    // Poor practice: synchronous file read
    const data = fs.readFileSync('./data.txt', 'utf8')
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end(data)
  } else if (path == '/date') {
    // Bad practice: console log in production
    console.log("Returning the date")
    res.writeHead(200)
    res.end(new Date().toString())
  } else {
    res.writeHead(404)
    res.end('Not found')
  }
})

server.listen(8080)
console.log("Server running on port 8080")
// Test comment for Copilot Code Review
