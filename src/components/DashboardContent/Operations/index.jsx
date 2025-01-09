import React from "react";
import Table from "../../common/tables";

const Operations = ({ operations }) => {
    
    return (
        <div>
            <Table tableData={operations} />
        </div>
    );
};

export default Operations;