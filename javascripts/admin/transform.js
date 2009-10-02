var stop = false;
var regex_url = /^(http|https|ftp):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i;
var regex_email = /\w{1,}[@][\w\-]{1,}([.]([\w\-]{1,})){1,3}$/;

function switchTransformChoice(index) {
  document.getElementsByClassName('transform_input').each(function(node) {
    Element.hide(node);
  });

  document.getElementsByClassName('transform_choice').each(function(node) {
    Element.removeClassName(node, 'transform_current');
  })

  Element.show('transform_input_' + index);
  Element.addClassName('transform_choice_' + index, 'transform_current');
}

function testURL(v) {
  v = document.getElementById(v);
  if (v.value.match(regex_url)) {
    window.open(v.value,'mywindow','width=600,height=400,location=yes,resizable=yes,scrollbars=yes');
    var image = document.getElementById(v.name + '_img_ok');
    image.style.display = 'inline';
  }
  else {
    var image = document.getElementById(v.name + '_img_bad');
    image.style.display = 'inline';
    return false;
  }
}

function copyText(copyFrom) {
  if (copyFrom == 'break') {
    stop = true;
  }
  if (stop != true) {
    var copyFrom = document.getElementById(copyFrom);
    var copyTo = document.getElementById('display_text');
    copyTo.value = copyFrom.value;
  }
}

function clearText() {
  var clear = document.getElementById('display_text');
  clear.value = '';
  stop = false;
}

function hideValidateImages(vname) {
  //alert(vname + '_img_ok');
  var image = document.getElementById(vname + '_img_ok');
  image.style.display = 'none';
  var image = document.getElementById(vname + '_img_bad');
  image.style.display = 'none';
}

function validateURL(v) {
  v = document.getElementById(v);
  if (v.value.match(regex_url)) {
    var image = document.getElementById(v.name + '_img_ok');
    image.style.display = 'inline';
    return true;
  }
  else {
    var image = document.getElementById(v.name + '_img_bad');
    image.style.display = 'inline';
    return false;
  }
}

function validateEmail(v) {
  v = document.getElementById(v);
  if (v.value.match(regex_email)) {
    var image = document.getElementById(v.name + '_img_ok');
    image.style.display = 'inline';
    return true;
  }
  else {
    var image = document.getElementById(v.name + '_img_bad');
    image.style.display = 'inline';
    return false;
  }
}

function getTextSelection(myField) {
  
  // figure out cursor and selection positions
  var startPos = myField.selectionStart;
  var endPos = myField.selectionEnd;
  var cursorPos = endPos;
  var scrollTop = myField.scrollTop;

  // set-up the text vars
  var beginningText = myField.value.substring(0, startPos);
  var followupText = myField.value.substring(endPos, myField.value.length);

  // check if text has been selected
  if (startPos != endPos) {
    textSelected = true;
    var selectedText = myField.value.substring(startPos, endPos); 
  }
  
  return {beginningText : beginningText, followupText : followupText, selectedText : selectedText, startPos : startPos, endPos : endPos, scrollTop : scrollTop, cursorPos : cursorPos};
}

function insertTextSelection(textSelections,textInsert,myField) {
  
  finalText = textSelections.beginningText 
          + textInsert
          + textSelections.followupText;
  cursorPos = textSelections.startPos + textInsert.length;

  // set the appropriate DOM value with the final text
  myField.value = finalText;
  myField.scrollTop = textSelections.scrollTop;

  myField.selectionStart = cursorPos;
  myField.selectionEnd = cursorPos;
}

function bLoad() {
  var textArea = document.getElementById('ta');
  var textSelections = getTextSelection(textArea);
  if (textSelections.selectedText != '') {
    displayText = document.getElementById('display_text');
    alert(displayText);
    //displayText.value = textSelections.selectedText;
  }
}

function transform() {
     
  var textArea = document.getElementById('ta');
  var textSelections = getTextSelection(textArea);
  
  var buttonGroup = document.forms[0].transform_choice;
  for (var i=0; i<buttonGroup.length; i++) {
    if (buttonGroup[i].checked) {
      transformationType = buttonGroup[i].value;
    }
  }
    
  switch(transformationType) {
    case 'l_e_web':
      webAddress = document.getElementById('l_e_web_text');
      displayText = document.getElementById('display_text');
      webAddressValue = webAddress.value;
      webAddressText = displayText.value;
      if (webAddressText != '') {
        textInsert = '"'+webAddressText+'":'+webAddressValue;
      }
      else {
        textInsert = webAddressValue;
      }
    break
    case 'l_e_email':
      emailAddress = document.getElementById('l_e_email_text');
      displayText = document.getElementById('display_text');
      emailAddressValue = emailAddress.value;
      emailAddressText = displayText.value;
      if (emailAddressText != '') {
        textInsert = '"'+emailAddressText+'":mailto:'+emailAddressValue;
      }
      else {
        textInsert = emailAddressValue;
      }
    break
    default: alert('something wrong'); 
  } 
  
  insertTextSelection(textSelections,textInsert,textArea);
}