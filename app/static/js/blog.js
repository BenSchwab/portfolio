jQuery(document).ready(function($){

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
      $(this).animate({opacity:'1'});
   },
   function () {
     $(this).animate({opacity:'0'});
  }
  );

});