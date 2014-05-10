var generateId = require('hat')

module.exports = function( universe ) {

  var __connection__ = universe.connection
  var __instances__ = universe.instances

  function DiamondDragon( args, fromRemote ) {

    args = args || {}

    // set id
    if ( args.id ) {
      this.id = args.id
      delete args.id      
    } else {
      this.id = generateId()
    }
    __instances__[ this.id ] = this

    // define properties
    this._defineProperties({
      position: { type: 'vector3',    default: [0,0,0],   reliable: false, },
      rotation: { type: 'quaternion', default: [0,0,0,0], reliable: false, },
      material: { type: 'material',   default: null,                       },
      mesh:     { type: 'mesh',       default: null,                       },
    })

    // set initial args
    Object.keys(args).map(function(key){
      this.set(key, args[key])
    }.bind(this))

    // listen for remote changes
    __connection__.on( this.id, this._set.bind(this) )

    // announce instantiation
    if (!fromRemote) __connection__.emitReliable( 'DiamondDragon', this.id, args )

  }

  DiamondDragon.type = 'DiamondDragon'

  //
  // Public
  //

  DiamondDragon.prototype.get = function( key ) {
   
    var prop = this._state[ key ] 
    return prop.get()

  }

  DiamondDragon.prototype.set = function( key, value ) {
   
    var prop = this._state[ key ]
    
    // set locally
    this._set( key, value )

    // set remotely
    if ( prop.reliable ) {
      __connection__.emitReliable( this.id, key, prop.serialize() )
    } else {
      __connection__.emitUnreliable( this.id, key, prop.serialize() )
    }

  }

  //
  // Private
  //

  DiamondDragon.prototype._defineProperties = function( properties ) {

    // create the state
    this._state = {}

    // define each property
    Object.keys(properties).map(function(key){

      this._state[ key ] = new Prop( properties[ key ] )

    }.bind(this))    

  }

  DiamondDragon.prototype._set = function( key, value ) {
    
    var prop = this._state[ key ]

    // deserialize value if string
    if (typeof value === 'string') {
      value = prop.deserialize( value )
    // otherwise just set it
    } else {
      prop.set( value )
    }


  }


  return DiamondDragon

}


///////////////////////////////////////////////////////////////////////

function Prop( args ) {

  this.type = args.type
  this.value = args.default 
  this.reliable = (undefined === args.reliable) ? true : args.reliable

}

Prop.prototype.set = function( value ) {

  this.value = value

}

Prop.prototype.get = function() {

  return this.value

}

Prop.prototype.serialize = function() {

  switch( this.type ) {
    
    default:
      return JSON.stringify( this.value )

  }
  
}

Prop.prototype.deserialize = function( data ) {

  switch( this.type ) {
    
    default:
      this.value = JSON.parse( data )

  }
  
}