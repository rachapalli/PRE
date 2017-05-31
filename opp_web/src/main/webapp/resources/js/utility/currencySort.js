jQuery.extend( jQuery.fn.dataTableExt.oSort, {
    "currency-pre": function ( obj1 ) {
    	obj1 = (obj1==="-") ? 0 : obj1.replace( /[^\d\-\.]/g, "" );
        return parseFloat( obj1 );
    },
 
    "currency-asc": function ( obj1, obj2 ) {
        return obj1 - obj2;
    },
 
    "currency-desc": function ( obj1, obj2 ) {
        return obj2 - obj1;
    }
} );