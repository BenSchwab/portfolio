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
   $('.content_square_preview').hover(
    function () {
      //alert("animating");
      $(this).animate({opacity:'1'});
   },
   function () {
     $(this).animate({opacity:'0'});
  }
  );

});