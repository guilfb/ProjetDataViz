<!DOCTYPE html>
<head>
  <meta charset="utf-8">
  <script src="https://d3js.org/d3.v4.min.js"></script>
  <style>
    body { margin:0;position:fixed;top:0;right:0;bottom:0;left:0; }
  </style>
</head>

<body>
  <script>
    // Feel free to change or delete any of the code you see in this editor!
    var svg = d3.select("body").append("svg")
      .attr("width", 960)
      .attr("height", 500)

    svg.append("text")
      .text("Edit the code below to change me!")
      .attr("y", 200)
      .attr("x", 120)
      .attr("font-size", 36)
      .attr("font-family", "monospace")

  </script>
</body>
