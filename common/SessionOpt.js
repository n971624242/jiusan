var Memcached = require( 'memcached' );

module.exports={
	setSession:function(thisa,key,value){
		let memcached = new Memcached("127.0.0.1:11211" );
	    	return new Promise(function(resolve,reject){
	        memcached.set(key,value , 0, function( err, result ){
	          if( err ) console.error( err );
	            //console.dir( result );
	            memcached.end();
	            resolve(true); 
	          });
	    	});
	},
	getSession:function(thisa,key){
		  	let memcached = new Memcached("127.0.0.1:11211" );
		  	return new Promise(function(resolve,reject){
		      memcached.get(key,function( err, result ){
		        if( err ) console.error( err );
		        memcached.end();
		        resolve(result);
		      });
		  	});
	},
	logout:function(thisa,key){
		let memcached = new Memcached("127.0.0.1:11211" );
		  	return new Promise(function(resolve,reject){
		      memcached.delete(key,function( err, result ){
		        if( err ) console.error( err );
		        memcached.end();
		        resolve(result);
		      });
		  	});
	}
}