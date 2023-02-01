import details from "../../../sourcedata.json";

export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json(details);
  } else if (req.method === "POST") {
    const comment = req.body.comment;
    const newComment = {
      EmpID: "1561",
      Name: "Tamilselvan P",
      Designation: "Senior Software Engineer",
      Location: "Chennai",
      BillingStartDate: "23-Sep-2021",
      Contact: "9876543210",
      Company: "Msys",
      Client: "Client Name",
    };
    details.push(newComment);
    res.status(201).json(newComment);
  }
}
