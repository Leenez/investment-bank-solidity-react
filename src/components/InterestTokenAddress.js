const InterestTokenAddress = (props) => {

    return(
        <div>
            {/*Change interest-token address*/}
            <br/>
            <h2>SWITCH TO NEW INTEREST TOKEN</h2>
            <button onClick={(event) => {
                event.preventDefault();
                const address = document.getElementById('interest-token-address').value;
                if(address != null && address !='') {
                    props.setInterestTokenAddress(address);
                }
            }}>Change Address</button>
            
            <input id='interest-token-address' type='txt' placeholder='Interest-token Address'></input>

        </div>
    );
}

export default InterestTokenAddress;