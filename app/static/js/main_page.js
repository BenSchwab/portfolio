jQuery(document).ready(function($){

   //alert("about to call to server")
   $.get('/getAccelerationText', function(data) {


    outputText(data['text'], $('#writing_canvas'));
  });

   var topLeft = $('#top_left');
   var topLeftOverlay = $('#top_left_overlay');

   var topRight = $('#top_right');
   var topRightOverlay = $('#top_right_overlay');

   var bottomRight = $('#bottom_right');
   var bottomRightOverlay = $('#bottom_right_overlay');

   var bottomLeft = $('#bottom_left');
   var bottomLeftOverlay = $('#bottom_left_overlay');

   var contactCircle = $('#contact_circle');
   var blogCircle = $('#blog_circle');
   var projectsCircle = $('#projects_circle');
   var writingCircle = $('#writing_circle');
   var mainImage = $('#headshot');
   var mainText = $('#head_text');

   $('.quarter_circle_top_left').hover(
    function () {
     $(this).animate({opacity:'1'});
     alert("hovering");

   },
   function () {
     $(this).animate({opacity:'.3'});

   }
   );

   $('#top_right_overlay').hover(
    function () {
     $(this).animate({opacity:'.8'});

   },
   function () {
     $(this).animate({opacity:'0'});

   }
   );
   $('#top_left_overlay').hover(
    function () {
     $(this).animate({opacity:'.8'});

   },
   function () {
     $(this).animate({opacity:'0'});

   }
   );
   $('#bottom_right_overlay').hover(
    function () {
     $(this).animate({opacity:'.8'});

   },
   function () {
     $(this).animate({opacity:'0'});
   }
   );
   $('#bottom_left_overlay').hover(
    function () {
     $(this).animate({opacity:'.8'});
   },
   function () {
     $(this).animate({opacity:'0'});
   }
   );



   $('#head_text').hover(
    function () {
      //alert("animating");
     $(this).animate({opacity:'.8'});
   },
   function () {
     $(this).animate({opacity:'0'});
   }
   );

  // mainText.click(function(){
   // returnToMain();
  //});

  topRightOverlay.click(function(){
 // alert("clicked");
 //openBlog();


});
   topLeftOverlay.click(function(){
     openProjects();
   });
   bottomRightOverlay.click(function(){
     openWriting();
   });
   bottomLeftOverlay.click(function(){
     openContact();
   });

   var animateTime=1500;

   function returnToMain(){
   //alert("return to main called");

   topRight.animate({height:'50%',width:'50%'},animateTime);

   topLeft.animate({height:'50%',width:'50%'},animateTime);

   bottomLeft.animate({height:'50%',width:'50%'},animateTime);

   bottomRight.animate({height:'50%', width:'50%'},animateTime);



   mainImage.animate({top:'50%', left:'50%'}, animateTime);
   mainText.animate({top:'50%', left:'50%'}, animateTime);
   writingCircle.show();
   projectsCircle.show();
   contactCircle.show();
   blogCircle.show();
 }

 function openBlog(){
  //alert("opened blog");
  topRight.animate({height:'100%',width:'100%'},animateTime);
  topLeft.animate({height:'0%',width:'0%'},animateTime);
  bottomLeft.animate({height:'0%',width:'0%'},animateTime);
  bottomRight.animate({height:'0%', width:'0%'},animateTime);

  $('.section_text').hide(50);
  topRightOverlay.hide();
  topLeftOverlay.hide();
  bottomLeftOverlay.hide();
  bottomRightOverlay.hide();

  mainImage.animate({top:'0%', left:'100%'}, 1500);
  mainText.animate({top:'0%', left:'100%'}, 1500);

 //writingCircle.hide(500);
 //projectsCircle.hide(500);
 //contactCircle.hide(500);
 //blogCircle.hide(500);
}
function openProjects(){
 topRight.animate({height:'0',width:'0'},animateTime);
 topLeft.animate({height:'100%',width:'100%'},animateTime);
 bottomLeft.animate({height:'0%',width:'0%'},animateTime);
 bottomRight.animate({height:'0%', width:'0%'},animateTime);

 $('.section_text').hide(50);
 topRightOverlay.hide();
 topLeftOverlay.hide();
 bottomLeftOverlay.hide();
 bottomRightOverlay.hide();

 mainImage.animate({top:'0%', left:'0%'}, 1500);
 mainText.animate({top:'0%', left:'0%'}, 1500);


}

function openWriting(){
 topRight.animate({height:'0',width:'0'},animateTime);
 topLeft.animate({height:'0%',width:'0%'},animateTime);
 bottomLeft.animate({height:'0%',width:'0%'},animateTime);
 bottomRight.animate({height:'100%', width:'100%'},animateTime);

 mainImage.animate({top:'100%', left:'100%'}, 1500);
 mainText.animate({top:'100%', left:'100%'}, 1500);

 $('.section_text').hide(50);
 topRightOverlay.hide();
 topLeftOverlay.hide();
 bottomLeftOverlay.hide();
 bottomRightOverlay.hide();
}

function openContact(){
  topRight.animate({height:'0',width:'0'},animateTime);
  topLeft.animate({height:'0%',width:'0%'},animateTime);
  bottomLeft.animate({height:'100%',width:'100%'},animateTime);
  bottomRight.animate({height:'0%', width:'0%'},animateTime);

  $('.section_text').hide(50);
  mainImage.animate({top:'100%', left:'0%'}, 1500);
  mainText.animate({top:'100%', left:'0%'}, 1500);

  topRightOverlay.hide();
  topLeftOverlay.hide();
  bottomLeftOverlay.hide();
  bottomRightOverlay.hide();
}





});
