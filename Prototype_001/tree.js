//view: https://codepen.io/greenfield/project/live/9ef4c06581598e089ddead3fae99c5b9/XMMWgG/

//ePrint: https://eprints.qut.edu.au/123497/

// from phone

//csv | name | parent | myKey | geoLocation_lat | geoLocation_lon
// codepen: https://codepen.io/greenfield/project/editor/9ef4c06581598e089ddead3fae99c5b9
// ECMA6 Babel Webpac 3/4 Browerify npm

//http://127.0.0.1:3000/
////////////////////////////////////////////////////////////////////////
//NOTE: CSV node names must be unique with exception of the leaf nodes -
//eg: England and England Originals

////////////////////////////////////////////////////////////////////////
//set up container

var container = d3.select('body').append('svg')
    .attr('width', '100%').attr('height', '100%').attr('id','myContainer').call(d3.zoom().on("zoom", function () {
                  container.attr("transform", d3.event.transform)
          }))
          .append("g");

//d3.select("#myContainer").append('rect').attr("width",300).attr("height",300).attr("x",100).attr("y",600).attr('id','myBox');
console.log("more");

////////////////////////////////////////////////////////
var dispatch = d3.dispatch("load", "statechange");

////////////////////////////////////////////////////////

d3.csv("Q_treeCsv.csv", function(error, flatData) {
  if (error) throw error;

  flatData.forEach(function(d){
    if(d.parent == "null"){d.parent = null};
  });

  var treeData = d3.stratify()
  .id(function(d) { return d.name; })//this data can be retrieved
  .parentId(function(d) { return d.parent; })
  (flatData);

  //each - D3 specific - allows d, this, i | forEach - native js - allows d & i only
  treeData.each(function(d){
    d.name = d.id;
    d.parent = d.parentId;
  });

  dispatch.call("load", this, treeData);



var stateById = 111;
dispatch.call("statechange",stateById);
});


////////////////////////////////////////////////////////////////
dispatch.on("load.nine",function(treeData) {//was load.menu//works
//console.log("star 9");//first
});

////////////////////////////////////////////////////////////////
// Coerce population counts to numbers and compute total per state.
function type(d) {//currently not in use
  //alert("type here");
}
///////////////////////////////////////////////////////////////

dispatch.on("load.globe", function(treeData) {//was load.menu






var geoLat;
var geoLon;
var mOver_d_pts = [];


  

///////////////////////////////////////////////////////////////
  
  //in globe
dispatch.on("statechange.coordinate",function(coord){
  
  var theData = treeData.descendants();
  
  theData.forEach(function(d,i) {    
    if (i===coord){    
      //console.log("found it = "+ d.data.name)
     geoLat = parseFloat(d.data.geoLocation_lat);
     geoLon = parseFloat(d.data.geoLocation_lon);
      
      if(isNaN(geoLat || geoLon)){return 'not a number'}else{mOver_d_pts.push(d);}
                  
                 }else if(coord==="clear"){
                   mOver_d_pts = [];
                   removeMarkers();
                 };
    
    
    
  });
  
  
 //if (isNaN(coord)){return 'not a number'}else{mOver_d_pts.push(coord);}//use d - the object to retain all properties
  //console.log("here2");
  
  
  /*
  strategies
  receive d object and get data from object
  
  or 
  
  received i index number then use if statement on forEach to find specific d in theData
  
  
  
  */
  
  
  
  //var myD = theData[coord];
  
    
   // console.log("myD = " + myD );
    
  
  
    //console.log("specific d point in theData = "+ theData[coord].data.name);//does not work
  
  //console.log("specific d point in theData = "+ theData[coord]);
  
            //.attr('cx', d => projection([parseFloat(d.data.geoLocation_lon), parseFloat(d.data.geoLocation_lat)])[0])
  
   //console.log("specific d point in theData = "+ mOver_d_pts[0]); 

  
  
  
});  
  
  
  
  
  


//////////////////////////////////////////////////////////////

    const width = 960;
    const height = 500;
    const config = {
      speed: 0.005,
      verticalTilt: -30,
      horizontalTilt: 0
    }

    const globeContainer = d3.select("#myContainer").append('g').attr('width', width).attr('height', height).attr('x', 50).attr('id', "myGlobeContainer").attr('transform', 'translate(-130,0)scale(0.5)');//.attr('opacity',0.6);

   const svgBG = globeContainer.append('circle').attr('cx', 530).attr('cy', 250).attr('r', 250).style('fill', 'white');

    //let locations = [];
    const svgG = globeContainer.append('svg')
        .attr('width', width).attr('height', height).attr('x', 50).attr('id',"svgGlobe");
    const markerGroup = svgG.append('g');
    const projection = d3.geoOrthographic();
    const initialScale = projection.scale();
    const path = d3.geoPath().projection(projection);
    const center = [width/2, height/2];


    drawGlobe();
    drawGraticule();
    enableRotation();

    function drawGlobe() {
        d3.queue()
            .defer(d3.json, 'world-110m.json')
            //.defer(d3.json, 'locations.json')
            //.await((error, worldData, locationData) => {
              .await((error, worldData) => {
                svgG.selectAll(".segment")
                    .data(topojson.feature(worldData, worldData.objects.countries).features)
                    .enter().append("path")
                    .attr("class", "segment")
                    .attr("d", path)
                    .style("stroke", "#888")
                    .style("stroke-width", "1px")
                    .style("fill", (d, i) => '#e5e5e5')
                    .style("opacity", ".6");
                  //  locations = locationData;
         // console.log("here = " + coord);
         // if(coord === "clear"){removeMarkers();};
                    drawMarkers();
            });
    }

    function drawGraticule() {
        const graticule = d3.geoGraticule()
            .step([10, 10]);

        svgG.append("path")
            .datum(graticule)
            .attr("class", "graticule")
            .attr("d", path)
            .style("fill", "#fff")
            .style("stroke", "#ccc");
    }

    function enableRotation() {
        d3.timer(function (elapsed) {
            projection.rotate([config.speed * elapsed - 120, config.verticalTilt, config.horizontalTilt]);
            svgG.selectAll("path").attr("d", path);
           drawMarkers();
        });
    }

////drawMarkers();//calls function once


    function drawMarkers() {

//var mOver = [float(22), float(66)];      //////////////////////////////////////////////////////////////////
/*
        var report = d3.select("svgGlobe").selectAll("p")
          .data(mOver_d_pts)
          .enter()
          .append("p")
           .text(function (d,i) {
            });
*/
        const markers = markerGroup.selectAll('circle')
            .data(mOver_d_pts);
      //////////////////////////////////////////////////////////////////////////////////////////


        markers
            .enter()
            .append('circle')
            .merge(markers)

          //.attr('cx', d => projection([parseFloat(d.data.geoLocation_lon), parseFloat(d.data.geoLocation_lat)])[0])
          //.attr('cy', d => projection([parseFloat(d.data.geoLocation_lon), parseFloat(d.data.geoLocation_lat)])[1])


          .attr('cx', d => projection([parseFloat(d.data.geoLocation_lon), parseFloat(d.data.geoLocation_lat)])[0])

          .attr('cy', d => projection([parseFloat(d.data.geoLocation_lon), parseFloat(d.data.geoLocation_lat)])[1])

            .attr('fill', d => {

           const coordinate = [parseFloat(d.data.geoLocation_lon), parseFloat(d.data.geoLocation_lat)];
               


                gdistance = d3.geoDistance(coordinate, projection.invert(center));
                //return gdistance > 1.57 ? 'none' : 'steelblue';
                return gdistance > 1.57 ? 'none' : 'red';
            })
            .attr('r', 7);

        markerGroup.each(function () {
            this.parentNode.appendChild(this);
        });

    }
  
  ///////////////////
  function removeMarkers(){
    
    console.log("remove 444 Marker"+ markerGroup);
    markerGroup.selectAll('circle').remove();
  }
  
  
  
  
});//ends dispatch.on("load.globe")
//////////////////////////////////////////////




/////////////////////////////////////////////////////////
dispatch.on("load.tree", function(treeData) {

//in tree
dispatch.on("statechange.treecoordinate",function(coord){
 //console.log("received");//works


 //this is being triggered by mouseover
 //console.log("inside tree statechange = " + coord);//undefined
});


  // Set the dimensions and margins of the diagram
  var margin = {top: 20, right: 90, bottom: 30, left: 60},//using left margin move tree to right to make room for globe
      width = 4000 - margin.left - margin.right,
      height = 2000 - margin.top - margin.bottom;

/*KEEP - dimensions for hiRes browser view
      var margin = {top: 20, right: 90, bottom: 30, left: 2090},//using left margin move tree to right to make room for globe
          width = 4000 - margin.left - margin.right,
          height = 2000 - margin.top - margin.bottom;
*/



  // append the svg object to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin



  var treeContainer = container.append('g').attr('id', "myTreeContainer")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
      .attr('x', 50)
      .attr('transform', 'translate(300,10)scale(0.15)');


  var svg = treeContainer.append("svg").attr('id',"svgTree")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
      .attr('x', 50)
    .append("g")
      .attr("transform", "translate("
            + margin.left + "," + margin.top + ")");


var i = 0,
    duration = 750;
    //root;


// declares a tree layout and assigns the size
var treemap = d3.tree().size([height, width]);


//Root logically belongs with the Tree
//  assigns the data to a hierarchy using parent-child relationships
  var root = d3.hierarchy(treeData, function(d) {
     return d.children;
    });
// Assigns parent, children, height, depth
//root = d3.hierarchy(treeData, function(d) { return d.children; });



root.x0 = height / 2;
root.y0 = 0;

// Collapse after the second level
root.children.forEach(collapse);

update(root);



// Collapse the node and all it's children
function collapse(d) {
  if(d.children) {
    d._children = d.children
    d._children.forEach(collapse)
    d.children = null
  }
}

function update(source) {

  // Assigns the x and y position for the nodes
  var treeData = treemap(root);

  // Compute the new tree layout.
  var nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);

  // Normalize for fixed-depth.
  nodes.forEach(function(d){ d.y = d.depth * 480});

  // ****************** Nodes section ***************************

  ///////////////////////////////////////////////////////

  var report = d3.select("svgTree").selectAll("p")
    .data(nodes)
    .enter()
    .append("p")


      .text(function (d,i) {

        return "see id i = " + i + " dd = "+d.data.id;//yes: i = 0 d = QDC | same as d.data.name
       });

  //////////////////////////////////////////////////////////


  // Update the nodes...
  var node = svg.selectAll('g.node')
      .data(nodes, function(d) {return d.id || (d.id = ++i); });

  // Enter any new modes at the parent's previous position.
  var nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr("transform", function(d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
    })
    .on('click', click);

//////////////////////////////////////////////

  // Add Circle for the nodes
  nodeEnter.append('circle')
      .attr('class', 'node')
      .attr('r', 1e-6)
      .style("fill", function(d) {
          return d._children ? "lightsteelblue" : "#fff";
      });


  // Add labels for the nodes
  nodeEnter.append('text')
      .attr("dy", ".35em")
      .attr("x", function(d) {
          return d.children || d._children ? -13 : 13;
      })
      .attr("text-anchor", function(d) {
          return d.children || d._children ? "end" : "start";
      })
      .text(function(d) { return d.data.name; });

  // UPDATE
  var nodeUpdate = nodeEnter.merge(node);

  // Transition to the proper position for the node
  nodeUpdate.transition()
    .duration(duration)
    .attr("transform", function(d) {
        return "translate(" + d.y + "," + d.x + ")";
     });

  // Update the node attributes and style
  nodeUpdate.select('circle.node')
    .attr('r', 10)
    .style("fill", function(d) {

        return d._children ? "orange" : "yellow";
      //  return d._children ? "lightsteelblue" : "#fff";//call syntax
    })
    .attr('cursor', 'pointer')

    // findTree

    .on('mouseover',function (d,i){
    //dispatch.call('statechange',this,d.data.name);//works
    //dispatch.call('statechange',this,d.data.id);//gives name
    //dispatch.call('statechange',this,d.data.data.parent);//works
    //dispatch.call('statechange',this,d.data);//works - returns [object,object]
    //dispatch.call('statechange',this,d.data.data.myKey);//works for Asia-Pacific Images
    //dispatch.call('statechange',this,[d.data.data.geoLocation_lat);
    
 //http://bl.ocks.org/phil-pedruco/7745589   
 // var point = d3.mouse(this) , p = {x: point[0], y: point[1] };  
    
  // dispatch.call('statechange',this,[parseFloat(d.data.data.geoLocation_lat),              parseFloat(d.data.data.geoLocation_lon)]);//send a point [lat,lon] works
    
    //dispatch.call('statechange',this,d);
    dispatch.call('statechange',this,i);
    //dispatch.call('statechange',this,i);//works
    })
  
  .on('mouseout',function(){
    
    dispatch.call('statechange',this,"clear");
  });

//////////////////////////////////////////////////////////////////////

  // Remove any exiting nodes
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) {
          return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

  // On exit reduce the node circles size to 0
  nodeExit.select('circle')
    .attr('r', 1e-6);

  // On exit reduce the opacity of text labels
  nodeExit.select('text')
    .style('fill-opacity', 1e-6);

  // ****************** links section ***************************

  // Update the links...
  var link = svg.selectAll('path.link')
      .data(links, function(d) { return d.id; });

  // Enter any new links at the parent's previous position.
  var linkEnter = link.enter().insert('path', "g")
      .attr("class", "link")
      .attr('d', function(d){
        var o = {x: source.x0, y: source.y0}
        return diagonal(o, o)
      });

  // UPDATE
  var linkUpdate = linkEnter.merge(link);

  // Transition back to the parent element position
  linkUpdate.transition()
      .duration(duration)
      .attr('d', function(d){ return diagonal(d, d.parent) });

  // Remove any exiting links
  var linkExit = link.exit().transition()
      .duration(duration)
      .attr('d', function(d) {
        var o = {x: source.x, y: source.y}
        return diagonal(o, o)
      })
      .remove();

  // Store the old positions for transition.
  nodes.forEach(function(d){
    d.x0 = d.x;
    d.y0 = d.y;
  });

  // Creates a curved (diagonal) path from parent to the child nodes
  function diagonal(s, d) {

    path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`

    return path
  }

  // Toggle children on click.
  function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
    update(d);
  }
}



d3.select('#myContainer').attr("x",700);



});//ends dispatch.on(load.tree)



