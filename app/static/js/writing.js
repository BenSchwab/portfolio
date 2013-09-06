jQuery(document).ready(function($){

  var GoLImage = "../static/images/projects/game_of_life/screen_two.jpg";
  var SplinkyImage = "../static/images/projects/splinky/device-2012-07-19-173433.png";
  var SatVocabImage = "../static/images/projects/sat_vocab/satv_one.jpg";
  var JavaGameControllerImage = "../static/images/projects/splinky/device-2012-07-19-173433.png";
  var imageMapping = {};
  var textMapping = {};
  imageMapping["GoLImage"] = GoLImage;
  imageMapping["SplinkyImage"] = SplinkyImage;
  imageMapping["SATVocabImage"] = SatVocabImage;
  imageMapping["JavaGameControllerImage"] = JavaGameControllerImage;

  textMapping["GoLImage"] = "A javascript Conway Game of Life tutorial and simulator.";
  textMapping["SplinkyImage"] = "Splinky's Last stand is space-shooting, tower-defense, ridiculous weapon filled android game.";
  textMapping["SATVocabImage"] = "Android SAT Vocab app with a hand picked set of high priority words. Includes fun two player competition, and automatically generated study lists.";
  textMapping["JavaGameControllerImage"] = "A Java based developer library allowing one to harness three virtual controllers displayed on up to four Android devices. Connection established via bluetooth.";

   $('.circle_blog_image').hover(
    function () {

      //var id = $(this).attr('id');
      //alert($(this).attr('id'));
      //alert(imageMapping[id]);
     // $('.project_preview_picture').attr('src', imageMapping[id]);
     // $('.project_preview_text_p').text(textMapping[id]);
   },
   function () {

  }
  );

    $('.circle_blog_preview_text').hover(
    function () {

        $(this).animate({opacity:'.85'});
      //alert("animating");
      var selected = $(this).parent().children().children('.circle_blog_image');
       var id = selected.attr('id');
      //alert($(this).attr('id'));
      //alert(imageMapping[id]);
       $('.project_preview_picture').show();
      $('.project_preview_picture').attr('src', imageMapping[id]);
      $('.project_preview_text_p').text(textMapping[id]);


   },
   function () {
     $(this).animate({opacity:'0'});

      var selected = $(this).parent().children().children('.circle_blog_image');
       var id = selected.attr('id');

      //alert($(this).attr('id'));
      //alert(imageMapping[id]);
      $('.project_preview_picture').hide();
      $('.project_preview_text_p').text("");
  }
  );


});