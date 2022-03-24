const SimpleEtherWallet = artifacts.require("SimpleEtherWallet");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("SimpleEtherWallet", function (accounts) {
  let wallet = null;

  before(async () => {
    wallet = await SimpleEtherWallet.deployed();
  });

  it('should set an owner', async () => {
    const owner = await wallet.owner();
    await assert(owner === accounts[0]);
  });

  it('should deposit token to contract', async () => {
    const balanceBefore = await web3.eth.getBalance(wallet.address);
    await web3.eth.sendTransaction({ from: accounts[1], to: wallet.address, value: web3.utils.toWei('1', 'wei') });
    const balanceAfter = await web3.eth.getBalance(wallet.address);
    await assert(balanceAfter === `${parseInt(balanceBefore) + 1}`);
  });

  it('should return balance of the contract', async () => {
    const balance = await wallet.balanceOf();
    await assert(balance.toNumber().toString() === '1');
  });

  it('should send ether to account', async () => {
    const balanceBefore = await web3.eth.getBalance(accounts[3]);
    await wallet.send(accounts[3], web3.utils.toWei('1', 'wei'), { from: accounts[0] });
    const balance = await web3.eth.getBalance(wallet.address);
    const balanceAfter = await web3.eth.getBalance(accounts[3]);
    const balanceBeforeBN = web3.utils.toBN(balanceBefore);
    const balanceAfterBN = web3.utils.toBN(balanceAfter);
    assert(balance === '0');
    assert(balanceAfterBN.sub(balanceBeforeBN).toNumber() === 1);
  });

  it('should NOT send ether to account', async () => {
    try {
      await wallet.send(accounts[3], web3.utils.toWei('1', 'wei'), { from: accounts[1] });
    } catch (e) {
      assert(e.reason === 'sender is not allowed');
      return;
    }

    /**
     * if code reaches here, then we want to fail the test because our contract didn't throw an error which it supposed to
     */
    assert(false);
  });

});
