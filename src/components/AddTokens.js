const AddTokens = (props) => {

  return(
  <div>
    {/* Add tokens (Admin) in case of existing abr token will be replaced*/}
    <br/>
    <h2>ADD NEW TOKEN TO THE BANK</h2>
    <div>
      <label>Abr:</label>
      <input id='token-abr' type='text'></input><br/>
      <label>Address:</label>
      <input id='token-address' type='text'></input><br/>
      <label>Interest:</label>
      <input id='token-interest' type='text'></input><br/>
      <button onClick = {(event) => {
        event.preventDefault();
        const abr = document.getElementById('token-abr').value;
        const address = document.getElementById('token-address').value;
        const interest = parseInt(document.getElementById('token-interest').value);
        if(!isNaN(interest) && abr != null && abr != "" && address != null && address != ""){
          props.addToken(abr, address, interest);  
        };
      }}>Add Token</button>
    </div>
  </div>
  )
}

export default AddTokens;