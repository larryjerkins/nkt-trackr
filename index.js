#!/usr/bin/env node

var argv = require('optimist')
    .usage('Usage: node bitty-tracker --start --h youdomain.com')
    .demand(['start','h'])
    .argv;
 
var Server = require('bittorrent-tracker').Server
 
var server = new Server({
  udp: false, // enable udp server? [default=true]
  http: false, // enable http server? [default=true]
  ws: true, // enable websocket server? [default=true]
  stats: false, // enable web-based statistics? [default=true]
  filter: function (infoHash, params, cb) {
    // Blacklist/whitelist function for allowing/disallowing torrents. If this option is
    // omitted, all torrents are allowed. It is possible to interface with a database or
    // external system before deciding to allow/deny, because this function is async.

    // It is possible to block by peer id (whitelisting torrent clients) or by secret
    // key (private trackers). Full access to the original HTTP/UDP request parameters
    // are available in `params`.

    // This example only allows one torrent.

    //var allowed = (infoHash === 'aaa67059ed6bd08362da625b3ae77f6f4a075aaa')
    // cb(allowed)
 
    // In addition to returning a boolean (`true` for allowed, `false` for disallowed),
    // you can return an `Error` object to disallow and provide a custom reason.
      cb(true);
  }
})

// Internal http, udp, and websocket servers exposed as public properties.
server.http
server.udp
server.ws

server.on('error', function (err) {
  // fatal server error!
  console.log(err.message)
})

server.on('warning', function (err) {
  // client sent bad data. probably not a problem, just a buggy client.
  console.log(err.message)
})

server.on('listening', function () {
  // fired when all requested servers are listening
  console.log('Listening on http port:' + server.http.address().port)
  console.log('Listening on udp port:' + server.udp.address().port)
})

// start tracker server listening! Use 0 to listen on a random free port.
server.listen(10000)
//server.listen(0, argv.h)

// listen for individual tracker messages from peers:

server.on('start', function (addr) {
  console.log('got start peer from ' + addr)
})

server.on('complete', function (addr) {})
server.on('update', function (addr) {})
server.on('stop', function (addr) {})

// get info hashes for all torrents in the tracker server
Object.keys(server.torrents) 
