jQuery(document).ready(function($){

  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug","Spt", "Oct", "Nov", "Dec"]
   $('#home_shot_text').hover(
    function () {
      //alert("animating");
      $(this).animate({opacity:'.8'});
   },
   function () {
     $(this).animate({opacity:'0'});
  }
  );
   $('.circle_blog_preview_text').hover(
    function () {
      //alert("animating");
      $(this).animate({opacity:'.85'});
   },
   function () {
     $(this).animate({opacity:'0'});
  }
  );

});