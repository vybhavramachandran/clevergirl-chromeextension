/*
This file is a background page(https://developer.chrome.com/extensions/background_pages)
The purpose of this file is to:

* Communicate with GPT3
* Format and Pass the responses to the content script for display in the bubble
*/



chrome.runtime.onMessage.addListener(receiver);


function receiver(request, sender, sendResponse) {
  console.log("Reuest received" + request);


}

//Function to send a message. Usually to the content.js file
function send(text) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, text, function (response) {
      console.log(response.farewell);
    });
  });
}

//function that fetches the title of the tab in question. This title is sent to
//the backend, which is then sent to OpenAI, to add more context to the query
// function getTitle() {
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     tabs[0].url;     //url
//     tabs[0].title;   //title
//   });
//   console.log("Title fetched"+tabs[0].title);
//   return tabs[0].title;
// }

//Creates Context Menus shown when the user Right Clicks on a page
//after selecting text (https://developer.chrome.com/apps/contextMenus)
chrome.runtime.onInstalled.addListener(function () {
  for (let key of Object.keys(options)) {
    chrome.contextMenus.create({
      id: key,
      title: options[key],
      type: 'normal',
      contexts: ['selection'],
    });
  }
});

const options = {
  'why': 'Why?',
  'what': 'What?',
  'how': 'How?',
};



//callback to handle user option selection
chrome.contextMenus.onClicked.addListener(function (clickData, tabData) {
  if (clickData.menuItemId == 'why' && clickData.selectionText) {
    console.log('Why' + clickData.selectionText);
    console.log('tabData', tabData.title);
    word = clickData.selectionText;
    question = "Why is " + word + "?";
    console.log("question is " + question);
    var formData = new FormData();
    formData.append("question", question);

    var xhr = new XMLHttpRequest();
    send("loading");
    xhr.open("GET", "http://127.0.0.1:5000/why?question=" + question+"&title="+tabData.title, true);
    xhr.responseType = 'json';
    xhr.onreadystatechange = function () {
      console.log(xhr);
      if (xhr.readyState == 4) {
        console.log(xhr.response);
        send(xhr.response);
      }
    }
    xhr.send();

  }
  else if (clickData.menuItemId == 'what' && clickData.selectionText) {
    console.log('What' + clickData.selectionText);
    word = clickData.selectionText;
    question = "What is " + word + "?";
    console.log("question is " + question);
    var formData = new FormData();
    formData.append("question", question);

    var xhr = new XMLHttpRequest();
    send("loading");
    xhr.open("GET", "http://127.0.0.1:5000/what?question=" + question+"&title="+tabData.title, true);
    xhr.responseType = 'json';
    xhr.onreadystatechange = function () {
      console.log(xhr);
      if (xhr.readyState == 4) {
        console.log(xhr.response);
        send(xhr.response);
      }
    }
    xhr.send();

  }
  else if (clickData.menuItemId == 'how' && clickData.selectionText) {
    console.log('How' + clickData.selectionText);
    word = clickData.selectionText;
    question = "How did " + word + "?";
    console.log("question is " + question);
    var formData = new FormData();
    formData.append("question", question);

    var xhr = new XMLHttpRequest();
    send("loading");
    xhr.open("GET", "http://127.0.0.1:5000/how?question=" + question+"&title="+tabData.title, true);
    xhr.responseType = 'json';
    xhr.onreadystatechange = function () {
      console.log(xhr);
      if (xhr.readyState == 4) {
        console.log(xhr.response);
        send(xhr.response);
      }
    }
    xhr.send();

  }
});

