// Firebase Configuration
// Initialize Firebase
const config = {
  apiKey: "AIzaSyCmbRr9q2V-eUyJ7WiM-RJLsW0QmIEpOOM",
  authDomain: "classwork-29b93.firebaseapp.com",
  databaseURL: "https://classwork-29b93.firebaseio.com",
  projectId: "classwork-29b93",
  storageBucket: "classwork-29b93.appspot.com",
  messagingSenderId: "667186043094"
};

firebase.initializeApp(config);

// Create a variable to reference the database;
const database = firebase.database();

// Form Variables
let trainName = "";
let destination = "";
let firstTrain = "";
let freq = "";

// Calculate Next Arrival Time
function calcNextArrival(first, freqy) {
  let now = moment().format('HH:mm');
  now = moment(now, 'HH:mm');
  first = moment(first, 'HH:mm');
  let duration = moment.duration(now.diff(first));
  duration = parseInt(duration.asMinutes());
  let minutesAway = duration % freqy;
  let nextArrival = moment().add(minutesAway, 'm');
  return [nextArrival, minutesAway];
}

// Extract form info
function getTrainInfo() {
  // Train Name
  trainName = $("#trainName").val().trim();

  // Train Destination
  destination = $("#destination").val().trim();

  // First Train Time
  firstTrain = $("#firstTrain").val().trim();

  // Frequency
  freq = $("#frequency").val().trim();
}

// Display Train
function displayTrain(snap, i) {
  // Set unique id for table row
  let rowId = `trainRow${i}`;

  // Create table row
  let detail = $("<tr>");
  detail.addClass(rowId);
  $(".tableBody").append(detail);

  // Create Columns
  // Train Name
  let detail2 = `<td>${snap.trainName}</td>`;

  // Destination
  detail2 += `<td>${snap.destination}</td>`;

  // Frequency
  detail2 += `<td>${snap.frequency}</td>`

  // get firstTrain, freq
  let first = snap.firstTrain;
  let freqy = snap.frequency;
  let results = calcNextArrival(first, freqy);
  let next = moment(results[0]).format('HH:mm');
  detail2 += `<td>${next}</td>`

  let away = results[1];
  detail2 += `<td>${away}</td>`

  // Append detail to row
  $("." + rowId).append(detail2);
}

// Store train info in firebase
function storeTrainInfo() {
  database.ref("/trainData").push({
     trainName: trainName
    ,destination: destination
    ,firstTrain: firstTrain
    ,frequency: freq
  })
}

function resetDataEntry() {
  $("#trainName").val("");
  $("#destination").val("");
  $("#firstTrain").val("");
  $("#frequency").val("");
}

// Firebase watcher + initial loader
database.ref("/trainData").on("value", function(snapshot) {
  // Empty table
  $(".tableBody").empty();

  // Log everything that's coming out of snapshot
  let snap = snapshot.val();
  let i = 1;

  for (train in snap) {
    displayTrain(snap[train], i++);
  };
  
  // Handle the errors
}, function(errorObject) {
  console.log(`Errors handled: ${errorObject.code}`);
});

// Capture train information
$("#addTrain").on("click", function(event) {
  // Prevent the page from refreshing
  event.preventDefault();

  // Extract data from form
  getTrainInfo();

  // Store form data
  storeTrainInfo();

  // Reset form
  resetDataEntry();
})
