LookingGlass = require('./lib/LookingGlass.js')
var DiamondDragon = require('./lib/DiamondDragon.js')
var listenForPeers = require('./lib/network.js')

var isServer = (location.search === '?server')
start()

function start() {

  if (isServer) console.log( 'SERVER' )
  
  listenForPeers(function( peerConnection ) {
    console.log( 'connected.' )

    // if Server, route conncetions through a WatchTower or Portcullis or something nifty

    // enhance connection (lol)
    peerConnection.emitReliable = peerConnection.emit
    peerConnection.emitUnreliable = peerConnection.emit
    
    universe = new LookingGlass( peerConnection )
    universe.registerClass( DiamondDragon )

    window.x = function() {
      dragon = new universe.classes.DiamondDragon({id:'test'})
    }

  })


}
