$(document).ready(function () {

    const firebaseURL = "https://seat-booking-5f1b9-default-rtdb.firebaseio.com/";

    const firebase = new Firebase(firebaseURL);

    const adminUsers = ["admin"];

    Login = function () {

        var username = $("#emailId").val();

        if(!username){
            alert("Please enter name!!");
            return;
        }

        $("#resetSeat").css('visibility', 'hidden');
        if(adminUsers.indexOf(username) > -1) {
            $("#resetSeat").css('visibility', 'visible');
        }
        $("#seatStructure").css('pointer-events', 'auto');
        $("h3").text(`Welcome ${username}`);
        showSeats(username);
    };

    ResetBooking = function() {
        firebase.remove();
        window.location.reload();
    }


    setupSeats();
    showSeats("");


    function setupSeats() {
        // 0 - unbooked seat
        // 1 - booked seat
        let contentString = "";
        // To load all the seats
        for (let i = 0; i < 5; i++) {
            contentString += "<div>"
            for (let j = 0; j < 10; j++) {
                contentString += "<img id='seat" + i + j + "' src='images/none.png' />";
            }
            contentString += "</div>";
        }
        $("#seats").html(contentString);

        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                $('#seats').on('click', '#seat' + i + j, function () {

                    let string = 'seat' + i + j;

                    if ($('#seat' + i + j).attr('src') == 'images/booked.png') {
                        // Do nothing
                    }
                    else if ($('#seat' + i + j).attr('src') == 'images/none.png') {
                        firebase.child(string).set({
                            vacancy: 1,
                            name: $("#emailId").val(),
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
            for (var key in allSeats) {

                let id = "#seat" + allSeats[key].locX + allSeats[key].locY;
                const seatName = allSeats[key].name;

                if(username) {
                    $(id).attr('src', 'images/none.png');
                    $(id).attr('style', "cursor: pointer");
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
        });
    }
});


