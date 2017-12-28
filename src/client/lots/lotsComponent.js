import LotsController from "./LotsController";

export default {
    template: require("./lots.html"),
    controller: LotsController,
    bindings: {
        lots: "="
    }
}