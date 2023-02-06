import React from "react";
import TimeSheet from "../components/TimeSheet";
const fs = require("fs");

const index = ({ fs }) => {
  return (
    <div>
      <TimeSheet fs={fs} />
    </div>
  );
};

export default index;
export const getServerSideProps = async () => {
  fs;
  return {
    props: {
      fs: "fs",
    },
  };
};
