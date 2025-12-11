$(function() {

  $(".2nd").click(function(){
    console.log("click")
    $("#2nd-elem").toggle(1000)
  })


  $(".1st").click(function(){
    console.log("click")
    // Callback function to delay further events
    $("#1st-elem").hide("slow", function(){
      alert("Paragraph is now hidden")
    })
  })

  $("img").click(function(){
    console.log($(this).attr("src"))
  })

  $("h1").click(function(){
    const txt1 = "<p id='hello'>Hello</p>"
    const txt2 = "<p>This is</p>"
    const txt3 = "<p>Cedric</p>"

    $("h1").after(txt1,txt2,txt3)
  })

  $("#hello").click(function(){
    console.log("this")
    $("#hello").remove()
  })



























});