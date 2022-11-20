//set variable of input ID to password
var password = document.getElementById("password");
//add all symbols, numbers, and alphabets in chars
function genPassword() {
  var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*";
  var passwordLength = 13;
  var password = "";

//random password using for loop, use Math.random() to get random characters
  for (var i = 0; i <= passwordLength; i++) {
    var randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber + 1);
  }
 document.getElementById("password").value = password;
 // alert ("Hi");
}

function copyPassword() {
  var copyText = document.getElementById("password");
  copyText.select();
  document.execCommand("copy");  
}
