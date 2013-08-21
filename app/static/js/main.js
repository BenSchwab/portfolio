jQuery(document).ready(function($){

   $('#head_text').hover(
    function () {
      //alert("animating");
      $(this).animate({opacity:'.8'});
   },
   function () {
     $(this).animate({opacity:'0'});
  }
  );
   $('.center_preview_image_text_div').hover(
    function () {
      //alert("animating");
      $(this).animate({opacity:'.8'});
   },
   function () {
     $(this).animate({opacity:'0'});
  }
  );
   //TODO: fix bug about disapeering on hover. Could be caused by..
   var curHighlight = $('#projects_div').children(".section_highlight");
   curHighlight.show();
   $(".section_div").mouseenter(
      function () {
         var highlight = $(this).children(".section_highlight");

         if(curHighlight!==null&&curHighlight[0]!==highlight[0]){
            var sec = $(this).attr('id');
            curHighlight.hide();
            highlight.show();
            var command = null;
        // alert(sec);
        if(sec=="projects_div"){
             // alert("sucess");
             command = "/getProjectPreview";
          }
          else if(sec =="about_div"){
           // alert("sucess");
           command = "/getContactPreview";
        }
        else if(sec =="writing_div"){
            //alert("sucess");
            command = "/getWritingPreview";
         }
         else{
            command = "/getBlogPreview";
         }

         $("#preview_holder").children().fadeOut(300).promise().done(function() {
          $.get(command, function(data) {

           $("#preview_holder").children().remove();
           $('#preview_holder').append(data['html']).hide().fadeIn(500);
           $('.center_preview_image_text_div').hover(
             function () {
                  //alert("animating");
                  $(this).animate({opacity:'.8'});
               },
               function () {
                 $(this).animate({opacity:'0'});
              }
              );

        });
       });



      }
      curHighlight = highlight;



   }
   );

$('#head_text').click(
   function(){

         //$("#preview_holder").animate({opacity:'.8'});
      });




});