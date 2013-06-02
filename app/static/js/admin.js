function insertAtCaret(areaId,text) {
 //alert("trying to insert" + text);
    var txtarea = document.getElementById(areaId);
    //alert(txtarea);
    var scrollPos = txtarea.scrollTop;
    var strPos = 0;
    var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ?
      "ff" : (document.selection ? "ie" : false ) );
    if (br == "ie") {
      txtarea.focus();
      var range = document.selection.createRange();
      range.moveStart ('character', -txtarea.value.length);
      strPos = range.text.length;
    }
    else if (br == "ff") strPos = txtarea.selectionStart;

    var front = (txtarea.value).substring(0,strPos);
    var back = (txtarea.value).substring(strPos,txtarea.value.length);
    txtarea.value=front+text+back;
    strPos = strPos + text.length;
    if (br == "ie") {
      txtarea.focus();
      var range = document.selection.createRange();
      range.moveStart ('character', -txtarea.value.length);
      range.moveStart ('character', strPos);
      range.moveEnd ('character', 0);
      range.select();
    }
    else if (br == "ff") {
      txtarea.selectionStart = strPos;
      txtarea.selectionEnd = strPos;
      txtarea.focus();
    }
    txtarea.scrollTop = scrollPos;
}

jQuery(document).ready(function($){
  $('#admin_paragraph').click(function(){
    insertAtCaret('blog_text_area', "<p>  </p>");
    //alert($(this).attr('id'));
  });
  $('#admin_left_quote').click(function(){
    insertAtCaret('blog_text_area', "<div class = 'left_block_quote'>  </div>");
    //alert($(this).attr('id'));
  });
  $('#admin_right_quote').click(function(){
    insertAtCaret('blog_text_area', "<div class = 'right_block_quote'>  </div>");
    //alert($(this).attr('id'));
  });
  $('#admin_center_quote').click(function(){
    insertAtCaret('blog_text_area', "<div class = 'center_block_quote'>  </div>");
    //alert($(this).attr('id'));
  });
    $('#admin_picture').click(function(){
    insertAtCaret('blog_text_area', "<figure> <img src='***' /><figcaption class = 'caption'>Caption goes here</figcaption></figure>");
    //alert($(this).attr('id'));
  });

});
