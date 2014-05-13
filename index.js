var listenForPeers = require('./lib/network.js')

var LookingGlass = require('./lib/LookingGlass.js')
var LookingGlassObject = require('./lib/LookingGlassObject.js')

var LGMaterial = require('./example/LGMaterial.js')
var LGMeshBasicMaterial = require('./example/LGMeshBasicMaterial.js')

var LGGeometry = require('./example/LGGeometry.js')
var LGBoxGeometry = require('./example/LGBoxGeometry.js')

var LGObject3D = require('./example/LGObject3D.js')
var LGMesh = require('./example/LGMesh.js')


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
    // note - you must manually register the whole class hierarchy
    universe.registerClass( LookingGlassObject )
    
    // Material
    universe.registerClass( LGMaterial )
    universe.registerClass( LGMeshBasicMaterial )
    // Geometry
    universe.registerClass( LGGeometry )
    universe.registerClass( LGBoxGeometry )
    // Object3D
    universe.registerClass( LGObject3D )
    universe.registerClass( LGMesh )

    // create some test stuff just on the server
    if (isServer) {

      var parentMaterial = new universe.classes.LGMeshBasicMaterial({ color: 0xff0000, })
      var childMaterial = new universe.classes.LGMeshBasicMaterial({ color: 0x00ff00, })

      var parentGeometry = new universe.classes.LGBoxGeometry({ size: 50, })
      var childGeometry = new universe.classes.LGBoxGeometry({ size: 25, })

      var parent = new universe.classes.LGMesh({ id: 'parent', geometry: parentGeometry.id, material: parentMaterial.id })
      var child = new universe.classes.LGMesh({ id: 'child', parent: parent.id, geometry: childGeometry.id, material: childMaterial.id })

    }

  })


}
