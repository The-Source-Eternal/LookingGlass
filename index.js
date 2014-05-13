var LookingGlass = require('./lib/LookingGlass.js')
var LookingGlassObject = require('./lib/LookingGlassObject.js')
var LGObject3D = require('./lib/LGObject3D.js')
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
    universe.registerClass( LookingGlassObject )
    universe.registerClass( LGObject3D )

    if (isServer) {
      var parent = new universe.classes.LGObject3D({id:'parent'})
      var child = new universe.classes.LGObject3D({id:'child'})

      setTimeout(function(){

        child.set('parent', parent.id)

      })
    }

  })


}
