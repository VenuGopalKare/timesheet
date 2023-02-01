// import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import DropdownButton from "./DropdownButton";
import sourcedata from "../sourcedata.json";

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

export default function TimeSheet() {
  const [user, setUser] = useState({});
  const [tokenClient, setTokenClient] = useState({});
  const [access, setAccess] = useState("");
  const [data, setData] = useState("");
  const [titlename, setTitlename] = useState("venuSheet");

  const [sheetDetails, setSheetDetails] = useState("");
  const [dates, setDates] = useState("");
  const [biodata, setBiodata] = useState([]);

  const [value, setValue] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchDetails = async () => {
    const response = await fetch("/api/details");
    const bio = await response.json();
    setBiodata(bio);
  };

  console.log(biodata);

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
    oldSheetData.push(newData);
    setSheetDetails(oldSheetData);
    alert("Details added succesfully");
    e.target.EmpID.value = "";
    e.target.Name.value = "";
    e.target.Designation.value = "";
    e.target.Location.value = "";
    e.target.BillingStartDate.value = "";
    e.target.Contact.value = "";
    e.target.Company.value = "";
    e.target.Client.value = "";
  };
  console.log("sheet details:", sheetDetails);

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

    fetchDetails();
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentMonthName = monthNames[currentMonth];
    const currentYear = currentDate.getFullYear();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    console.log(daysInMonth);
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
                          range: `${item.Name}!I5`,
                          majorDimension: "ROWS",
                          values: [[item.BillingStartDate], [item.Contact]],
                        },
                        {
                          range: `${item.Name}!B39`,
                          majorDimension: "DIMENSION_UNSPECIFIED",
                          values: [["Working Days*"]],
                        },
                        {
                          range: `${item.Name}!C39`,
                          majorDimension: "DIMENSION_UNSPECIFIED",
                          values: [["Personal Leave*"]],
                        },
                        {
                          range: `${item.Name}!D39`,
                          majorDimension: "DIMENSION_UNSPECIFIED",
                          values: [["Official Leaves(Including Sat/Sun)*"]],
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
                          range: `${item.Name}!G7`,
                          majorDimension: "DIMENSION_UNSPECIFIED",
                          values: [["Description"]],
                        },
                        {
                          range: `${item.Name}!E39`,
                          majorDimension: "ROWS",
                          values: [["Days Present*"]],
                        },
                        {
                          range: `${item.Name}!F39`,
                          majorDimension: "ROWS",
                          values: [["Extra / Comp-off(On Official Leaves)*"]],
                        },
                        {
                          range: `${item.Name}!H39`,
                          majorDimension: "ROWS",
                          values: [["Total Days"]],
                        },
                        {
                          range: `${item.Name}!B41`,
                          majorDimension: "ROWS",
                          values: [["Prepared By*"]],
                        },
                        {
                          range: `${item.Name}!F41`,
                          majorDimension: "ROWS",
                          values: [["Date*"]],
                        },
                        {
                          range: `${item.Name}!B40`,
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
                              endRowIndex: 38,
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
                              startRowIndex: 38,
                              endRowIndex: 41,
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
                              startRowIndex: 40,
                              endRowIndex: 41,
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
                              startRowIndex: 40,
                              endRowIndex: 41,
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
                              endRowIndex: 38,
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
                              endRowIndex: 38,
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
                              startRowIndex: 38,
                              endRowIndex: 39,
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
                              startRowIndex: 39,
                              endRowIndex: 40,
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
                              startRowIndex: 40,
                              endRowIndex: 41,
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
                              startRowIndex: 40,
                              endRowIndex: 41,
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
                              startRowIndex: 40,
                              endRowIndex: 41,
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
                              endRowIndex: 41,
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

              const emailId = [
                "govardhansiddhu555@gmail.com",
                "venula444@gmail.com",
                "afwaan3@gmail.com",
              ];
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
            <button onClick={(e) => handleSignOut(e)}>Sign Out</button>
            <input
              type="submit"
              className="m-2"
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
            <form onSubmit={(e) => submitHandler(e)} className="form">
              <label className="form-label"> Enter an EmpID </label>
              <input
                name="EmpID"
                className="form-input"
                type="number"
                placeholder="Enter EmpID"
              />
              <br />
              <label> Enter Name </label>
              <input name="Name" type="text" placeholder="Enter Name" />
              <br />
              <label> Enter Designation </label>
              <input
                name="Designation"
                type="text"
                placeholder="Enter Designation"
              />
              <br />
              <label> Enter Location </label>
              <input name="Location" type="text" placeholder="Enter Location" />
              <br />
              <label> Enter BillingStartDate </label>
              <input
                name="BillingStartDate"
                type="date"
                placeholder="Enter BillingStartDate"
              />
              <br />
              <label> Enter Contact </label>
              <input name="Contact" type="number" placeholder="Enter Contact" />
              <br />
              <label> Enter Company </label>
              <input name="Company" type="text" placeholder="Enter Company" />
              <br />
              <label> Enter Client </label>
              <input name="Client" type="text" placeholder="Enter Client" />
              <br />
              <button type="submit">Add Details</button>
            </form>
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
