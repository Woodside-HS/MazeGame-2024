document.addEventListener('DOMContentLoaded', function() {
    // Get the button element by its id
    var startButton = document.getElementById('start');
    var notButton = document.getElementById('start2');
    
    if(startButton){
 // Add a click event listener to the start button
 startButton.addEventListener('click', function() {
    // Print something to the console when the button is clicked
    console.log("Start button clicked!");

    var urlParams = new URLSearchParams(window.location.search);
    var data = urlParams.get('data');
    console.log(data); 

    let str = encodeURIComponent(data)

    window.location.href = "instructions.html?data=" + str;
});
    }
   
    if(notButton){
        notButton.addEventListener('click', function() {
            // Print something to the console when the button is clicked
            console.log("Start button clicked!");
    
            var urlParams = new URLSearchParams(window.location.search);
            var data = urlParams.get('data');
            console.log(data); 
    
            let str = encodeURIComponent(data)
    
            window.location.href = "difficulty.html?data=" + str;
        });
    }
    
});