document.addEventListener("DOMContentLoaded", function() {
    var loginButton = document.getElementById('loginButton');
    if(loginButton){
        loginButton.addEventListener('click', function(event) {
            login(event);
        });
    }


    var backButton = document.getElementById("back")

    if(backButton){
        backButton.addEventListener('click', function(event){
            window.location.href = 'index2.html';
        })
    }
    
});

document.addEventListener("DOMContentLoaded", function() {
    var loginButton = document.getElementById('createAccountButton');
    if(loginButton){
        loginButton.addEventListener('click', function(event) {
            event.preventDefault();
    
            create(event);
    
            // console.log("HHHA")
        });
    }
    
});

function create(event){

    event.preventDefault();

    // Get username and password input values
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    
    // Perform login validation or any other actions
    // For demonstration purposes, we'll just log the values to console
    console.log("Username: " + username);
    console.log("Password: " + password);


    creatAcc(username, password)

}


function login(event) {
    // Prevent default form submission behavior
    event.preventDefault();

    // Get username and password input values
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    
    // Perform login validation or any other actions
    // For demonstration purposes, we'll just log the values to console
    console.log("Username: " + username);
    console.log("Password: " + password);


    fetchData(username, password)
        // .then(function() {
        //     // Redirect only after fetchData is completed
        //     window.location.href = "startScreen.html";
        // })
        // .catch(function(error) {
        //     // Handle error if fetchData fails
        //     console.error("Error fetching data:", error);
        // });
}


async function fetchData(us, pa) {
    const url = 'https://us-east-1.aws.data.mongodb-api.com/app/application-1-xalnosd/endpoint/login';
    const data = {
      username: us,
      password: pa
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const responseData = await response.json();

      let str = JSON.stringify(responseData)

      str = encodeURIComponent(str)


      console.log(JSON.stringify(responseData));
      window.location.href = "startScreen.html?data=" + str;

      // localStorage.setItem('myData', responseData);
      // return Promise.resolve();
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      // return Promise.reject(error);
    }
}

async function creatAcc(us, pa) {
    const url = 'https://us-east-1.aws.data.mongodb-api.com/app/application-1-xalnosd/endpoint/person';
    const data = {
      username: us,
      password: pa
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const responseData = await response.json();
      console.log(responseData);


      if(responseData == "I made it"){
        window.location.href = 'index2.html';
      }
  
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
}
  
  
