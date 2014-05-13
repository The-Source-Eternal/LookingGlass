THREE = require('three')

module.exports = function( universe ) {

  var LookingGlassObject = universe.classes.LookingGlassObject
  var __instances__ = universe.instances

  LGObject3D.prototype = Object.create( LookingGlassObject.prototype )
  LGObject3D.prototype.constructor = LGObject3D
  LGObject3D.type = 'LGObject3D'

  function LGObject3D( args, skipInitialization, fromRemote ) {

    LookingGlassObject.call( this, args, true, fromRemote )

    // define properties
    this._defineProperties({
      position:  { type: 'vector3',    default: [0,0,0],   reliable: false, },
      rotation:  { type: 'vector3',    default: [0,0,0],   reliable: false, },
      parent:    { type: 'string',     default: null,                       },
    })

    this.core = new THREE.Object3D()

    this.on('position', function( position ) {
      var vector = this.core.position
      vector.set.apply( vector, position )
    })

    this.on('rotation', function( rotation ) {
      this.core.setRotationFromEuler( new THREE.Euler( rotation[0], rotation[1], rotation[2] ) )
    })

    this.on('parent', function( parentId ) {
      
      // get parent reference
      var parentObj, parentCore
      parentObj = __instances__[ parentId ]
      if (parentObj) parentCore = parentObj.core
      
      // if parent found, set
      if (parentCore) {
      
        parentCore.add( this.core )
      
      // otherwise assume we meant to orphanize
      } else if ( this.core.parent !== undefined ) {

        this.core.parent.remove( this.core )

      }

    })

    // initialize after we're done defining properties, allowing the subClass to define properties
    if (!skipInitialization) this._initialize(args, fromRemote)

  }

  //
  // Public
  //

  

  //
  // Private
  //


  return LGObject3D

}