/////////////////////////////////////////////////////////////////////////////////////////
  var d3Data = splitStockStrings ( [
                    'date,dow,sp500,nasdaq\n1/1/16,10,15,8\n1/3/16,5,3,7\n1/5/16,12,18,12\n',
                    'date,dow,sp500,nasdaq\n1/1/17,10,15,8\n1/3/17,5,3,7\n1/5/17,12,18,12\n'
                ] );
  console.log ( d3Data );

  function splitStockStrings ( stockStrings ) {
    var newStrings = [];

    stockStrings.forEach ( function ( d ) {             
      var final = [];
      d.split ( '\n' ).forEach ( function ( frag, i ) {
        if ( i > 0 && frag.split ( ',' ) [ 0 ] ) {
          final.push ( frag.split ( ',' ) [ 0 ] );
        }
      });

      var obj = { date : final };
      var json = JSON.stringify ( obj );
      newStrings.push ( json );
      // Or if you don't want strings,
      // comment out the above and uncomment the below...
      // newStrings.push ( obj );
    });
    console.log("newStrings = " + newStrings);
    console.log("newStrings tpyeof = " + typeof(newStrings));
    return newStrings;
    
   
   }
  
///////////////////////////////////////////////////////////////////////////////////  