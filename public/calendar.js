$(function () {

    function buildModalWindow(
        title, category, deadline, user, memo
    ) {
        $('#modal-title').html(title);
        $('#modal-category').html(category);
        $('#modal-deadline').html(deadline);
        $('#modal-user').html(user);
        $('#modal-memo').html(memo);
    }

    function openModalWindow(title) {
        $("#modal-window").dialog({
            modal: true,
            title: "TASK",
            position: { my: "center center" },
            width: 600,
            buttons: {
                "Close": function() {
                    $(this).dialog("close");
                }
            }
        });
    }

    function buildCalendar(events) {
        $("#calendar").fullCalendar({
            events: events,
            eventClick: function(event) {
                var date = event.start ? event.start : event.start.toDateString();
                console.log(event.start)
                buildModalWindow(
                    event.name,
                    event.category,
                    event.start._i,
                    event.user,
                    event.memo
                );
                openModalWindow();
            }

        });
    }

    function getEvents() {
        console.log("events")
        $.get("/tickets/", function(result) {
            var events = [];
            for(k in Object.keys(result)) {
                if (result[k].deadline !== undefined &&
                    result[k].status != "archive") {
                    events.push({
                        "id" : result[k]._id,
                        "title": "[" + result[k].category + "] " + result[k].name,
                        "name": result[k].name,
                        "start": result[k].deadline.substring(0,10),
                        "user": result[k].user,
                        "category": result[k].category,
                        "memo": result[k].memo
                    });
                }
            }
            buildCalendar(events)
            $('#calendar').fullCalendar( 'removeEvents' );
            $('#calendar').fullCalendar( 'addEventSource', events);
            $('#calendar').fullCalendar( 'rerenderEvents' );
        });
    }

    $("#reload").on('click',function() {
        getEvents();
    });

    $("#open-modal").on('click', function() {
        openModalWindow("TESTTITLE");
    });

    getEvents();
});
 
