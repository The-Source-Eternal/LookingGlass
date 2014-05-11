module.exports = function( universe ) {

  var LookingGlassObject = universe.classes.LookingGlassObject

  LGObject3D.prototype = Object.create( LookingGlassObject.prototype )
  LGObject3D.prototype.constructor = LGObject3D
  LGObject3D.type = 'LGObject3D'

  function LGObject3D( args, fromRemote ) {

    LookingGlassObject.call( this, args, fromRemote )

    // define properties
    this._defineProperties({
      position: { type: 'vector3',    default: [0,0,0],   reliable: false, },
      rotation: { type: 'quaternion', default: [0,0,0,0], reliable: false, },
      parent:   { type: 'int',        default: null,                       },
      children: { type: 'array',      default: [],                         },
    })

  }

  //
  // Public
  //

  

  //
  // Private
  //


  return LGObject3D

}