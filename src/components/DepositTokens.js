const DepositTokens = (props) => {

return(
<div>
  {/* Deposit tokens */}
  <br/>
  <h2>DEPOSIT TOKENS</h2>
  <div>
    <button onClick = {(event) => {
      event.preventDefault();
      let amount = parseInt(document.getElementById('deposit-amount').value);
      let select = document.getElementById('select-d-token');
      let ticker = select.options[select.selectedIndex].text;        
      if(!isNaN(amount)){
        props.deposit(ticker, amount)
      };
    }}>Deposit</button>

    <select id='select-d-token'>
      <option value="YOSHI">YOSHI</option>
      <option value="PIKACHU">PIKACHU</option>
    </select>
    
    <input id='deposit-amount' type='text' placeholder='Amount'></input>
  </div>
</div>
)};

export default DepositTokens;