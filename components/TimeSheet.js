import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import jwt_decode from 'jwt-decode'
// import { gapi } from 'gapi-script';


// import { GoogleAuth } from 'google-auth-library';
// const {GoogleAuth} = require('google-auth-library');
// import { google } from 'googleapis'
// import nodemailer from "nodemailer"

import styles from '../styles/Home.module.css'






const CLIENT_ID = "543046022995-l6bsm3dead1il1g2mja6rtu92ap33bm3.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file"
const CLIENT_SECRET = "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";

// var nodemailer = require('nodemailer')


export default function TimeSheet() {
    const router = useRouter()
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
            body: JSON.stringify({ 'properties': { 'title': 'tamil' },
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

            function appendValues(spreadsheetId,range,valueInputOption, callback){
              
              let values = [
                ["items","Quantity","price"],
                ["Apple","4","0.25"]
              ];

              const body ={
                values : values,
              };
               try {
                gapi.client.sheets.spreadsheet.values.update({
                  spreadsheetId : spreadsheetId,
                  range : "venu!A1:C1",
                  
                  resource : body


                }).then((response)=>{
                  const result = response.result
                  console.log(`${result.updatedCells} cells updated`)
                  // if(callback) callback(response)
                })
                
               } catch (error) {
                console.log(error)
               }
            }
            appendValues(Id)

            
            
            // router.push(`/data?venu=${url}`)
            // var values =[
            //   [
            //     "item", "Quantity", "Price"
            //   ],
            //   [
            //     "Apple","4","0.25"
            //   ],
            //   [
            //     "Banana","2","0.15"
            //   ],
            //   [
            //     "Organe","7","0.30"
            //   ]
            // ]
            // var range ="venu!A1:D1"
            // fetch(` https://sheets.googleapis.com/v4/spreadsheets/${Id}/values/${range}:append`,
            // {
            //   method:"POST",

            //   body:JSON.stringify({
            //     "values": values
            //   }
            //   )

            // }
            // )

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
