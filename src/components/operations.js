import React from "react";
import Table from "./table";

const Operations = ({ operations }) => {
    console.log({ operations })
    
    return (
        <div>
            <Table tableContent={operations} isOperations={true} />
        </div>
    );
};

export default Operations;
