const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

let tickets = [];

const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

class Ticket {
  constructor(id, name, status) {
    this.id = id;
    this.name = name;
    this.status = status;
  }
}

class TicketFull extends Ticket {
  constructor(id, name, description, status) {
    super(id, name, status);
    this.description = description;
  }
}

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  const method = req.query.method;

  if (method === "allTickets") {
    const simplifiedTickets = tickets.map(
      ({ id, name, status }) => new Ticket(id, name, status)
    );
    res.json(simplifiedTickets);
  } else if (method === "ticketById") {
    const id = req.query.id;
    const ticket = tickets.find((t) => t.id === id);

    if (ticket) {
      const ticketFull = new TicketFull(
        ticket.id,
        ticket.name,
        ticket.description,
        ticket.status
      );
      res.json(ticketFull);
    } else {
      res.status(404).send();
    }
  } else {
    res.status(400).send("Invalid method");
  }
});

app.post("/", (req, res) => {
  const method = req.query.method;

  if (method === "createTicket") {
    const { name, description, status } = req.body;
    const newTicket = new Ticket(generateId(), name, status);
    tickets.push({ ...newTicket, description });
    res.json(newTicket);
  } else {
    res.status(400).send("Invalid method");
  }
});

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
