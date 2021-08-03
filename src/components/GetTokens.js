const GetTokens = (props) => {

  let interestOption = '';
  if (props.account == "0x6e19DC2432A9B4f41f31A6b88247a08cb6c8dD4d") {
    interestOption = <option>INTEREST</option>
  }
  
  return(
  <div>
    {/* Get Tokens */}
    {/* Admin can order interest tokens but they will go to the bank contract. Not to the admin address. */}
    <h2>GET SOME TOKENS</h2>
    <div>

      <button onClick = {(event) => {
        event.preventDefault();
        const amount = parseInt(document.getElementById('token-amount').value);
        const select = document.getElementById('available-tokens');
        const ticker = select.options[select.selectedIndex].text;
        if(!isNaN(amount)){
          props.getTokens(ticker, amount);
        }}}>Get Tokens</button>

        <select id='available-tokens'>
          <option>YOSHI</option>
          <option>PIKACHU</option>
          {interestOption}
        </select>

      <input id='token-amount' type='txt' placeholder='Amount'/>
      
    </div>
  </div>
  );
}

export default GetTokens;