/*
$.ajax({
    url: "JDRlogin.php",
    type: "post", 
    success: function(data) {
      $('body').html(data);
    }
})
*/
console.log(window.location.href);
if(window.location.href.includes('html')){
    console.log('no');
    stop();
}

