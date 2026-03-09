import React from "react";
import "./Table.css";

const Table = ({
columns,
data,
renderRow,
currentPage,
totalPages,
setCurrentPage
}) => {

return (

<div className="table-container">

<table className="custom-table">

<thead>
<tr>

{columns.map((col,index)=>(
<th key={index}>{col}</th>
))}

</tr>
</thead>

<tbody>

{data.map((item,index)=>(
<tr key={index}>
{renderRow(item,index)}
</tr>
))}

</tbody>

</table>

<div className="pagination">

<button
className="page-btn"
disabled={currentPage === 1}
onClick={()=>setCurrentPage(currentPage-1)}
>
Previous
</button>

{Array.from({length: totalPages},(_,i)=>(

<button
key={i}
className={
currentPage === i+1
? "page-number active"
: "page-number"
}
onClick={()=>setCurrentPage(i+1)}
>

{i+1}

</button>

))}

<button
className="page-btn"
disabled={currentPage === totalPages}
onClick={()=>setCurrentPage(currentPage+1)}
>

Next

</button>

</div>

</div>

);

};

export default Table;