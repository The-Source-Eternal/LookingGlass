module.exports = LookingGlass


function LookingGlass( connection ) {
  
  this.connection = connection
  this.classes = {}
  this.instances = {}

}

LookingGlass.prototype.registerClass = function( ClassDefinition ) {
 
  var Class = ClassDefinition( this )
  this.classes[ Class.type ] = Class

  this.connection.on( Class.type, function(id, args) {
    args.id = id
    new Class( args, true )
  })

}