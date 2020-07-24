/*
This file is a Content Script (https://developer.chrome.com/extensions/content_scripts)
This file contains JS code that:
* Displays all overlays on top of the webpage

All the CSS used by the elements here reside in the "content.css" file
*/

//This creates the bubble that resides on top of the webpage.
//This is displayed when nothing is being queried
var bubbleDOM = document.createElement('div');
bubbleDOM.setAttribute('class', 'before_answer');

bubbleDOM.innerHTML = '<div><img src="https://i.ibb.co/jDfvTxs/raptor.png" "></div>';
document.body.appendChild(bubbleDOM);


//registering a listener. This receiver receives messages primarily
//from the background.js code. The received message contains the text
//to display in the bubbles after background.js receives the answers from GPT3
chrome.runtime.onMessage.addListener(receiver);


//this code dismisses the expanded bubble after the user views the answer
//click anywhere on the screen dismisses the bubble and it goes back to the
//"before_answer" state
window.addEventListener('mousedown', function (e) {
  if (bubbleDOM.getAttribute('class') == 'after_answer') {
    bubbleDOM.innerHTML = '<div><img src="https://i.ibb.co/jDfvTxs/raptor.png" "></div>';
    bubbleDOM.setAttribute('class', 'before_answer');

  }


});

//Code to change the contents/layout of the bubble when answers are available
function renderBubble(selection) {
  console.log("renderBubble called" + selection);
  bubbleDOM.setAttribute('class', 'after_answer');
  if (selection !=null) {
    bubbleDOM.innerHTML = selection;
  }
  else {
    bubbleDOM.innerHTML = "Loading.."
  }
}

//Function handling the message received from background.js. Registered with the
//receiver listener
function receiver(request, sender, sendResponse) {
  console.log("Request received");
  if (request == "loading") {
    console.log("loading");
  }
  else if (request.type == "why") {
    why_array = request.why_answers;
    var textToDisplay = "";
    console.log(why_array);
    for (i = 0; i < why_array.length; i++) {
      textToDisplay += "<div class=\"answer\">" + why_array[i] + "</div>";
      if (i != why_array.length - 1) {
        textToDisplay += "<div class=\"why\">WHY❓</div>";
      }
    }

  }
  else if (request.type == "what") {
    textToDisplay = "<div class=\"answer\">" + request.what_answer + "</div>"
  }
  else if (request.type == "how") {
    textToDisplay = "<div class=\"answer\">" + request.how_answer + "</div>"
  }
  renderBubble(textToDisplay);
}
