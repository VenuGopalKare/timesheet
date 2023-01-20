// import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import jwt_decode from 'jwt-decode'
// import { gapi } from 'gapi-script';
// import { GoogleAuth } from 'google-auth-library';
// const {GoogleAuth} = require('google-auth-library');
// import { google } from 'googleapis'
const CLIENT_ID = "543046022995-l6bsm3dead1il1g2mja6rtu92ap33bm3.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file"


export default function TimeSheet() {
    
  const [user, setUser] = useState({})
  const [tokenClient, setTokenClient] = useState({})

  function handleCallbackResponse(response) {
   
    var userObject = jwt_decode(response.credential)
    console.log(userObject)
    setUser(userObject)
    document.getElementById("signInDiv").hidden = true
  }

  function handleSignOut(event) {
    setUser({})
    document.getElementById("signInDiv").hidden = false
  }

  function createDriveFile() {
    tokenClient.requestAccessToken();
  }

  useEffect(() => {
    const google = window.google
    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleCallbackResponse
    })

    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme: "outline", size: 'large' }
    );

    setTokenClient(
      google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse) => {
          // console.log(tokenResponse.access_token);
          const accessToken = tokenResponse.access_token
          console.log(accessToken)


          fetch('https://sheets.googleapis.com/v4/spreadsheets', {
            method: "POST",
            headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
            body: JSON.stringify({ 'properties': { 'title': 'timesheet' },
             'sheets': [{ 'properties': { 'title': 'venu' } }, 
             { 'properties': { 'title': 'gopal' } },
              { 'properties': { 'title': 'govs' } }] }),

          }).then((res) => {
            return res.json()
          }).then(function (val) {
            console.log(val)
            // console.log(val.spreadsheetId)
            var Id = val.spreadsheetId
            console.log(Id)
            var url = val.spreadsheetUrl
            console.log(accessToken)
            console.log(val.sheets[0].properties.sheetId)
            const SheetId = val.sheets[0].properties.sheetId

          
           

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
                  includeValuesInResponse: false,
                  valueInputOption: "RAW",
                  data: [
                    {
                      range: "venu!D2",
                      majorDimension: "DIMENSION_UNSPECIFIED",
                      values: [
                        ["TIMESHEET FOR THE MONTH"]
                      ]
                    },
                    {
                      range: "venu!B3",
                      majorDimension: "DIMENSION_UNSPECIFIED",
                      values: [
                        
                        ["Name*"],
                        ["Designation*"],
                        ["Company*"],
                        ["Client*"],
                      ],
                    },
                    {
                      range: "venu!F3",
                      majorDimension: "DIMENSION_UNSPECIFIED",
                      values: [
                        ["Month*"],
                        ["Total Days/M*"],
                        ["EMP ID*"],
                        ["Location**"],
                      ],
                    },
                    {
                      range: "venu!H3",
                      
                      majorDimension: "DIMENSION_UNSPECIFIED",
                      values: [["From"],["To"],["Billing Start date"],["Contact No.*"]],
                    },
                    {
                      range: "venu!B7",
                      majorDimension: "DIMENSION_UNSPECIFIED",
                      values:[
                        ["Date"],["1-Oct-22"],["2-Oct-22"],["3-Oct-22"],["4-Oct-22"],["5-Oct-22"],["6-Oct-22"],["7-Oct-22"],["8-Oct-22"],["9-Oct-22"],["10-Oct-22"],["11-Oct-22"],["12-Oct-22"],["13-Oct-22"],["14-Oct-22"],["15-Oct-22"],["16-Oct-22"],["17-Oct-22"],["18-Oct-22"]
                        ,["19-Oct-22"],["20-Oct-22"],["21-Oct-22"],["22-Oct-22"],["23-Oct-22"],["24-Oct-22"],["25-Oct-22"],["26-Oct-22"]
                        ,["27-Oct-22"],["28-Oct-22"],["29-Oct-22"],["30-Oct-22"],["31-Oct-22"],["Working Days*"] ]

                    },
                    {
                      range: "venu!C7",
                      majorDimension: "DIMENSION_UNSPECIFIED",
                      values:[
                        ["Day"],["Sat"],["Sun"],["Mon"],["Tue"],["Wed"],["Thu"],["Fri"],["Sat"],["Sun"],["Mon"],["Tue"],
                        ["Wed"],["Thu"],["Fri"],["Sat"],["Sun"],["Mon"],["Tue"],["Wed"],["Thu"],["Fri"],["Sat"],["Sun"],
                        ["Mon"],["Tue"],["Wed"],["Thu"],["Fri"],["Sat"],["Sun"],["Mon"],["Personal Leave*"]
                      ]

                    },{
                      range: "venu!D7",
                      majorDimension: "DIMENSION_UNSPECIFIED",
                      values:[
                        ["Working hr"],["0.00"],["0.00"],["8.00"],["8.00"],["8.00"],["8.00"],["8.00"],["0.00"],["0.00"],["8.00"],["8.00"],["8.00"],["8.00"],["8.00"],["0.00"],["0.00"],["8.00"],["8.00"],["8.00"],["8.00"],["8.00"],["0.00"],["0.00"],["8.00"],["8.00"],["8.00"],["8.00"],["8.00"],["0.00"],["0.00"],["8.00"],["Official Leaves(Including Sat/Sun)*"]
                      ]

                    },
                    {
                      range: "venu!G7",
                      majorDimension: "DIMENSION_UNSPECIFIED",
                      values:[
                        ["Description"]
                      ]

                    },{
                      range:"venu!E39",
                      majorDimension:"ROWS",
                      values:[
                        ["Days Present*"]
                      ]
                    },{
                      range:"venu!F39",
                      majorDimension:"ROWS",
                      values:[
                        ["Extra / Comp-off(On Official Leaves)*"]
                      ]
                    },{
                      range:"venu!H39",
                      majorDimension:"ROWS",
                      values:[
                        ["Total Days"]
                      ]
                    },
                    {
                      range:"venu!B41",
                      majorDimension:"ROWS",
                      values:[
                        ["Prepared By*"]
                      ]
                    },{
                      range:"venu!F41",
                      majorDimension:"ROWS",
                      values:[
                        ["Date*"]
                      ]
                    }
                   
                  
                  ],
                 
                  
                }),
              }
            ).then((res) =>{
              console.log(res)
              
              fetch(`https://sheets.googleapis.com/v4/spreadsheets/${Id}:batchUpdate?key=AIzaSyAzmN7JJ7W5D3jfypgnjZkw_d-CB6thpW0`,{
                method: "POST",
                // contentType: "application/json",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  Authorization: `Bearer ${accessToken}`,
                },
                body:JSON.stringify({
                  // "requests": [
                  //   {
                  //     "updateBorders": {
                  //       "range": {
                  //         "sheetId": `${SheetId}`,
                  //         "startRowIndex": 1,
                  //         "endRowIndex": 41,
                  //         "startColumnIndex": 1,
                  //         "endColumnIndex": 9
                  //       },
                  //       "top": {
                  //         "style": "SOLID",
                  //         "width": 1,
                  //         "color": {
                  //           "alpha": 1
                  //         }
                  //       },
                  //       "bottom": {
                  //         "style": "SOLID",
                  //         "width": 1,
                  //         "color": {
                  //           "alpha": 1
                  //         }
                  //       },
                  //       "left": {
                  //         "style": "SOLID",
                  //         "width": 1,
                  //         "color": {
                  //           "alpha": 1
                  //         }
                  //       },
                  //       "right": {
                  //         "style": "SOLID",
                  //         "width": 1,
                  //         "color": {
                  //           "alpha": 1
                  //         }
                  //       },
                  //       "innerVertical": {
                  //         "style": "SOLID",
                  //         "width": 1,
                  //         "color": {
                  //           "alpha": 0
                  //         }
                  //       },
                  //       "innerHorizontal": {
                  //         "style": "SOLID",
                  //         "width": 1
                  //       }
                  //     }
                  //   },
                  //   {
                  //     "mergeCells": {
                  //       "range": {
                  //         "sheetId": `${SheetId}`,
                  //         "startRowIndex": 2,
                  //         "endRowIndex": 6,
                  //         "startColumnIndex": 2,
                  //         "endColumnIndex": 5
                  //       },
                  //       "mergeType": "MERGE_ROWS"
                  //     }
                  //   },
                  //   {
                  //     "mergeCells": {
                  //       "range": {
                  //         "sheetId": `${SheetId}`,
                  //         "startRowIndex": 6,
                  //         "endRowIndex": 38,
                  //         "startColumnIndex": 4,
                  //         "endColumnIndex": 9
                  //       },
                  //       "mergeType": "MERGE_ROWS"
                  //     }
                  //   },
                  //   {
                  //     "mergeCells": {
                  //       "range": {
                  //         "sheetId": `${SheetId}`,
                  //         "startRowIndex": 1,
                  //         "endRowIndex": 2,
                  //         "startColumnIndex": 1,
                  //         "endColumnIndex": 9
                  //       },
                  //       "mergeType": "MERGE_ROWS"
                  //     }
                  //   },
                  //   {
                  //     "mergeCells": {
                  //       "range": {
                  //         "sheetId": `${SheetId}`,
                  //         "startRowIndex": 38,
                  //         "endRowIndex": 41,
                  //         "startColumnIndex": 6,
                  //         "endColumnIndex": 9
                  //       },
                  //       "mergeType": "MERGE_ROWS"
                  //     }
                  //   },
                  //   {
                  //     "mergeCells": {
                  //       "range": {
                  //         "sheetId": `${SheetId}`,
                  //         "startRowIndex": 40,
                  //         "endRowIndex": 41,
                  //         "startColumnIndex": 1,
                  //         "endColumnIndex": 3
                  //       },
                  //       "mergeType": "MERGE_ROWS"
                  //     }
                  //   },
                  //   {
                  //     "mergeCells": {
                  //       "range": {
                  //         "sheetId": `${SheetId}`,
                  //         "startRowIndex": 40,
                  //         "endRowIndex": 41,
                  //         "startColumnIndex": 3,
                  //         "endColumnIndex": 5
                  //       },
                  //       "mergeType": "MERGE_ROWS"
                  //     }
                  //   }
                  // ]
                  requests: [
                    {
                      mergeCells: {
                        range: {
                          sheetId: `${SheetId}`,
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
                          sheetId: `${SheetId}`,
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
                          sheetId: `${SheetId}`,
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
                          sheetId: `${SheetId}`,
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
                          sheetId: `${SheetId}`,
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
                          sheetId: `${SheetId}`,
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
                          sheetId: `${SheetId}`,
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
                          sheetId: `${SheetId}`,
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
                          sheetId: `${SheetId}`,
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
                          sheetId: `${SheetId}`,
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
                          sheetId: `${SheetId}`,
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
                          sheetId: `${SheetId}`,
                          startRowIndex: 7,
                          endRowIndex: 38,
                          startColumnIndex: 1,
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
                          sheetId: `${SheetId}`,
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
                          sheetId: `${SheetId}`,
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
                          sheetId: `${SheetId}`,
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
                          sheetId: `${SheetId}`,
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
                              blue: 0.6,
                            },
                          },
                        },
                        fields:
                          "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
                      },
                    },
                    {
                      "appendDimension": {
                        "sheetId": `${SheetId}`,
                        "dimension": "ROWS",
                        "length": 3
                      }
                    },
                    {
                      updateBorders: {
                        range: {
                          sheetId: `${SheetId}`,
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
                })
              })

             
              
            }).then((res) => {
              const emailId = [
                "govardhansiddhu555@gmail.com",
                "venula444@gmail.com","gsurada@msystechnologies.com","ashraful.nobi@msystechnologies.com"
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
                      // "title": "sub",
                      // "parents": [{"id":"https://drive.google.com/drive/folders/1oGGADc1e8YFt6UCf-8FQlYbX-0tLszub?usp=share_link"}],
                      // "mimeType": "application/vnd.google-apps.folder"
                    }),
                  }
                ).then((res)=>{
                  // console.log(res)
                  // const file = new Blob([Id], { type: 'text/plain' });

                  // const formData = new FormData();
                  // formData.append('file', file);
                  // formData.append('mimeType', 'text/plain');
                  // formData.append('name', 'file_name.txt');
                  // formData.append('parents', ['https://drive.google.com/drive/folders/1oGGADc1e8YFt6UCf-8FQlYbX-0tLszub?usp=share_link']);

                  // fetch('https://www.googleapis.com/upload/drive/v3/files',{
                  //   method:"POST",
                  //   headers:{
                  //     'Content-Type': 'multipart/form-data',
                  //     Accept: "application/json",
                  //     Authorization: `Bearer ${accessToken}`,
                  //   },
                  //   body:JSON.stringify({
                     
                     
                  //     formData
                  //   })
                  // })
                })
              );
            })
            window.open("https://docs.google.com/spreadsheets/d/" + val.spreadsheetId + "/edit", "_blank");
          })

        }
      })
    )


  }, [])
  return (
    <>
      <div>
        <div id="signInDiv"></div>
        {Object.keys(user).length != 0 && <button onClick={(e) => handleSignOut(e)}>Sign Out</button>}

        {user && <div>
          <img src={user.picture}></img>
          <h3>{user.name}</h3>
          <input type='submit' onClick={createDriveFile} value="Create File" />
        </div>}

      </div>
    </>
  )
}
