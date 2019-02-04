var config = {
    apiKey: "AIzaSyDWC9TDunSgBdwKLZvq3vQ9_pjwnO8rhSk",
    authDomain: "project01-73ad7.firebaseapp.com",
    databaseURL: "https://project01-73ad7.firebaseio.com",
    projectId: "project01-73ad7",
    storageBucket: "project01-73ad7.appspot.com",
    messagingSenderId: "1078184771051"
  };
  
  firebase.initializeApp(config);
  var database = firebase.database();
  let $img ;
  let currentImg ;
  let lRock =  $("#Lrock");
  let lPaper =  $("#Lpaper");
  let lScissor =  $("#Lscissor");
  
  let rRock =  $("#Rrock");
  let rPaper =  $("#Rpaper");
  let rScissor =  $("#Rscissor");

let currentPlayer = " " ;
 let data ;
 let player1 = {
    name: " ",
    win: 0,
    lose: 0,
    tie: 0,
    choice: " ",
    turn : true,
    img: " ",
    img_added : false,
    option1: true,
    gameOn:true

};


 let player2 = {
    name: " ",
    win: 0,
    lose: 0,
    tie: 0,
    choice: " ",
    turn : false,
    img:" " ,
    img_added : false,
    option2:true,
    gameOn:true
 };


 let player2Turn = false;
 let yourWin =0 ;
 let yourLose =0 ;
 let gameTie = 0;
let opponentWin = 0;
let opponentLose = 0;
let uSelection  = " ";
let pSelection = " ";  //opponent selection

var uChoice = " " ;
var pChoice = " " ;
  //listen to the database and get the values if any .
  $(document).ready(function(){
	database.ref("/players").on('value', function(snapshot) {
        data = snapshot.val();
        console.log(data);
        if (snapshot.child("player1").exists() )  
        {
            console.log(snapshot.val().player1.name);
             player1.name = snapshot.val().player1.name;
             player1.img = snapshot.val().player1.img;
             player1.win =snapshot.val().player1.win;
             player1.lose =snapshot.val().player1.lose;
             player1.tie =snapshot.val().player1.tie;
             player1.option1 = snapshot.val().player1.option1;
             player1.gameOn = snapshot.val().player1.gameOn;
            $("#you").text(player1.name);
            if(player1.name != " " &&  player2.name == " ")
            {
                $("#caption").text("Waiting for player2 to join...");
            } 
           
            player1.turn = snapshot.val().player1.turn;
            player1.img= snapshot.val().player1.img;
            uChoice =snapshot.val().player1.choice;
        }
        if(snapshot.child("player2").exists())
        {
            console.log(snapshot.val().player2.name);
             player2.name =snapshot.val().player2.name;
             player2.img = snapshot.val().player2.img;
            $("#opponent").text(player2.name);
            player2.win =snapshot.val().player2.win;
             player2.lose =snapshot.val().player2.lose;
             player2.tie =snapshot.val().player2.tie;
             player2.option2 = snapshot.val().player2.option2;
            player2Turn  = snapshot.val().player2.turn;
            player2.turn = player2Turn;
            var i_added=  snapshot.val().player2.img_added;
            player2.img = snapshot.val().player2.img;
            pChoice =snapshot.val().player2.choice;
            player2.gameOn = snapshot.val().player2.gameOn;
            
            if(player1.name != " " && player2.name != " "  && uChoice== " ")
            {
                $("#input").empty();
            }
        
        if(player1.name != " " && player2.name != " "  && uChoice== " ")
        {
            $("#caption").text("Waiting for " + player1.name + "'s turn...");
           

        }else if(player1.name != " " && player2.name != " "  && pChoice== " ")
        {
            $("#caption").text("Waiting for " + player2.name + "'s turn...");
        }
       
        if(uChoice != " ")
        {
            enableRightPanelBtn();
        }
            
        if(player2.img!= " " && i_added == false ){
        let $img1= $('<img class="image">');
        $img1.attr("src", player2.img  );
        $("#option2").append( $img1);
        $("#option2").append( '<h4 id="choice2">'+ pChoice + '</h4>');
        
        $("#vs").append('<img src="assets/images/vs.jpg" alt="vs" height="42" width="42" class="vsImage">');
        player2.img = " ";
        }

        
        if(player1.gameOn == false)
        {
            $("#win1").html( "Win:" + player1.win );
            $("#lose1").html( "Lose:" +  player1.lose);
            $("#tie1").html("Tie:" + player1.tie);
            
            $("#win2").html("Win:" +  player2.win);
            $("#lose2").html("Lose:" + player2.lose);
            $("#tie2").html("Tie:" + player2.tie);
           
            var finalMsg = snapshot.val().result.msg;
            $("#result").text(finalMsg);
            setTimeout(removeImages ,10000);
          
            $("#caption").text(" ");

        }
        }
        
     //when both player selected their option update ui locally
   
    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      });


    }); // end doc ready

//on submit save the user input player names in the database.
    $( "#name-submit").on("click", function(event) {
       event.preventDefault();
        // Get the input values
        if( player1.name === " " ) {
        var name1 = $("#name-input").val().trim();

        enableLeftPanelBtn();
      
         if ( name1 !== "") {
            $(this).prop("disabled" , true);
       player1.name = name1;
       currentPlayer = player1.name;
        //set the input value in database
        database.ref("/players/player1").set(player1);
        database.ref("/players/player1").onDisconnect().remove();
        }
      
    }
    else if(player2.name === " ") {
       
       var name2 = $("#name-input").val().trim();
        if ( name2 !== "") {
            // enableRightPanelBtn();
            $(this).prop("disabled" , true);
        player2.name = name2;
        currentPlayer = player2.name;
        database.ref("/players/player2").set(player2);
    }
        database.ref("/players/player2").onDisconnect().remove();
    }
    }); 
    //onclick user choice
      $(".option").on("click", function(event) {
        event.preventDefault();
        
       
        // if(player1.gameOn == true) return;
        if( player2.name == " ")
        {
            alert("Waiting for player2 to join...");
        }
        if(player1.name == " " || player2.name == " ")
        {
                return;
        }
       
        let selectedOption = $(this);
        uSelection=$(this).text();
        if(player1.turn === true )
        {
        changeLeftBtnStatus(uSelection,lRock,lPaper,lScissor);
        currentPlayer = player1.name;
     
       
            $("#option1").append($img);
            $("#option1").append(' <h4 id="choice1">'+ uSelection + '</h4>');
            database.ref("/players/player1").update({choice:uSelection, turn:false, img:currentImg, option1:false} );
            database.ref("/players/player2").update({turn:true , option2:true} );

        }
        else if( player2.turn === true)
        {
            currentPlayer = player2.name;
            changeLeftBtnStatus(uSelection,rRock,rPaper,rScissor);
            database.ref("/players/player2").update({choice :uSelection, turn:false, img:currentImg} );
            database.ref("/players/player2").update({img_added:true} );
            database.ref("/players/player1").update({turn:true} );
         
            let $img1= $('<img class="image">');
            $img1.attr("src",player1.img );
            $("#option1").append($img1);
            $("#option1").append(' <h4 id="choice1">'+ uChoice + '</h4>');

           

        }
         //disable locally
         $("#Rrock").prop('disabled',true);
         $("#Rpaper").prop('disabled',true);
         $("#Rscissor").prop('disabled',true);

        if(uChoice != " " && pChoice != " "){
            playGame();
        }
      
    });
    
    function playGame()
    {
       switch(uChoice+pChoice ){
           case "RockScissor":
           case "PaperRock":
           case "ScissorPaper":
           win()
            break;
           case "ScissorRock":
           case "PaperScissor":
           case "RockPaper":
           lose()
           break;
           case "ScissorScissor":
           case "PaperPaper":
           case "RockRock":
           tie()
           break;
    
       }
    
    }

function win()
  {
  
    yourWin = parseInt(player1.win)+ 1 ;   
    opponentLose = parseInt(player2.lose)+ 1 ;  
    
    database.ref("/players/player1").update({win:yourWin, result:"win",gameOn:false} );
    database.ref("/players/player2").update({lose:opponentLose, result:"lost",gameOn:false} );
     var msg = `${player1.name}'s ${uChoice} beats ${player2.name}'s ${pChoice}. ${player1.name} Won!!` ;
    database.ref("/players/result").set({msg:msg} );
    
}
function  lose(){
    yourLose = parseInt(player1.lose)+ 1 ;   
    opponentWin = parseInt(player2.win)+ 1 ; 
   
     database.ref("/players/player1").update({lose: yourLose,result:"lost",gameOn:false} );
     database.ref("/players/player2").update({win:opponentWin,result:"win", gameOn:false} );
     var msg = `${pChoice} beats ${uChoice}. ${player2.name} Won!!` ;
    
     database.ref("/players/result").set({msg:msg} );
  
}

function tie(){
    gameTie = parseInt(player1.tie)+ 1 ; 
    database.ref("/players/player1").update({tie :gameTie, result:"tie", gameOn:false} );
    database.ref("/players/player2").update({tie :gameTie, result:"tie",gameOn:false} );
    var msg = 'Its a Tie!!!' ;
    database.ref("/players/result").set({msg:msg} );

}

function  enableLeftPanelBtn(){
    $("#Lrock").prop('disabled',false);
    $("#Lpaper").prop('disabled',false);
    $("#Lscissor").prop('disabled',false);
}

function  enableRightPanelBtn(){
    $("#Rrock").prop('disabled',false);
    $("#Rpaper").prop('disabled',false);
    $("#Rscissor").prop('disabled',false);
}



function changeLeftBtnStatus(selectionName, rock , paper, scissor){
    paper.prop('disabled',true);
    scissor.prop('disabled',true);
    rock.prop('disabled',true);
    if(selectionName === "Rock"){
       
        currentImg = "assets/images/rock.jpg" ;
        $img = '<img src="assets/images/rock.jpg" class="image img-responsive">';
       
    }else if(selectionName === "Paper"){
     
        currentImg = "assets/images/paper.jpg" ;
        $img = '<img src="assets/images/paper.jpg" class="image img-responsive">';
        
    }else{
       
        currentImg = "assets/images/scissor.png" ;
        $img = '<img src="assets/images/scissor.png" class="image img-responsive">';
       
    }

}
function removeImages()
{
    $("#option1").empty();
    $("#option2").empty();
    $("#vs").empty();
    $("#result").empty();
   
    uChoice = " " ;
    pChoice = " ";

    //reset database
   
    database.ref("/players/player1").update({choice:" ", img:" ", img_added:false, gameOn:true} );
    database.ref("/players/player2").update({choice:" ", img:" ", img_added:false, gameOn:true} );
    database.ref("/players/result").set({msg:" "} );
   
            $("#caption").text("Waiting for " + player1.name + "'s turn...");
    enableLeftPanelBtn();
   
}


    $("#send-chat").on("click", function (e) {
        e.preventDefault();
        var message = $("#chat-input").val().trim();

        var chatObj = {
            message: message,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            sender: currentPlayer
        };
        // Submit a chat
        database.ref("/chat/").push(chatObj);

        // Clear chat input
        $("#chat-input").val("");
        scrollToBottom();

    });
   
    $("#chat-input").keypress(function (e) {

        if (e.which == 13) {
            $("#send-chat").click();
        }
    });
   
    database.ref("/chat/").on('child_added', function (snapshot) {
        var chatMessage = snapshot.val();


        // Only show messages sent in the last half hour.
        // So that we have only a recent chat history
        if (Date.now() - chatMessage.timestamp < 1800000) {
            //  update HTML elements.
            var chatDisplay = chatMessage.sender + ' : ' + chatMessage.message + '&#13;&#10;';
            $(".chat-display").append(chatDisplay);
            scrollToBottom();
        }
    });
   
    database.ref("/players/").on("child_removed", function (snapshot) {

        // Send a message to chat 
        var msg = snapshot.val().name + " has disconnected!";

        // Get a key for the disconnection chat entry
        var chatKey = database.ref().child("/chat/").push().key;

        // Save the disconnection chat entry
        database.ref("/chat/" + chatKey).set(msg);

        // Updatec chat
        var chatDisplay = msg + '&#13;&#10;';
        $(".chat-display").append(chatDisplay);
        scrollToBottom();

        // Signal turn to stop
        database.ref().child("/turn/").set('stop');
    });
   
    $(".chat-display").change(function () {
        scrollToBottom();
    });
  

    // Function to scroll to the bottom of the chat box
    var messages = $('.chat-display');
    function scrollToBottom() {
        messages[0].scrollTop = messages[0].scrollHeight;
    };
   
    $(".chat-display").keypress(function (e) {
        e.preventDefault();
    });
   

    // Scroll to the bottom of the chat box
    scrollToBottom();
