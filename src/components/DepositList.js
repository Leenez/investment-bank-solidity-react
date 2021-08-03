const DepositList = (props) => {

  const getDepositsList = () => {
    const deposits = props.deposits;
    const depositList = deposits.slice(0).reverse().map((deposit, index) => (
      <table>
        <tr>
          <th>{index}</th> 
          &emsp;
          <th>{deposit}</th>
        </tr>
      </table>
    ))
    return depositList
  }

return(
<div>
  {/* Show users deposits */}
  <br/>
  <h2>YOUR CURRENT DEPOSITS</h2>
    <div>
      {getDepositsList()}
    </div>
</div>
);}

export default DepositList;