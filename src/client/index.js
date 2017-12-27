import angular from "angular";
import uirouter from "angular-ui-router";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import angularUIBootstrap from "angular-ui-bootstrap";
import "angular-ui-bootstrap/dist/ui-bootstrap-csp.css";
import "./main.css";

import APIService from "./common/APIService";
import UserService from "./users/UserService";
import usersComponent from "./users/usersComponent";
import UsersController from "./users/UsersController";

import routes from './routes'

angular.module("carpenterjs", [uirouter, angularUIBootstrap])
    .service("APIService", APIService)
    .service("UserService", UserService)
    .controller("UsersController", UsersController)
    .component("usersComponent", usersComponent)
    .config(routes);