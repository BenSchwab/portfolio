jQuery(document).ready(function($){

  var GoLImage = "../static/images/game_of_life.png";
  var SplinkyImage = "../static/images/splinky_icon.png";
  var SatVocabImage = "";
  var JavaGameControllerImage = "";
  var imageMapping = {};
  var textMapping = {};
  imageMapping["GoLImage"] = GoLImage;
  imageMapping["SplinkyImage"] = SplinkyImage;
  imageMapping["SATVocabImage"] = SatVocabImage;
  imageMapping["JavaGameControllerImage"] = JavaGameControllerImage;

  textMapping["GoLImage"] = "A javascript Conway Game of Life tutorial and simulator.";
  textMapping["SplinkyImage"] = SplinkyImage;
  textMapping["SATVocabImage"] = SatVocabImage;
  textMapping["JavaGameControllerImage"] = JavaGameControllerImage;

   $('.circle_blog_image').hover(
    function () {

      var id = $(this).attr('id');
         //alert($(this).attr('id'));
      //alert(imageMapping[id]);
      $('.project_preview_picture').attr('src', imageMapping[id]);
      $('.project_preview_text').text(textMapping[id]);
   },
   function () {

  }
  );


});