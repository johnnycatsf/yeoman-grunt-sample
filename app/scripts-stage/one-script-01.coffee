createGraph = ->
  results = []
  count = $("#count").val()
  length = $("#length").val()
  unitHeight = 10
  $("div").remove()
  i = 0
  while i < length
    results[i] = 0
    $("body").append "<div/>"
    ++i
  i = 0
  while i < count
    results[Math.floor(Math.random() * length)] += 1
    ++i
  $("div").each (index) ->
    $this = $(this)
    num = results[index]
    answer = (index + 1) + " *" + num
    $this.html answer
    $this.css height: (unitHeight * num) + "px"
