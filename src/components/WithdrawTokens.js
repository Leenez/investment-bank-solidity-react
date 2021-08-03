const WithdrawTokens = (props) => {

  return(
  <div>
    {/* Withdraw Tokens */}
    <br/>
    <h2>WITHDRAW TOKENS</h2>
    <div>
      <button onClick = {(event) => {
        event.preventDefault();
        let amount = parseInt(document.getElementById('withdrawal-amount').value);
        let select = document.getElementById('select-w-token');
        let ticker = select.options[select.selectedIndex].text;        
        if(!isNaN(amount)){
          props.withdraw(ticker, amount);  
        }
        }}>Withdraw</button>

      <select id='select-w-token'>
        <option value="YOSHI">YOSHI</option>
        <option value="PIKACHU">PIKACHU</option>
      </select>

      <input id='withdrawal-amount' type='text' placeholder='Amount'></input>
    </div>
  </div>
  );
}

export default WithdrawTokens;