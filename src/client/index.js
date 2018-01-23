import angular from "angular";
import uirouter from "angular-ui-router";
import "bootstrap";

import angularGrowl from "angular-growl-v2-webpack";
import "angular-growl-v2-webpack/src/growl.css";

import "bootstrap/dist/css/bootstrap.min.css";
import angularUIBootstrap from "angular-ui-bootstrap";
import "angular-ui-bootstrap/dist/ui-bootstrap-csp.css";
import "font-awesome/css/font-awesome.min.css"
import "./main.css";

import ModalService from "./common/modal-service/ModalService";
import ModalController from "./common/modal-service/ModalController";
import APIService from "./common/APIService";
import NotificationService from "./common/NotificationService";
import HeaderController from "./common/HeaderController";
import UserService from "./users/UserService";
import usersComponent from "./users/usersComponent";
import UsersController from "./users/UsersController";
import LotService from "./lots/LotService";
import VersionService from "./versions/VersionService";
import lotsComponent from "./lots/lotsComponent";
import LotsController from "./lots/LotsController";
import LotController from "./lots/LotController";
import VersionController from "./versions/VersionController";
import NewVersionModalController from "./versions/NewVersionModalController";

import routes from './routes'

angular.module("carpenterjs", [uirouter, angularUIBootstrap, angularGrowl])
    .service("APIService", APIService)
    .service("ModalService", ModalService)
    .service("NotificationService", NotificationService)
    .service("UserService", UserService)
    .service("LotService", LotService)
    .service("VersionService", VersionService)

    .controller("ModalController", ModalController)
    .controller("HeaderController", HeaderController)
    .controller("UsersController", UsersController)
    .controller("LotsController", LotsController)
    .controller("LotController", LotController)
    .controller("VersionController", VersionController)
    .controller("NewVersionModalController", NewVersionModalController)

    .component("usersComponent", usersComponent)
    .component("lotsComponent", lotsComponent)

    .config(routes)

    .config(['growlProvider', function (growlProvider) {
        growlProvider.globalTimeToLive({ success: 5000, error: 5000, warning: 5000, info: 5000 });
        growlProvider.globalPosition("top-center");
        growlProvider.globalDisableCountDown(true);
    }]);