var generateId = require('hat')

module.exports = function( universe ) {

  var __connection__ = universe.connection
  var __instances__ = universe.instances

  LookingGlassObject.type = 'LookingGlassObject'

  function LookingGlassObject( args, fromRemote ) {

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
    this._defineProperties({})

    // initialize a frame later, allowing the subClass to define properties
    setTimeout(this._initialize.bind(this, args, fromRemote))

  }

  //
  // Public
  //

  LookingGlassObject.prototype.get = function( key ) {
   
    var prop = this._state[ key ] 
    return prop.get()

  }

  LookingGlassObject.prototype.set = function( key, value ) {
   
    var prop = this._state[ key ]
    if (!prop) throw new Error('No such property: '+key)
    
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

  LookingGlassObject.prototype._initialize = function ( args, fromRemote ) {
    // set initial args
    Object.keys(args).map(function(key){
      this.set(key, args[key])
    }.bind(this))

    // listen for remote changes
    __connection__.on( this.id, this._set.bind(this) )

    // announce instantiation
    if (!fromRemote) __connection__.emitReliable( this.constructor.type, this.id, args )
  }

  LookingGlassObject.prototype._defineProperties = function( properties ) {

    // create the state
    this._state = this._state || {}

    // define each property
    Object.keys(properties).map(function(key){

      this._state[ key ] = new Prop( properties[ key ] )

    }.bind(this))    

  }

  LookingGlassObject.prototype._set = function( key, value ) {
    
    var prop = this._state[ key ]

    // deserialize value if string
    if (typeof value === 'string') {
      value = prop.deserialize( value )
    // otherwise just set it
    } else {
      prop.set( value )
    }


  }


  return LookingGlassObject

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