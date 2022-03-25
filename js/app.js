$(document).ready(function () {

    const firebaseURL = "https://seat-booking-5f1b9-default-rtdb.firebaseio.com/";
    const firebase = new Firebase(firebaseURL);
    const adminUsers = ["admin"];
    const numberOfRows = 5;
    const numberOfSeatsPerRow = 10;

    Login = function () {
        const groupId = $("#groupId").val();
        const seatResetElement = $("#resetSeat");
        seatResetElement.css('visibility', 'hidden');
        if(adminUsers.indexOf(groupId) > -1) {
            seatResetElement.css('visibility', 'visible');
        }
        $("#seatStructure").css('pointer-events', 'auto');
        $("h5").html(`Welcome ${groupId} <br/>You can start booking your seats.<br/>Click on your existing bookings to cancel them.`);
        $("#groupId, #loginBtn").prop("disabled", true);
        showSeats(groupId);
    };

    ResetBooking = function() {
        firebase.on('value', snapshot => {
            snapshot.forEach(child => {
                const childValues = child.val();
                const i = childValues.locX;
                const j = childValues.locY;
                firebase.child(`seat${i}${j}`).set({
                    vacancy: 0,
                    name: "",
                    locX: i,
                    locY: j
                });
            });
        });
        window.location.reload();
    }

    setupSeats();
    showSeats("");

    function setupSeats() {
        // 0 - unbooked seat
        // 1 - booked seat
        let contentString = "";
        // To load all the seats
        for (let i = 0; i < numberOfRows; i++) {
            contentString += "<div>"
            for (let j = 0; j < numberOfSeatsPerRow; j++) {
                contentString += "<img id='seat" + i + j + "' src='images/none.png' />";
            }
            contentString += "</div>";
        }
        $("#seats").html(contentString);

        for (let i = 0; i < numberOfRows; i++) {
            for (let j = 0; j < numberOfSeatsPerRow; j++) {
                $('#seats').on('click', '#seat' + i + j, function () {

                    let string = 'seat' + i + j;

                    if ($('#seat' + i + j).attr('src') == 'images/booked.png') {
                        // Do nothing
                    }
                    else if ($('#seat' + i + j).attr('src') == 'images/none.png') {
                        firebase.child(string).set({
                            vacancy: 1,
                            name: $("#groupId").val(),
                            locX: i,
                            locY: j
                        });
                    } else {
                        firebase.child(string).set({
                            vacancy: 0,
                            name: "",
                            locX: i,
                            locY: j
                        });
                    }
                });
            }
        }
    }

    function showSeats(username) {
        firebase.on("value", function (snapshot) {
            const allSeats = (snapshot.val());
            let userCounter = {};
            for (var key in allSeats) {
                let id = "#seat" + allSeats[key].locX + allSeats[key].locY;
                const seatName = allSeats[key].name;
                if(seatName) {
                    userCounter[seatName] = userCounter[seatName] ? userCounter[seatName] + 1 : 1;
                }
                $(id).attr('src', 'images/none.png');
                $(id).attr('style', "cursor: pointer");
                if(username) {
                    if (seatName == username && allSeats[key].vacancy == 1) {
                        $(id).attr('src', 'images/selected.png');
                        $(id).attr('style', "cursor: pointer");
                    }
                    else if (seatName != username && allSeats[key].vacancy == 1) {
                        $(id).attr('src', 'images/booked.png');
                        $(id).attr('style', "cursor: default");
                        
                    }
                } else {
                    if (allSeats[key].vacancy == 1) {
                        $(id).attr('src', 'images/booked.png');
                        $(id).attr('title', seatName);
                    }
                }
                
            }
            let statsText = "";
            $.each(userCounter, function(index,value){
                statsText += `${index} booked ${value} seats <br/>`;
            })
            const statsElement = $("#seatStats");
            if(statsText) {
                statsElement.html(statsText);
            } else {
                statsElement.text("No bookings");
            }
        });
    }
});


