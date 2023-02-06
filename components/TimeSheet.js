// import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import DropdownButton from "./DropdownButton";
import axios from "axios";

const CLIENT_ID =
  "543046022995-l6bsm3dead1il1g2mja6rtu92ap33bm3.apps.googleusercontent.com";
const SCOPES =
  "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function TimeSheet({ fs }) {
  const [user, setUser] = useState({});
  const [tokenClient, setTokenClient] = useState({});
  const [access, setAccess] = useState("");
  const [data, setData] = useState("");
  const [titlename, setTitlename] = useState("venuSheet");

  const [sheetDetails, setSheetDetails] = useState("");
  const [dates, setDates] = useState("");
  const [biodata, setBiodata] = useState([]);
  const [objectData, setObjectData] = useState("");

  const [value, setValue] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isopen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  function handleCallbackResponse(response) {
    var userObject = jwt_decode(response.credential);
    // console.log(userObject)
    setUser(userObject);
    document.getElementById("signInDiv").hidden = true;
  }

  function handleSignOut(event) {
    setUser({});
    document.getElementById("signInDiv").hidden = false;
  }

  function createDriveFile(e) {
    setShowForm(true);
    e.preventDefault();
    tokenClient.requestAccessToken();
  }

  function getAllDaysInMonth(year, month) {
    const date = new Date(year, month, 1);

    const dates = [];

    while (date.getMonth() === month) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return dates;
  }

  const now = new Date();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const submitHandler = (e) => {
    e.preventDefault();
    if (
      e.target.EmpID.value == "" &&
      e.target.Name.value == "" &&
      e.target.Designation.value == "" &&
      e.target.Location.value == "" &&
      e.target.BillingStartDate.value == "" &&
      e.target.Contact.value == "" &&
      e.target.Company.value == "" &&
      e.target.Client.value == ""
    ) {
      alert("Please add details");
    } else {
      let oldSheetData = [...sheetDetails];
      let newData = {
        EmpID: e.target.EmpID.value,
        Name: e.target.Name.value,
        Designation: e.target.Designation.value,
        Location: e.target.Location.value,
        BillingStartDate: e.target.BillingStartDate.value,
        Contact: e.target.Contact.value,
        Company: e.target.Company.value,
        Client: e.target.Client.value,
      };

      axios
        .post("/api/details", newData)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
      oldSheetData.push(newData);
      // fs.writeFile("../sourcedata.json", JSON.stringify(newData), (err) => {
      //   if (err) console.log("Error writing file:", err);
      // });
      setSheetDetails(oldSheetData);
      // submitDetail();
      alert("Details added succesfully");
      e.target.EmpID.value = "";
      e.target.Name.value = "";
      e.target.Designation.value = "";
      e.target.Location.value = "";
      e.target.BillingStartDate.value = "";
      e.target.Contact.value = "";
      e.target.Company.value = "";
      e.target.Client.value = "";
    }
  };
  // console.log("sheet details:", sheetDetails);

  // const fetchDetails = async () => {
  //   const response = await fetch("/api/details");
  //   const bio = await response.json();
  //   setBiodata(bio);
  // };

  // console.log(biodata);

  // const submitDetail = async () => {
  //   const response = await fetch("/api/details", {
  //     method: "POST",
  //     body: JSON.stringify({objectData}),
  //     headers: {
  //       "Content-type": "application/json",
  //     },
  //   });
  //   const bio = await response.json();
  //   console.log(bio);
  // };

  useEffect(() => {
    const google = window.google;
    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });

    // fetchDetails();

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentMonthName = monthNames[currentMonth];
    const currentYear = currentDate.getFullYear();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    // console.log(daysInMonth);
    const datesInMonth = [
      ...getAllDaysInMonth(now.getFullYear(), now.getMonth()).map((item) => {
        const currentDate = new Date(item);
        return `${currentDate.getDate()}-${
          months[currentDate.getMonth()]
        }-${String(currentDate.getYear()).slice(1)}`;
      }),
    ];
    // console.log(datesInMonth);
    const startDate = datesInMonth.slice(0, 1);
    const endDate = datesInMonth.slice(-1);

    // console.log(currentMonthName, currentYear);

    setTokenClient(
      google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse) => {
          // console.log(tokenResponse.access_token);
          const accessToken = tokenResponse.access_token;
          // console.log(titlename)
          // console.log(accessToken)
          setAccess(accessToken);
          localStorage.setItem("accesstoken", accessToken);

          // sheetDetails.forEach(item => {

          // })

          const sheetData = {
            properties: {
              title: `TimeSheet_${value}_${currentMonthName}_${currentYear}`,
            },
            sheets: sheetDetails.map((item) => ({
              properties: { title: item.Name },
            })),
          };

          const workingDays = getAllDaysInMonth(
            now.getFullYear(),
            now.getMonth()
          ).reduce((count, item) => {
            const date = new Date(item);
            const presentDays = `${String(days[date.getDay()]).slice(0, 3)}`;
            if (presentDays !== "Sat" && presentDays !== "Sun") {
              count++;
            }
            return count;
          }, 0);

          fetch("https://sheets.googleapis.com/v4/spreadsheets", {
            method: "POST",
            headers: new Headers({ Authorization: "Bearer " + accessToken }),
            body: JSON.stringify(sheetData),
          })
            .then((res) => {
              return res.json();
            })
            .then(function (val) {
              // console.log(val)
              // console.log(val.spreadsheetId)
              var Id = val.spreadsheetId;
              // console.log(Id)
              // console.log(val.title)
              var url = val.spreadsheetUrl;
              // console.log(accessToken)
              // console.log(val.sheets[0].properties.sheetId)
              const SheetId = val.sheets[0].properties.sheetId;
              // console.log(val.sheets);

              const spreadsheetUrl = val.spreadsheetUrl;

              fetch(
                `https://www.googleapis.com/drive/v2/files/${Id}?key=AIzaSyAzmN7JJ7W5D3jfypgnjZkw_d-CB6thpW0`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${accessToken}`,
                  },
                  body: JSON.stringify({
                    parents: [
                      {
                        id: "1EzRwbtx4FI4PAK6_vAoBa_V11IgqPck-",
                        kind: "drive#parentReference",
                        isRoot: true,
                      },
                    ],
                  }),
                }
              );

              sheetDetails.forEach((item) => {
                fetch(
                  `https://sheets.googleapis.com/v4/spreadsheets/${Id}/values:batchUpdate?key=AIzaSyAzmN7JJ7W5D3jfypgnjZkw_d-CB6thpW0`,
                  {
                    method: "POST",
                    // contentType: "application/json",
                    headers: {
                      "Content-Type": "application/json",
                      Accept: "application/json",
                      Authorization: `Bearer ${accessToken}`,
                    },

                    body: JSON.stringify({
                      includeValuesInResponse: true,
                      valueInputOption: "RAW",
                      data: [
                        {
                          range: `${item.Name}!B2`,
                          majorDimension: "COLUMNS",
                          values: [["TIMESHEET FOR THE MONTH"]],
                        },
                        {
                          range: `${item.Name}!B3`,
                          majorDimension: "DIMENSION_UNSPECIFIED",
                          values: [
                            ["Name*"],
                            ["Designation*"],
                            ["Company*"],
                            ["Client*"],
                          ],
                        },
                        {
                          range: `${item.Name}!C3`,
                          majorDimension: "ROWS",
                          values: [
                            [item.Name],
                            [item.Designation],
                            [item.Company],
                            [item.Client],
                          ],
                        },
                        {
                          range: `${item.Name}!F3`,
                          majorDimension: "DIMENSION_UNSPECIFIED",
                          values: [
                            ["Month*"],
                            ["Total Days/M*"],
                            ["EMP ID*"],
                            ["Location**"],
                          ],
                        },
                        {
                          range: `${item.Name}!H3`,

                          majorDimension: "DIMENSION_UNSPECIFIED",
                          values: [
                            ["From"],
                            ["To"],
                            ["Billing Start date"],
                            ["Contact No.*"],
                          ],
                        },
                        {
                          range: `${item.Name}!G3`,
                          majorDimension: "ROWS",
                          values: [
                            [currentMonthName.slice(0, 3) + " " + currentYear],
                          ],
                        },
                        {
                          range: `${item.Name}!G4`,
                          majorDimension: "DIMENSION_UNSPECIFIED",
                          values: [["Days" + " " + daysInMonth]],
                        },
                        {
                          range: `${item.Name}!G5`,
                          majorDimension: "DIMENSION_UNSPECIFIED",
                          values: [[item.EmpID]],
                        },
                        {
                          range: `${item.Name}!G6`,
                          majorDimension: "DIMENSION_UNSPECIFIED",
                          values: [[item.Location]],
                        },
                        {
                          range: `${item.Name}!I3`,
                          majorDimension: "ROWS",
                          values: [
                            startDate,
                            endDate,
                            [item.BillingStartDate],
                            [item.Contact],
                          ],
                        },

                        {
                          range: `${item.Name}!B7`,
                          majorDimension: "DIMENSION_UNSPECIFIED",
                          values: [
                            ["Date"],
                            ...getAllDaysInMonth(
                              now.getFullYear(),
                              now.getMonth()
                            ).map((item) => {
                              const currentDate = new Date(item);
                              return [
                                `${currentDate.getDate()}-${
                                  months[currentDate.getMonth()]
                                }-${String(currentDate.getYear()).slice(1)}`,
                              ];
                            }),
                          ],
                        },

                        {
                          range: `${item.Name}!C7`,
                          majorDimension: "DIMENSION_UNSPECIFIED",
                          values: [
                            ["Day"],
                            ...getAllDaysInMonth(
                              now.getFullYear(),
                              now.getMonth()
                            ).map((item) => {
                              const date = new Date(item);
                              const presentDays = `${String(
                                days[date.getDay()]
                              ).slice(0, 3)}`;

                              return [presentDays];
                            }),
                          ],
                        },
                        {
                          range: `${item.Name}!D7`,
                          majorDimension: "DIMENSION_UNSPECIFIED",
                          values: [
                            ["Working hr"],
                            ...getAllDaysInMonth(
                              now.getFullYear(),
                              now.getMonth()
                            ).map((item) => {
                              const date = new Date(item);
                              const presentDays = `${String(
                                days[date.getDay()]
                              ).slice(0, 3)}`;
                              // console.log(presentDays);

                              return presentDays === "Sun" ||
                                presentDays === "Sat"
                                ? ["0.00"]
                                : ["8.00"];
                            }),
                          ],
                        },
                        {
                          range: `${item.Name}!E7`,
                          majorDimension: "ROWS",
                          values: [["Description"]],
                        },
                        {
                          range: `${item.Name}!B${8 + daysInMonth}`,
                          majorDimension: "COLUMNS",
                          values: [
                            ["Working Days*"],
                            ["Personal Leave*"],
                            ["Official Leaves(Including Sat/Sun)*"],
                            ["Days Present*"],
                            ["Extra / Comp-off(On Official Leaves)*"],
                            ["Total Days"],
                          ],
                        },

                        {
                          range: `${item.Name}!B${10 + daysInMonth}`,
                          majorDimension: "ROWS",
                          values: [["Prepared By*"]],
                        },
                        {
                          range: `${item.Name}!F${10 + daysInMonth}`,
                          majorDimension: "ROWS",
                          values: [["Date*"]],
                        },
                        {
                          range: `${item.Name}!B${9 + daysInMonth}`,
                          majorDimension: "DIMENSION_UNSPECIFIED",
                          values: [[workingDays]],
                        },
                      ],
                      
                    }),
                  }
                );
              });

              val.sheets.forEach((item) => {
                fetch(
                  `https://sheets.googleapis.com/v4/spreadsheets/${Id}:batchUpdate?key=AIzaSyAzmN7JJ7W5D3jfypgnjZkw_d-CB6thpW0`,
                  {
                    method: "POST",
                    // contentType: "application/json",
                    headers: {
                      "Content-Type": "application/json",
                      Accept: "application/json",
                      Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                      requests: [
                        {
                          "updateDimensionProperties": {
                            "range": {
                              "dimension": "COLUMNS",
                              "sheetId": `${item.properties.sheetId}`,
                              "startIndex": 3,
                              "endIndex": 4
                            },
                            "properties": {
                              "pixelSize": 180
                            },
                            "fields": "pixelSize"
                          }
                        },
                        {
                          "updateDimensionProperties": {
                            "range": {
                              "dimension": "COLUMNS",
                              "sheetId": `${item.properties.sheetId}`,
                              "startIndex": 5,
                              "endIndex": 6
                            },
                            "properties": {
                              "pixelSize": 190
                            },
                            "fields": "pixelSize"
                          }
                        },
                      
                        {
                          mergeCells: {
                            range: {
                              sheetId: `${item.properties.sheetId}`,
                              startRowIndex: 2,
                              endRowIndex: 6,
                              startColumnIndex: 2,
                              endColumnIndex: 5,
                            },
                            mergeType: "MERGE_ROWS",
                          },
                        },
                        {
                          mergeCells: {
                            range: {
                              sheetId: `${item.properties.sheetId}`,
                              startRowIndex: 6,
                              endRowIndex: 7 + daysInMonth,
                              startColumnIndex: 4,
                              endColumnIndex: 9,
                            },
                            mergeType: "MERGE_ROWS",
                          },
                        },
                        {
                          mergeCells: {
                            range: {
                              sheetId: `${item.properties.sheetId}`,
                              startRowIndex: 1,
                              endRowIndex: 2,
                              startColumnIndex: 1,
                              endColumnIndex: 9,
                            },
                            mergeType: "MERGE_ROWS",
                          },
                        },
                        {
                          mergeCells: {
                            range: {
                              sheetId: `${item.properties.sheetId}`,
                              startRowIndex: 7 + daysInMonth,
                              endRowIndex: 10 + daysInMonth,
                              startColumnIndex: 6,
                              endColumnIndex: 9,
                            },
                            mergeType: "MERGE_ROWS",
                          },
                        },
                        {
                          mergeCells: {
                            range: {
                              sheetId: `${item.properties.sheetId}`,
                              startRowIndex: 9 + daysInMonth,
                              endRowIndex: 10 + daysInMonth,
                              startColumnIndex: 1,
                              endColumnIndex: 3,
                            },
                            mergeType: "MERGE_ROWS",
                          },
                        },
                        {
                          mergeCells: {
                            range: {
                              sheetId: `${item.properties.sheetId}`,
                              startRowIndex: 9 + daysInMonth,
                              endRowIndex: 10 + daysInMonth,
                              startColumnIndex: 3,
                              endColumnIndex: 5,
                            },
                            mergeType: "MERGE_ROWS",
                          },
                        },
                        {
                          repeatCell: {
                            range: {
                              sheetId: `${item.properties.sheetId}`,
                              startRowIndex: 1,
                              endRowIndex: 2,
                              startColumnIndex: 1,
                              endColumnIndex: 9,
                            },
                            cell: {
                              userEnteredFormat: {
                                textFormat: {
                                  fontSize: 11,
                                  bold: true,
                                  foregroundColor: {
                                    blue: 1,
                                    green: 1,
                                    red: 1,
                                    alpha: 1,
                                  },
                                },
                                horizontalAlignment: "CENTER",
                                backgroundColor: {
                                  red: 0.2,
                                  green: 0.3,
                                  blue: 0.6,
                                },
                              },
                            },
                            fields:
                              "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
                          },
                        },
                     
                        {
                          repeatCell: {
                            range: {
                              sheetId: `${item.properties.sheetId}`,
                              startRowIndex: 2,
                              endRowIndex: 6,
                              startColumnIndex: 1,
                              endColumnIndex: 2,
                            },
                            cell: {
                              userEnteredFormat: {
                                textFormat: {
                                  fontSize: 9,
                                  bold: true,
                                  foregroundColor: {
                                    blue: 0,
                                    green: 0,
                                    red: 0,
                                    alpha: 0,
                                  },
                                },
                                horizontalAlignment: "LEFT",
                                backgroundColor: {
                                  red: 1,
                                  green: 1,
                                  blue: 0.6,
                                },
                              },
                            },
                            fields:
                              "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
                          },
                        },
                        {
                          repeatCell: {
                            range: {
                              sheetId: `${item.properties.sheetId}`,
                              startRowIndex: 2,
                              endRowIndex: 6,
                              startColumnIndex: 2,
                              endColumnIndex: 4,
                            },
                            cell: {
                              userEnteredFormat: {
                                textFormat: {
                                  fontSize: 9,
                                  bold: true,
                                  foregroundColor: {
                                    blue: 0,
                                    green: 0,
                                    red: 0,
                                    alpha: 0,
                                  },
                                },
                              },
                            },
                            fields:
                              "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
                          },
                        },
                        {
                          repeatCell: {
                            range: {
                              sheetId: `${item.properties.sheetId}`,
                              startRowIndex: 2,
                              endRowIndex: 6,
                              startColumnIndex: 5,
                              endColumnIndex: 6,
                            },
                            cell: {
                              userEnteredFormat: {
                                textFormat: {
                                  fontSize: 9,
                                  bold: true,
                                  foregroundColor: {
                                    blue: 0,
                                    green: 0,
                                    red: 0,
                                    alpha: 0,
                                  },
                                },
                                horizontalAlignment: "LEFT",
                                backgroundColor: {
                                  red: 1,
                                  green: 1,
                                  blue: 0.6,
                                },
                              },
                            },
                            fields:
                              "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
                          },
                        },
                        {
                          repeatCell: {
                            range: {
                              sheetId: `${item.properties.sheetId}`,
                              startRowIndex: 2,
                              endRowIndex: 6,
                              startColumnIndex: 6,
                              endColumnIndex: 7,
                            },
                            cell: {
                              userEnteredFormat: {
                                textFormat: {
                                  fontSize: 9,
                                  bold: true,
                                  foregroundColor: {
                                    blue: 0,
                                    green: 0,
                                    red: 0,
                                    alpha: 0,
                                  },
                                },
                              },
                            },
                            fields:
                              "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
                          },
                        },
                        {
                          repeatCell: {
                            range: {
                              sheetId: `${item.properties.sheetId}`,
                              startRowIndex: 2,
                              endRowIndex: 6,
                              startColumnIndex: 7,
                              endColumnIndex: 8,
                            },
                            cell: {
                              userEnteredFormat: {
                                textFormat: {
                                  fontSize: 9,
                                  bold: true,
                                  foregroundColor: {
                                    blue: 0,
                                    green: 0,
                                    red: 0,
                                    alpha: 0,
                                  },
                                },
                                horizontalAlignment: "LEFT",
                                backgroundColor: {
                                  red: 1,
                                  green: 1,
                                  blue: 0.6,
                                },
                              },
                            },
                            fields:
                              "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
                          },
                        },
                        {
                          repeatCell: {
                            range: {
                              sheetId: `${item.properties.sheetId}`,
                              startRowIndex: 2,
                              endRowIndex: 6,
                              startColumnIndex: 8,
                              endColumnIndex: 9,
                            },
                            cell: {
                              userEnteredFormat: {
                                textFormat: {
                                  fontSize: 9,
                                  bold: true,
                                  foregroundColor: {
                                    blue: 0,
                                    green: 0,
                                    red: 0,
                                    alpha: 0,
                                  },
                                },
                              },
                            },
                            fields:
                              "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
                          },
                        },
                        {
                          repeatCell: {
                            range: {
                              sheetId: `${item.properties.sheetId}`,
                              startRowIndex: 6,
                              endRowIndex: 7,
                              startColumnIndex: 1,
                              endColumnIndex: 9,
                            },
                            cell: {
                              userEnteredFormat: {
                                textFormat: {
                                  fontSize: 11,
                                  bold: true,
                                  foregroundColor: {
                                    blue: 1,
                                    green: 1,
                                    red: 1,
                                    alpha: 1,
                                  },
                                },
                                horizontalAlignment: "CENTER",
                                backgroundColor: {
                                  red: 0.2,
                                  green: 0.3,
                                  blue: 0.6,
                                },
                              },
                            },
                            fields:
                              "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
                          },
                        },
                        {
                          repeatCell: {
                            range: {
                              sheetId: `${item.properties.sheetId}`,
                              startRowIndex: 7,
                              endRowIndex: 7 + daysInMonth,
                              startColumnIndex: 1,
                              endColumnIndex: 3,
                            },
                            cell: {
                              userEnteredFormat: {
                                textFormat: {
                                  fontSize: 8,
                                  bold: true,
                                  foregroundColor: {
                                    blue: 0,
                                    green: 0,
                                    red: 0,
                                    alpha: 0,
                                  },
                                },
                                horizontalAlignment: "CENTER",
                                backgroundColor: {
                                  blue: 1,
                                  green: 1,
                                  red: 1,
                                  alpha: 1,
                                },
                              },
                            },
                            fields:
                              "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
                          },
                        },
                        {
                          repeatCell: {
                            range: {
                              sheetId: `${item.properties.sheetId}`,
                              startRowIndex: 7,
                              endRowIndex: 7 + daysInMonth,
                              startColumnIndex: 3,
                              endColumnIndex: 4,
                            },
                            cell: {
                              userEnteredFormat: {
                                textFormat: {
                                  fontSize: 8,
                                  bold: true,
                                  foregroundColor: {
                                    blue: 0,
                                    green: 0,
                                    red: 0,
                                    alpha: 0,
                                  },
                                },
                                horizontalAlignment: "CENTER",
                                backgroundColor: {
                                  blue: 1,
                                  green: 1,
                                  red: 1,
                                  alpha: 1,
                                },
                              },
                            },
                            fields:
                              "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
                          },
                        },
                        {
                          repeatCell: {
                            range: {
                              sheetId: `${item.properties.sheetId}`,
                              startRowIndex: 7 + daysInMonth,
                              endRowIndex: 8 + daysInMonth,
                              startColumnIndex: 1,
                              endColumnIndex: 9,
                            },
                            cell: {
                              userEnteredFormat: {
                                textFormat: {
                                  fontSize: 8,
                                  bold: true,
                                  foregroundColor: {
                                    blue: 1,
                                    green: 1,
                                    red: 1,
                                    alpha: 1,
                                  },
                                },
                                horizontalAlignment: "CENTER",
                                backgroundColor: {
                                  red: 0.2,
                                  green: 0.3,
                                  blue: 0.6,
                                },
                              },
                            },
                            fields:
                              "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
                          },
                        },
                        {
                          repeatCell: {
                            range: {
                              sheetId: `${item.properties.sheetId}`,
                              startRowIndex: 8 + daysInMonth,
                              endRowIndex: 9 + daysInMonth,
                              startColumnIndex: 1,
                              endColumnIndex: 9,
                            },
                            cell: {
                              userEnteredFormat: {
                                textFormat: {
                                  fontSize: 12,
                                  bold: true,
                                  foregroundColor: {
                                    blue: 0,
                                    green: 0,
                                    red: 0,
                                    alpha: 0,
                                  },
                                },
                                horizontalAlignment: "CENTER",
                                backgroundColor: {
                                  red: 1,
                                  green: 1,
                                  blue: 0.6,
                                },
                              },
                            },
                            fields:
                              "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
                          },
                        },
                        {
                          repeatCell: {
                            range: {
                              sheetId: `${item.properties.sheetId}`,
                              startRowIndex: 9 + daysInMonth,
                              endRowIndex: 10 + daysInMonth,
                              startColumnIndex: 1,
                              endColumnIndex: 3,
                            },
                            cell: {
                              userEnteredFormat: {
                                textFormat: {
                                  fontSize: 9,
                                  bold: true,
                                  foregroundColor: {
                                    blue: 1,
                                    green: 1,
                                    red: 1,
                                    alpha: 1,
                                  },
                                },
                                horizontalAlignment: "RIGHT",
                                backgroundColor: {
                                  red: 0.2,
                                  green: 0.3,
                                  blue: 0.6,
                                },
                              },
                            },
                            fields:
                              "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
                          },
                        },
                        {
                          repeatCell: {
                            range: {
                              sheetId: `${item.properties.sheetId}`,
                              startRowIndex: 9 + daysInMonth,
                              endRowIndex: 10 + daysInMonth,
                              startColumnIndex: 3,
                              endColumnIndex: 5,
                            },
                            cell: {
                              userEnteredFormat: {
                                textFormat: {
                                  fontSize: 12,
                                  bold: true,
                                  foregroundColor: {
                                    blue: 0,
                                    green: 0,
                                    red: 0,
                                    alpha: 0,
                                  },
                                },
                                horizontalAlignment: "CENTER",
                                backgroundColor: {
                                  red: 1,
                                  green: 1,
                                  blue: 0.6,
                                },
                              },
                            },
                            fields:
                              "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
                          },
                        },
                        {
                          repeatCell: {
                            range: {
                              sheetId: `${item.properties.sheetId}`,
                              startRowIndex: 9 + daysInMonth,
                              endRowIndex: 10 + daysInMonth,
                              startColumnIndex: 5,
                              endColumnIndex: 6,
                            },
                            cell: {
                              userEnteredFormat: {
                                textFormat: {
                                  fontSize: 9,
                                  bold: true,
                                  foregroundColor: {
                                    blue: 1,
                                    green: 1,
                                    red: 1,
                                    alpha: 1,
                                  },
                                },
                                horizontalAlignment: "CENTER",
                                backgroundColor: {
                                  red: 0.2,
                                  green: 0.3,
                                  blue: 0.6,
                                },
                              },
                            },
                            fields:
                              "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
                          },
                          
                          
                        },
                       
                        {
                          appendDimension: {
                            sheetId: `${item.properties.sheetId}`,
                            dimension: "ROWS",
                            length: 3,
                          },
                        },
                        {
                          updateBorders: {
                            range: {
                              sheetId: `${item.properties.sheetId}`,
                              startRowIndex: 1,
                              endRowIndex: 10 + daysInMonth,
                              startColumnIndex: 1,
                              endColumnIndex: 9,
                            },
                            top: {
                              style: "SOLID",
                              width: 1,
                              color: {
                                alpha: 1,
                              },
                            },
                            bottom: {
                              style: "SOLID",
                              width: 1,
                              color: {
                                alpha: 1,
                              },
                            },
                            left: {
                              style: "SOLID",
                              width: 1,
                              color: {
                                alpha: 1,
                              },
                            },
                            right: {
                              style: "SOLID",
                              width: 1,
                              color: {
                                alpha: 1,
                              },
                            },
                            innerVertical: {
                              style: "SOLID",
                              width: 1,
                              color: {
                                alpha: 0,
                              },
                            },
                            innerHorizontal: {
                              style: "SOLID",
                              width: 1,
                            },
                          },
                        },
                      ],
                    }),
                  }
                );
              });

              const emailId = ["govardhansiddhu555@gmail.com"];
              emailId.map((id) =>
                fetch(
                  `https://www.googleapis.com/drive/v2/files/${Id}/permissions?key=AIzaSyAzmN7JJ7W5D3jfypgnjZkw_d-CB6thpW0`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Accept: "application/json",
                      Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                      role: "writer",
                      type: "user",
                      kind: "drive#permission",
                      value: id,
                    }),
                  }
                ).then((res) => {
                  // console.log(res)
                })
              );
              window.open(
                "https://docs.google.com/spreadsheets/d/" +
                  val.spreadsheetId +
                  "/edit",
                "_blank"
              );
            });
        },
      })
    );
  }, [value, sheetDetails]);

  // console.log(access)
  // console.log(titlename);

  const folderId = "1EzRwbtx4FI4PAK6_vAoBa_V11IgqPck-";
  const getFiles = async () => {
    const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&fields=nextPageToken%2C+files(id%2C+name)`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });
    const data = await response.json();
    const files = data.files;

    if (files?.length) {
      console.log("Files:");
      setData(files);
      files.map((file) => {
        console.log(`${file.name} (${file.id})`);
      });
    } else {
      console.log("No files found.");
    }
  };

  // console.log(data)
  // console.log(value)
  // console.log(sourcedata)

  console.log("/////", showForm);

  return (
    <>
      <div className="mt-5 p-5 text-center">
        <div
          className="text-center"
          onClick={(e) => createDriveFile(e)}
          id="signInDiv"
        ></div>

        {user && (
          <div className="d-flex flex-column justify-content-center">
            <div>
              {" "}
              <img src={user.picture}></img>
              <h3>{user.name}</h3>
            </div>
          </div>
        )}

        {Object.keys(user).length != 0 && (
          <div>
            <button
              className="btn btn-secondary"
              onClick={(e) => handleSignOut(e)}
            >
              Sign Out
            </button>
            <input
              type="submit"
              className="m-2 btn btn-secondary"
              onClick={createDriveFile}
              value="Create File"
            />

            {/* <div className="pt-4 m-2">
              <button onClick={getFiles}>GetFiles</button>
            </div> */}

            <div>
              <DropdownButton
                value={value}
                setValue={setValue}
                setSheetDetails={setSheetDetails}
              />
            </div>
            <div>
              {!isopen && (
                <button onClick={handleOpen} className="btn btn-primary mt-1">
                  Open Form
                </button>
              )}
              {isopen && (
                <form onSubmit={(e) => submitHandler(e)} className="form">
                  <div className="input-group input-group-sm mb-3">
                    <label className="input-group-text">Enter an EmpID:</label>
                    <input
                      name="EmpID"
                      className="form-control"
                      type="number"
                      placeholder="Enter EmpID"
                      required
                    />
                  </div>

                  <div className="input-group input-group-sm mb-3">
                    <label className="input-group-text"> Enter Name: </label>
                    <input
                      className="form-control"
                      name="Name"
                      type="text"
                      placeholder="Enter Name"
                      required
                    />
                  </div>

                  <div className="input-group input-group-sm mb-3">
                    <label className="input-group-text">
                      {" "}
                      Enter Designation:{" "}
                    </label>
                    <input
                      name="Designation"
                      className="form-control"
                      type="text"
                      placeholder="Enter Designation"
                      required
                    />
                  </div>

                  <div className="input-group input-group-sm mb-3">
                    <label className="input-group-text">
                      {" "}
                      Enter Location:{" "}
                    </label>
                    <input
                      name="Location"
                      className="form-control"
                      type="text"
                      placeholder="Enter Location"
                      required
                    />
                  </div>

                  <div className="input-group input-group-sm mb-3">
                    <label className="input-group-text">
                      Enter BillingStartDate:
                    </label>
                    <input
                      name="BillingStartDate"
                      className="form-control"
                      type="date"
                      placeholder="Enter BillingStartDate"
                      required
                    />
                  </div>

                  <div className="input-group input-group-sm mb-3">
                    <label className="input-group-text"> Enter Contact: </label>
                    <input
                      name="Contact"
                      className="form-control"
                      type="number"
                      placeholder="Enter Contact"
                      minLength="10"
                      required
                    />
                  </div>

                  <div className="input-group input-group-sm mb-3">
                    <label className="input-group-text"> Enter Company: </label>
                    <input
                      className="form-control"
                      name="Company"
                      type="text"
                      placeholder="Enter Company"
                      required
                    />
                  </div>

                  <div className="input-group input-group-sm mb-3">
                    <label className="input-group-text"> Enter Client: </label>
                    <input
                      className="form-control"
                      name="Client"
                      type="text"
                      placeholder="Enter Client"
                      value={
                        value === "Select Project" ? "Select Project" : value
                      }
                      required
                    />
                  </div>

                  <button className="btn btn-secondary" type="submit">
                    Add Details
                  </button>
                  <button
                    onClick={handleClose}
                    className="btn btn-primary mx-1"
                  >
                    Close Form
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        <div className="pt-5">
          {data &&
            data.map((sheet) => {
              return (
                <div key={sheet.id}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">SheetName</th>
                        <th scope="col">SheetID</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{sheet.name}</td>
                        <td>{sheet.id}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              );
            })}
        </div>
        <div>
          {/* <p>Current month: {currentMonthName}</p>
      <p>Current year: {currentYear}</p> */}
        </div>
      </div>
    </>
  );
}
