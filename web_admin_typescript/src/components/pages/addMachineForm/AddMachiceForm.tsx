import React, { KeyboardEvent, useCallback, useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import {
  Alert,
  Card,
  CardBody,
  CardHeader,
  Popover,
  PopoverContent,
  PopoverHandler,
  Typography,
  Button,
} from "@material-tailwind/react";
import { AddMachineFormInterface } from "../../../@types/interface/addMachine/AddMachineFormInterface";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import {
  getArrayOfMarket,
  postRegisterMachine,
} from "../../../utils/apis/Apis";
import useDebounce from "../../../customHooks/useDebounce";

// Debounce utility function

const AddMachineForm = () => {
  const [formData, setFormData] = useState<AddMachineFormInterface | null>({
    deviceId: "",
    address: "",
    machine_contact_number: "",
  });
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [isSave, setIsSave] = useState<Number | null>(null);
  const [suggestions, setSuggestions] = useState([]);
  const [marketName, setMarketName] = useState("");
  const { debouncedValue } = useDebounce(marketName, 1000);

  const getInitialInstances = useCallback(
    async (_searchString: string) => {
      try {
        console.log(debouncedValue, marketName);
        if (marketName) {
          const queryCall = await getArrayOfMarket(debouncedValue);
          if (!queryCall) {
            setSuggestions([]);
          } else {
            setSuggestions(queryCall.data.result);
          }
        } else {
          setSuggestions([]);
        }
        // setSuggestions();
      } catch (error) {
        alert("Something went wrong!");
      }
    },
    [debouncedValue, marketName]
  );

  // Update suggestions on input change
  const handleAutocompleteInputChange = useCallback((event: any) => {
    const value = event.target.value;
    setMarketName(value);
  }, []);

  // Handle suggestion click to update input value and hide suggestions
  const handleSuggestionClick = (suggestion: any) => {
    setMarketName(suggestion);
    setSuggestions([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOnSubmit = async () => {
    // event.preventDefault();
    const formattedDate = date ? format(date, "dd/MM/yyyy") : "";
    const { deviceId, address, machine_contact_number }: any = formData;
    try {
      console.log(formattedDate);
      const response = await postRegisterMachine(
        deviceId,
        address,
        formattedDate,
        machine_contact_number,
        marketName
      );
      if (response.status === 201) {
        setIsSave(1);
        setFormData({ deviceId: "", address: "", machine_contact_number: "" });
        setMarketName("");
        setSuggestions([]);
        setDate(undefined);
      }
    } catch (error) {
      setIsSave(2);
      setFormData({ deviceId: "", address: "", machine_contact_number: "" });
      setMarketName("");
      setSuggestions([]);
      setDate(undefined);
    }
  };

  useEffect(() => {
    if (debouncedValue) getInitialInstances(debouncedValue);
  }, [debouncedValue, getInitialInstances]);

  useEffect(() => {
    let timeout: any;
    if (isSave !== null) {
      timeout = setTimeout(() => {
        setIsSave(null);
      }, 2500);
    }
    return () => clearTimeout(timeout);
  }, [isSave]);

  return (
    <Layout>
      <div className="">
        {isSave === 1 ? (
          <Alert className="rounded-none" color="green">
            Device register successfully
          </Alert>
        ) : isSave === 2 ? (
          <Alert className="rounded-none" color="red">
            Data not saved! Something went wrong
          </Alert>
        ) : null}
      </div>
      <Card color="transparent" shadow={false} className="h-full w-full">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none text-left mb-5"
        >
          <Typography variant="h5" color="green" className="mx-2">
            Register Vending Machine
          </Typography>
          <Typography color="blue-gray" className="mt-1 mx-2 font-normal">
            Please enter machine details
          </Typography>
        </CardHeader>
        <CardBody className="border text-left">
          <div className=" mb-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="mb-1 flex-column  gap-6">
                <Typography
                  variant="h6"
                  color="blue-gray"
                  className="mb-3 text-left"
                >
                  Device ID<span style={{ color: "red" }}>*</span>
                </Typography>
                <input
                  name="deviceId"
                  type="text"
                  value={formData?.deviceId}
                  onChange={handleInputChange}
                  required
                  className="w-full text-sm border border-gray-300 px-4 py-3 rounded-md outline-[#333]"
                  placeholder="Please enter valid Device ID"
                />
              </div>
              <div className="mb-1 flex-column  gap-6">
                <Typography
                  variant="h6"
                  color="blue-gray"
                  className="mb-3 text-left"
                >
                  Machine Phone Number<span style={{ color: "red" }}>*</span>
                </Typography>
                <input
                  name="machine_contact_number"
                  type="tel"
                  value={formData?.machine_contact_number}
                  onChange={handleInputChange}
                  required
                  className="w-full text-sm border border-gray-300 px-4 py-3 rounded-md outline-[#333]"
                  placeholder="Please enter machine phone number"
                  minLength={10}
                  maxLength={10}
                />
              </div>
              <div className="mb-1 flex-column gap-6">
                <Typography
                  variant="h6"
                  color="blue-gray"
                  className="mb-3 text-left"
                >
                  Date<span style={{ color: "red" }}>*</span>
                </Typography>
                {/* <input
                  className="w-full text-sm border border-gray-300 px-4 py-3 rounded-md outline-[#333]"
                  type="date"
                  name="date"
                  max={new Date()}
                /> */}
                <div>
                  <Popover placement="bottom">
                    <PopoverHandler>
                      <input
                        onChange={() => null}
                        value={date ? format(date, "dd/MM/yyyy") : ""}
                        className="w-full text-sm border border-gray-300 px-4 py-3 rounded-md outline-[#333]"
                        placeholder="Please select date"
                        name="date"
                        required
                      />
                    </PopoverHandler>
                    <PopoverContent>
                      <DayPicker
                        month={new Date()}
                        toDate={new Date()}
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        showOutsideDays
                        className="border-0"
                        classNames={{
                          caption:
                            "flex justify-center py-2 mb-4 relative items-center",
                          caption_label: "text-sm font-medium text-gray-900",
                          nav: "flex items-center",
                          nav_button:
                            "h-6 w-6 bg-transparent hover:bg-blue-gray-50 p-1 rounded-md transition-colors duration-300",
                          nav_button_previous: "absolute left-1.5",
                          nav_button_next: "absolute right-1.5",
                          table: "w-full border-collapse",
                          head_row: "flex font-medium text-gray-900",
                          head_cell: "m-0.5 w-9 font-normal text-sm",
                          row: "flex w-full mt-2",
                          cell: "text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                          day: "h-9 w-9 p-0 font-normal",
                          day_range_end: "day-range-end",
                          day_selected:
                            "rounded-md bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white",
                          day_today: "rounded-md bg-gray-200 text-gray-900",
                          day_outside:
                            "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10",
                          day_disabled: "text-gray-500 opacity-50",
                          day_hidden: "invisible",
                        }}
                        components={{
                          IconLeft: ({ ...props }) => (
                            <ChevronLeftIcon
                              {...props}
                              className="h-4 w-4 stroke-2"
                            />
                          ),
                          IconRight: ({ ...props }) => (
                            <ChevronRightIcon
                              {...props}
                              className="h-4 w-4 stroke-2"
                            />
                          ),
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <div className="mb-1 flex-column  gap-6">
                <Typography
                  variant="h6"
                  color="blue-gray"
                  className="mb-3 text-left"
                >
                  Address<span style={{ color: "red" }}>*</span>
                </Typography>
                <input
                  name="address"
                  type="text"
                  value={formData?.address}
                  onChange={handleInputChange}
                  required
                  className="w-full text-sm border border-gray-300 px-4 py-3 rounded-md outline-[#333]"
                  placeholder="Please enter the address"
                />
              </div>
              <div className="mb-1 flex-column  gap-6">
                <div className="relative">
                  <Typography
                    variant="h6"
                    color="blue-gray"
                    className="mb-3 text-left"
                  >
                    Market
                  </Typography>
                  <input
                    name="market"
                    type="text"
                    value={marketName}
                    onChange={handleAutocompleteInputChange}
                    // required
                    className="w-full text-sm border border-gray-300 px-4 py-3 rounded-md outline-[#333]"
                    placeholder="Please type the market name if applicable"
                    autoComplete="off"
                  />
                  {suggestions?.length > 0 && (
                    <ul
                      id="autocomplete-suggestions"
                      className="absolute top-full left-0 w-full max-h-48 bg-white rounded-md shadow-md overflow-y-auto z-50"
                    >
                      {suggestions.map((suggestion) => (
                        <li
                          key={suggestion}
                          className="p-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            <Button
              className="text-center md:text-left mt-6 md:mt-3 w-full md:w-auto "
              onClick={handleOnSubmit}
              disabled={
                formData?.deviceId &&
                formData?.address &&
                formData?.machine_contact_number &&
                date
                  ? false
                  : true
              }
            >
              Submit
            </Button>
          </div>
        </CardBody>
      </Card>
    </Layout>
  );
};

export default AddMachineForm;
