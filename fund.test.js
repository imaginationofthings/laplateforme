import { expect } from "chai";
import { ethers } from "hardhat";

describe("Fund", function () {
    let fund;
    let signers;

    beforeEach(async function() {
        signers = await ethers.getSigners();
        const Fund = await ethers.getContractFactory("Fund");
        fund = await Fund.deploy();
        await fund.deployed();
        
        // Mint enough tokens for the tests
        for(let i = 0; i < 6; i++) {
            await fund.mint(signers[1].address);
        }
    });

    it("test initial value", async function () {
        console.log('Fund deployed at:'+ fund.address);
        expect((await fund.balanceOf(signers[1].address)).toString()).to.equal('60');
        console.log('Initial value test passed, signers[1] has a balance of 60 tokens after minting.');
    });

    it("test transfer", async function () {
        console.log('Fund deployed at:'+ fund.address);
        await fund.connect(signers[1]).transfer(signers[2].address, 5);
        expect((await fund.balanceOf(signers[2].address)).toString()).to.equal('4');
        console.log('Transfer test passed, signers[2] received 4 tokens after a transfer of 5 tokens.');
    });

  it("test reward", async function () {
    console.log('Fund deployed at:'+ fund.address);
    for(let i=0; i<50; i++) {
        await fund.connect(signers[1]).transfer(signers[3].address, 1);
    }
    // The balance should be at least 35 (all transactions successful without being rewarded)
    // And at most 60 (if signers[3] received all the possible rewards)
    let balance = parseInt(await fund.balanceOf(signers[3].address));
    expect(balance).to.be.at.least(35);
    expect(balance).to.be.at.most(60);
    console.log('Reward test passed, signers[3] has a balance between 35 and 60 tokens after 50 transfers of 1 token.');
});


});
