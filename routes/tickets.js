var express = require('express');
var router = express.Router();
var Ticket = require('../models/ticket');
var Board = require('../models/board');
var Log = require('../models/log');
var http = require('http');

router.get('/', function (req, res) {
    Ticket.find({}, function (err, ticket) {
        if (err) {
            res.send(err);
            return
        }
        res.json(ticket);
    });
});

router.post('/', function (req, res) {
    if(req.body.deadline !== undefined) {
        var arr_d = req.body.deadline.split('-');
        var deadline = new Date(arr_d[0], arr_d[1]-1, arr_d[2],9,0,0)
    }
    var ticket = new Ticket();
    ticket.name = req.body.name;
    ticket.user = req.body.user;
    ticket.status = req.body.status;
    ticket.memo = req.body.memo;
    ticket.sprint = req.body.sprint;
    ticket.board = req.body.board;
    ticket.icon = "slime";
    ticket.category = req.body.category;
    ticket.deadline = deadline;
    ticket.save(function (err) {
        if (err) {
            res.send(err);
        }

        var log = new Log();
        log.action = "create";
        log.name = ticket.name;
        log.user = ticket.user;
        log.status = ticket.status;
        log.memo = ticket.memo;
        log.sprint = ticket.sprint;
        log.icon = ticket.icon;
        log.category = req.body.category;
        log.deadline = deadline;
        log.save(function (err) {
            if (err) {
                res.send(err);
                return;
            }
            res.json({
                message: "Saved."
            });
        });
    });
});

router.get('/:tid', function (req, res) {
    Ticket.findById(req.params.tid, function (err, ticket) {
        if (err) {
            res.send(err);
            return;
        }
        res.json(ticket);
    });
});


router.put('/:tid', function (req, res) {
    Ticket.findById(req.params.tid, function (err, ticket) {
        if (err) {
            res.send(err);
            return;
        }
        if(req.body.deadline !== undefined) {
            var arr_d = req.body.deadline.split('-');
            var deadline = new Date(arr_d[0], arr_d[1]-1, arr_d[2],9,0,0)
        }

        ticket.name = req.body.name ? req.body.name : ticket.name;
        ticket.user = req.body.user ? req.body.user : ticket.user;
        ticket.status = req.body.status ? req.body.status : ticket.status;
        ticket.memo = req.body.memo ? req.body.memo : ticket.memo;
        ticket.sprint = req.body.sprint ? req.body.sprint : ticket.sprint;
        ticket.icon = req.body.icon ? req.body.icon : ticket.icon;
        ticket.category = req.body.category ? req.body.category : ticket.category;
        ticket.deadline = deadline ? deadline : ticket.deadline;

        console.log(ticket);
        ticket.save(function (err) {
            if (err) {
                res.send(err);
                return;
            }
            var log = new Log();
            log.action = "update";
            log.name = ticket.name;
            log.user = ticket.user;
            log.status = ticket.status;
            log.memo = ticket.memo;
            log.sprint = ticket.sprint;
            log.icon = ticket.icon;
            log.category = req.body.category;
            log.deadline = deadline;
            log.save(function (err) {
                if (err) {
                    res.send(err);
                    return;
                }
                res.json({
                    message: "Updated."
                });
            });
        });
    });
});

router.delete('/:tid', function (req, res) {
    Ticket.remove({
            _id: req.params.tid
        },
        function (err) {
            if (err) {
                res.send(err);
                return
            }
            res.json({
                message: "Item deleted."
            });
        }
    );
});


module.exports = router;
