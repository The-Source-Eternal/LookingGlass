THREE = require('three')

module.exports = FloatingCastle

/*

The floating castle holds all its subjects

*/

function FloatingCastle(args) {

  this._initialize(args)

}

FloatingCastle.type = 'FloatingCastle'

FloatingCastle.prototype._initialize = function(args) {

  this.scene = new THREE.Scene()

  this.connection = args.connection
  this.entities = {}
  this.entityClasses = {}

}

FloatingCastle.prototype.registerClass = function( EntityClass ) {

  this.entityClasses[ EntityClass.type ] = EntityClass

  this.connection.on( EntityClass.type+'.add', this._add.bind(this,EntityClass))
  this.connection.on( EntityClass.type+'.remove', this._remove.bind(this,EntityClass))

}

FloatingCastle.prototype.add = function( child ) {

  // store it so we dont recreate it
  this.entities[ child.id ] = child

  this._add( child.constructor, { id: child.id })
  this.connection.emit( child.type+'.add', child.toJSON() )

}

FloatingCastle.prototype.remove = function( child ) {

  this._remove( child.constructor, child.id )
  this.connection.emit( child.type+'.remove', child.id )

}

FloatingCastle.prototype._add = function( EntityClass, data ) {

  var existingEntity = this.entities[data.id]
  var newEntity

  // create if this entity doesn't already exist
  // it would exist if added locally
  if (existingEntity) {
    newEntity = existingEntity
  } else {
    newEntity = new EntityClass( data )
    this.entities[data.id] = newEntity
  }

  // add mesh to scene
  this.scene.add( newEntity.mesh )
  // 
  newEntity._connection

}

FloatingCastle.prototype._remove = function( EntityClass, data ) {

  var entity = this.entities[ id ]
  delete this.entities[ id ]
  this.scene.remove( entity.mesh )

}
