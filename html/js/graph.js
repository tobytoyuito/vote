var chocolates = [{
    "name": "IND",
    "economic": 0.5,
    "social":0.5 
  }, {
    "name": "you",
    "economic": 1.0,
    "social": 1.0
}]

//showTwoDimension(chocolates)




function showTwoDimension(data) {
  var margins = {
    "left": 40,
    "right": 40,
    "top": 40,
    "bottom": 40
  };
  var width = 500;
  var height = 500;
  var colors = d3.scale.category10();
  var svg = d3.select("#two-dimension")
        .append("svg")
        .attr("width",width)
        .attr("height",height)
        .append("g")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")");
  
  var x = d3.scale.linear()
      .domain([0,1])
      .range([0, width - margins.left - margins.right]);


  var y = d3.scale.linear()
      .domain([0,1])
      .range([height - margins.top - margins.bottom, 0]);

  svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + y.range()[0] + ")");
  svg.append("g").attr("class", "y axis").attr("transform", "translate(" + x.range()[0] + ",0)");

  svg.append("text")
    .attr("fill", "#414241")
    .attr("text-anchor", "middle")
    .attr("x", width / 2 - margins.left)
    .attr("y", height - margins.top - margins.bottom/2)
    .text("Economic Left");

  svg.append("text")
    .attr("fill", "#414241")
    .attr("text-anchor", "middle")
    .attr("x", width / 2 - margins.left)
    .attr("y", -margins.top/2)
    .text("Economic Right");

  svg.append("text")
    .attr("fill", "#414241")
    .attr("transform", "rotate(90,"+(width-margins.left-margins.right/2)+","+(height/2-margins.top)+")")
    .attr("text-anchor", "middle")
    .attr("x", width - margins.left - margins.right/2)
    .attr("y", height/2-margins.top)
    .text("Social Right");

  svg.append("text")
    .attr("fill", "#414241")
    .attr("transform", "rotate(-90,"+ (-margins.left/2) +","+(height/2-margins.top)+")")
    .attr("text-anchor", "middle")
    .attr("x", -margins.left/2)
    .attr("y", height/2-margins.top)
    .text("Social Left");

  // Add grids
  var xInner = d3.svg.axis()
    .scale(x)
    .tickSize(-(height-margins.top-margins.bottom),0,0)
    .tickFormat("")
    .orient("bottom")
    .ticks(8);
  var xInnerBar=svg.append("g")
    .attr("class","inner_line")
    .attr("transform", "translate(0," + (y.range()[0]) + ")")
    .call(xInner);

  var yInner = d3.svg.axis()
    .scale(y)
    .tickSize(-(width-margins.left-margins.right),0,0)
    .tickFormat("")
    .orient("left")
    .ticks(8);
  var xInnerBar=svg.append("g")
    .attr("class","inner_line")
    .attr("transform", "translate(" + x.range()[0] + ",0)")
    .call(yInner);


  //var xAxis = d3.svg.axis().scale(x).orient("bottom").tickPadding(2);
  //var yAxis = d3.svg.axis().scale(y).orient("left").tickPadding(2);

  //svg.selectAll("g.y.axis").call(yAxis);
  //svg.selectAll("g.x.axis").call(xAxis);



  var chocolate = svg.selectAll("g.node").data(data, function (d) {
    return d.name;
  });

  var chocolateGroup = chocolate.enter().append("g").attr("class", "node")
    .attr('transform', function (d) {
      return "translate(" + x(d.social) + "," + y(d.economic) + ")";
  });

  // Add circle
  chocolateGroup.append("circle")
    .attr("r", 10)
    .attr("class", "dot")
    .style("fill", function (d) {
      return colors(d.name);
  });

  for ( var i=0; i<data.length; i++){
    if(data[i].name=="you"){
      d3.select("svg>g").append("g")
          .attr('class', 'node')
          .attr('transform', "translate("+x(data[i].social) + "," + y(data[i].economic) + ")")
          .append("circle")
          .attr("r",50)
          .attr("class", "dot")
          .style("fill", "grey")
          .style("opacity", 0.3)
    }
  }

  // now we add some text, so we can see what each item is.
  chocolateGroup.append("text")
    .style("text-anchor", "middle")
    .style("fill", function (d) {
      return colors(d.name);
    })
    .attr("dy", -15)
    .text(function (d) {
      return d.name;
    });
}
