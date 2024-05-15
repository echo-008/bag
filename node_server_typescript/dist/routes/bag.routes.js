"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceRouter = void 0;
const express_1 = __importDefault(require("express"));
const CounterController_1 = require("../controller/CounterController");
const auth_controllers_1 = require("../controller/auth.controllers");
const CounterController_2 = require("../controller/CounterController");
const router = express_1.default.Router();
exports.DeviceRouter = router;
// router.get("/")
router.post("/registerNewDevice", CounterController_1.registerNewDevice);
router.put("/updateAvailableStock", CounterController_1.updateAvailableStock);
router.put("/updateMaxStock", CounterController_1.updateMaxStock);
router.get("/getMaxStock/:device_id", CounterController_1.getDeviceMaxStockById);
router.get("/getAllDeviceList", CounterController_1.getAllDeviceList);
router.post("/signupAdmin", auth_controllers_1.createAdmin);
router.post("/loginAdmin", auth_controllers_1.loginAdmin);
router.get("/getAllDeviceList", CounterController_1.getAllDeviceList);
router.post("/fetchSingleDeviceData", CounterController_2.fetchDeviceData);
