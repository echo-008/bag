"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchDeviceData = exports.updateMaxStock = exports.updateAvailableStock = exports.getDeviceMaxStockById = exports.getAllDeviceList = exports.registerNewDevice = void 0;
const deviceSchema_1 = __importDefault(require("../model/deviceSchema"));
const registerNewDevice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { device_id, stock, address, max_stocks, available_stocks, machine_contact_number } = req.body;
    if (!device_id || !stock) {
        res.status(422).json({
            message: "fields are empty"
        });
    }
    else {
        try {
            const isExist = yield deviceSchema_1.default.findOne({ device_id: device_id });
            if (isExist) {
                return res.status(409).json({
                    message: "Device Already exist",
                });
            }
            const payload = {
                available_stocks: stock,
                date: new Date().toDateString(),
                device_id: device_id,
                address: address,
                last_update: new Date(),
                max_stocks: stock,
                machine_contact_number: machine_contact_number
            };
            const response = yield new deviceSchema_1.default(payload).save();
            console.log(response);
            if (response) {
                return res.status(200).json({
                    message: "device register successfully",
                    result: response
                });
            }
        }
        catch (error) {
            return res.status(400).json({
                message: "error in server",
                error
            });
        }
    }
});
exports.registerNewDevice = registerNewDevice;
// export const getAllDeviceList = async (req: Request, res: Response) => {
//     try {
//         const response = await DeviceModel.find({});
//         if (response) {
//             return res.status(200).json({
//                 message: "device list get successfully",
//                 data: response
//             })
//         }
//     }
//     catch (error) {
//         return res.status(400).json({
//             message: "error in server",
//             error
//         })
//     }
// }
const getAllDeviceList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.query.page, req.query.perPageItem);
    try {
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const perPage = req.query.perPageItem ? parseInt(req.query.perPageItem, 10) : 10;
        if (isNaN(page) || isNaN(perPage) || page < 1 || perPage < 1) {
            return res.status(400).json({
                message: "Invalid page or perPageItem value"
            });
        }
        const skip = (page - 1) * perPage;
        const devices = yield deviceSchema_1.default.find({})
            .skip(skip)
            .limit(perPage);
        const totalDevices = yield deviceSchema_1.default.countDocuments({});
        const totalPages = Math.ceil(totalDevices / perPage);
        return res.status(200).json({
            message: "Device list fetched successfully",
            data: devices,
            currentPage: page,
            totalPages: totalPages
        });
    }
    catch (error) {
        console.error("Error in getAllDeviceList:", error);
        return res.status(500).json({
            message: "Error in server"
        });
    }
});
exports.getAllDeviceList = getAllDeviceList;
const getDeviceMaxStockById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { device_id } = req.params;
        const response = yield deviceSchema_1.default.findOne({ device_id: device_id }, { _id: 0, max_stocks: 1 });
        if (response) {
            return res.status(200).json({
                message: "device max stock get successfully",
                data: response
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            message: "error in server",
            error
        });
    }
});
exports.getDeviceMaxStockById = getDeviceMaxStockById;
const updateAvailableStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { device_id, available_stocks } = req.body;
        const response = yield deviceSchema_1.default.updateOne({ device_id: device_id }, {
            $set: {
                available_stocks: available_stocks,
                last_update: new Date()
            }
        });
        if (response) {
            return res.status(200).json({
                message: "data updated successfully",
                data: response
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            message: "error in server",
            error
        });
    }
});
exports.updateAvailableStock = updateAvailableStock;
const updateMaxStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { device_id, max_stocks } = req.body;
        const response = yield deviceSchema_1.default.updateOne({ device_id: device_id }, {
            $set: {
                max_stocks: max_stocks
            }
        });
        if (response) {
            return res.status(200).json({
                message: "data updated successfully",
                data: response
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            message: "error in server",
            error
        });
    }
});
exports.updateMaxStock = updateMaxStock;
/****************************** */
const fetchDeviceData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { device_id } = req.body;
    console.log(device_id);
    try {
        //send msg to the device
        //send device id as response
        // const response = {device_id: device_id};
        const response = yield deviceSchema_1.default.find({ device_id: device_id }).select("-__v");
        console.log(device_id);
        return res.status(200).json({
            message: "device id send",
            data: response
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "internal server error",
            error
        });
    }
});
exports.fetchDeviceData = fetchDeviceData;
