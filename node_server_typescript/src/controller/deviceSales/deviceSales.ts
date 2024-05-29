import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import DeviceModel from "../../model/deviceSchema";
import { MESSAGE } from "../../constants/message";
import { getYesterdayDate } from "../../services/date/date.service";

export const getDeviceData = async (req: Request, res: Response) => {
  try {
    const deviceData = await DeviceModel.aggregate([
      {
        $facet: {
          totalDevices: [
            {
              $count: "totalDevices",
            },
          ],
          devicesWithZeroStocks: [
            {
              $match: {
                available_stocks: 0,
              },
            },
            {
              $count: "devicesWithZeroStocks",
            },
          ],
          workingMachineCount: [
            {
              $match: {
                date: getYesterdayDate(),
              },
            },
            {
              $count: "workingMachineCount",
            },
          ],
        },
      },
    ]);

    const response = {
      totalDevices: deviceData[0].totalDevices[0]?.totalDevices || 0,
      devicesWithZeroStocks:
        deviceData[0].devicesWithZeroStocks[0]?.devicesWithZeroStocks || 0,
      totalWorkingMachines:
        deviceData[0].workingMachineCount[0]?.workingMachineCount || 0,
    };

    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    console.error("Error fetching device data:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: error,
    });
  }
};
