import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomeRoute, OpenTicketRoute } from "./pages";
import { Nav, Navbar } from "react-bootstrap";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Navbar bg="light" expand="md">
        <Navbar.Brand href="/">WolfDesk</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/open-ticket">Open Ticket</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes>
        <Route path="/" Component={HomeRoute} />
        <Route path="/open-ticket" Component={OpenTicketRoute} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
