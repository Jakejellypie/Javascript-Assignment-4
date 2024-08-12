// The API key for APOD API and Chuck Norris API
const chuckNorrisApiKey = "dnFCPeqN0kFxtvzrWdyYxw==VqS0qmMLfsCsiqey";
const apodApiKey = "HYr57tkJZdIWKXaHSLT29NceSghNmYqC46yZrPuC";

//URI for both the APIs
const chuckNorrisUri = "https://api.api-ninjas.com/v1/chucknorris";
//the uri for ApodAPI is built on line 74.

// Creating variables for HTML elements

//represents the date Input
const dateBar = document.querySelector(".dateBar");
//represents the button the user will press after chosing their desired start date.
const searchButton = document.querySelector(".searchButton");
//contains the container for the images that will be received from the APOD API
const imageContainer = document.querySelector(".imageContainer");

//below 3 are all the modal variables.
const modal = document.getElementById("imageModal");
const modalDescription = document.getElementById("modalDescription");
const closeButton = document.getElementsByClassName("close")[0];

//This is the audio file for the audio I wish to play whenever the user presses the button associated with the image
//obtained from the APOD API
const chuckNorrisAudio = document.getElementById("chuckNorrisAudio");
//this is the ul element of the html file that will contain the li items built from json responses of the ChuckNorris API.
const jokeDomList = document.getElementById("jokeDomList");

/**
 * Creates a function that returns the String (YYYY-MM-DD) representation of a date.
 * @param {Date} givenDate - Any date object.
 * @return {string} - The string representation of the given date in YYYY-MM-DD format.
 */
function stringDateGiver(givenDate) {
    // Retrieve Year, Month, and Day from the given date
    let givenDateYear = String(givenDate.getFullYear());
    // Use padStart to ensure two-digit month and day values
    let givenDateMonth = String(givenDate.getMonth() + 1).padStart(2, "0");
    let givenDateDay = String(givenDate.getDate()).padStart(2, "0");

    let stringDate = `${givenDateYear}-${givenDateMonth}-${givenDateDay}`;
    return stringDate;
}

// Create a Date object for the current date
const today = new Date();
const currentDate = stringDateGiver(today);
// Set today's date as the maximum value for the date input
dateBar.max = currentDate;
// Set the minimum date to the API's minimum date
const minDate = "1995-06-16";
dateBar.min = minDate;
// Set a default value for the date input
const defaultValue = "YYYY-MM-DD";
dateBar.value = defaultValue;

searchButton.addEventListener("click", () => {
    let chosenDateVal = dateBar.value;

    // Check if chosenDateVal is not an empty string
    if (chosenDateVal) {

        // Set the startDate for the API request
        let startDate = chosenDateVal;
        // Create a Date object from the startDate
        let startDateObj = new Date(startDate);
        // Create an endDate which is 5 days from the startDate
        let endDateObj = new Date(startDateObj);
        endDateObj.setDate(startDateObj.getDate() + 5);
        let endDate = stringDateGiver(endDateObj);

        // Ensure the endDate does not exceed the current date
        if (endDateObj >= today) {
            endDateObj = new Date(today);
            startDate = stringDateGiver(startDateObj);
            endDate = stringDateGiver(endDateObj);
        }
        // Build the URI for the APOD API request
        let apodUri = `https://api.nasa.gov/planetary/apod?api_key=${apodApiKey}&start_date=${startDate}&end_date=${endDate}`;

        // Create an array to store image URLs from the API response
        const imageArray = [];

        // Fetch data from the API
        fetch(apodUri)
            .then(response => response.json())  // Convert the response to JSON
            .then(dataArray => {
                // Iterate over the data array to find image URLs
                dataArray.forEach(data => {
                    if (data.media_type === 'image' && data.hdurl) {
                        // Add image URL to the imageArray
                        imageArray.push(data.hdurl);
                    } else {
                        console.log(`No HD URL for ${data.date} as the media type is ${data.media_type}.`);
                    }
                });
                // Call the imageSetter function to display images
                imageSetter(imageArray);
            })
            .catch(error => console.error('Error:', error));  // Handle any errors

        /**
         * Creates div elements containing images and buttons, and appends them to the DOM.
         * @param {Array} imageArray - Array of image URLs.
         */
        function imageSetter(imageArray) {
            // Clear previous images and buttons
            imageContainer.innerHTML = '';

            imageArray.forEach((image) => {
                // Create a new div for each image
                const imageDiv = document.createElement('div');
                imageDiv.classList.add('imageSet');

                // Create an img element for the image
                const imageElement = document.createElement('img');
                imageElement.src = image;
                imageElement.classList.add("newImageEntry");

                // Create a button for the image
                const imageButton = document.createElement('button');
                imageButton.classList.add("imageButton");
                imageButton.textContent = "Click Me"; // Add text to the button

                // Append the img and button to the imageDiv
                imageDiv.appendChild(imageElement);
                imageDiv.appendChild(imageButton);

                // Append the imageDiv to the imageContainer
                imageContainer.appendChild(imageDiv);

                // Add click event listener to the button
                imageButton.addEventListener('click', async () => {
                    chuckNorrisAudio.play();
                    // Create an array to store Chuck Norris jokes
                    const jokeArray = [];

                    // Fetch jokes from the Chuck Norris API
                    for (let i = 0; i < 3; i++) {
                        const response = await fetch(chuckNorrisUri, {
                            method: "GET",
                            headers: {
                                'X-Api-Key': `${chuckNorrisApiKey}`,
                                'Content-Type': 'application/json'
                            }
                        });
                        const data = await response.json();
                        jokeArray.push(data.joke);
                    }

                    // Display the modal
                    modal.style.display = "block";
                    closeButton.onclick = function () {
                        modal.style.display = "none";
                    };

                    // Clear previous jokes from the list
                    while (jokeDomList.firstChild) {
                        jokeDomList.removeChild(jokeDomList.firstChild);
                    }

                    // Add new jokes to the list
                    jokeArray.forEach((joke) => {
                        let listItem = document.createElement("li");
                        listItem.textContent = joke;
                        jokeDomList.appendChild(listItem);
                        listItem.classList.add("jokeLiClass");
                        console.log(jokeDomList.childElementCount);
                    });
                });
            });
        };

    } else {
        alert("Invalid value");
    }
});
