import React from "react";
import { ApiPassportResponse, eTourCustomer } from "../../api/interfaces";

interface TableDemoProps {
    dataExtract: ApiPassportResponse[];
    dataEtour: eTourCustomer[];
}

const TableDemo: React.FC<TableDemoProps> = ({dataExtract, dataEtour}) => {
    const excluded = dataEtour.map(
        (etour) => !dataExtract.some((extract) => etour.isSimilar === extract.isSimilar)
    )
    return (
        <div>
            {dataExtract.map((etour, index) => (
                <ul key={etour.id}>
                    <li
                        className={`${!excluded[index] ? "text-red-500" : "text-green-500"}`}
                        >{etour.fullName}</li>
                    <li>{etour.address}</li>
                </ul>
            ))}
        </div>
    );
}

export default TableDemo;