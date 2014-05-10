THREE = require('three')
var generateUuid = require('hat')

module.exports = EvilRobot


function EvilRobot(args) {

  this._initialize(args)

}

EvilRobot.type = 'EvilRobot'

EvilRobot.prototype._initialize = function(args) {

  this.id = args.id || generateUuid()
  this.type = this.constructor.type
  
  this.name = args.name || 'robo-bro'
  this.size = args.size || 5

  var geometry = new THREE.BoxGeometry( this.size, this.size*2, this.size )
  var material = new THREE.MeshNormalMaterial()
  this.mesh = new THREE.Mesh( geometry, material )

  var position = args.position
  var rotation = args.rotation
  if (position) this.mesh.position.set( position[0], position[1], position[2] )
  if (rotation) this.mesh.rotation.set( rotation[0], rotation[1], rotation[2] )

}

EvilRobot.prototype.toJSON = function() {

  var data = {}
  data.id = this.id
  this.type = this.constructor.type

  data.name = this.name
  data.size = this.size

  data.position = this.mesh.position.toArray()
  data.rotation = this.mesh.rotation.toArray()

  return data

}