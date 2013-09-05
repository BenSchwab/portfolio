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
   $('.circle_blog_image_div').hover(
    function () {
      //alert("animating");
      $(this).parent().children('.circle_blog_preview_text').animate({opacity:'1'});
   },
   function () {
     $(this).parent().children('.circle_blog_preview_text').animate({opacity:'0'});
  }
  );

});