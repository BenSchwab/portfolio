jQuery(document).ready(function($){

  var textMapping = {};


  textMapping["AccelerationImage"] = "A short story written for the seminar 'The Digital After Life'. The story examines a society based on a hyperbole of the Twin's Paradox where two classes emerge based on how they experience time.";
  textMapping["RealityImage"] = "A Prezi based essay written for my Freshman writing seminar. Examines and demonstrates the blurry line between reality and fiction.";
  textMapping["ShotImage"] = "A (very) short story written for my Freshman writing seminar. I created by plagarizing (don't worry - this was part of the assignment) and piecing together famous poems.";


    $('.circle_blog_preview_text').hover(
    function () {
      $(this).animate({opacity:'.85'});
      var selected = $(this).parent().children().children('.circle_blog_image');
      var id = selected.attr('id');
      $('.writing_preview_picture').show();
      $('.writing_preview_text_p').text(textMapping[id]);


   },
   function () {
     $(this).animate({opacity:'0'});
      var selected = $(this).parent().children().children('.circle_blog_image');
      var id = selected.attr('id');
      $('.writing_preview_picture').hide();
      $('.writing_preview_text_p').text("");
  }
  );


});