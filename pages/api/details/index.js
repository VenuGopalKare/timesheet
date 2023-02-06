import details from "../../../sourcedata.json";
const fs = require("fs");

export default function handler(req, res) {
  console.log(req.body);
  const client = req.body.Client;

  details[0][`${client}`].push(req.body);
  fs.writeFile("./sourcedata.json", JSON.stringify(details, null, 2), (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("file written successfully");
    }
  });
  res.status(200).json(req.body);
}
