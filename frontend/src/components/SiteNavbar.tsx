import React, { Component } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import authService from "../services/auth.service";

type Props = {
  url: String;
};

type State = {
  loggedIn: boolean;
};

export default class SiteNavbar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      loggedIn: authService.getCurrentUser() ? true : false,
    };
  }

  logout() {
    authService.logout();
    this.setState({ loggedIn: false });
  }

  render() {
    return (
      <Navbar bg='light' expand='lg'>
        <Container>
          <Navbar.Brand href='/'>DDueruem</Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='me-auto'>
              <Nav.Link
                className={this.props.url === "/" ? "active" : ""}
                href='/'
              >
                Home
              </Nav.Link>
              {!this.state.loggedIn && (
                <Nav.Link
                  href='/register'
                  className={this.props.url === "/register" ? "active" : ""}
                >
                  Register
                </Nav.Link>
              )}

              {!this.state.loggedIn && (
                <Nav.Link
                  href='/login'
                  className={this.props.url === "/login" ? "active" : ""}
                >
                  Login
                </Nav.Link>
              )}

              {this.state.loggedIn && (
                <Nav.Link
                  href='/profile'
                  className={this.props.url === "/profile" ? "active" : ""}
                >
                  Profile
                </Nav.Link>
              )}

              {this.state.loggedIn && (
                <Nav.Link
                  href='/logout'
                  className={this.props.url === "/logout" ? "active" : ""}
                  onClick={this.logout}
                >
                  Logout
                </Nav.Link>
              )}

              {this.state.loggedIn && (
                <Nav.Link
                  href='/upload'
                  className={this.props.url === "/upload" ? "active" : ""}
                >
                  Upload
                </Nav.Link>
              )}

              <NavDropdown title='Dropdown' id='basic-nav-dropdown'>
                <NavDropdown.Item href='#action/3.1'>Dummy</NavDropdown.Item>
                <NavDropdown.Item href='#action/3.2'>
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href='#action/3.3'>
                  Something
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href='#action/3.4'>
                  Separated link
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}
