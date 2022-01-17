import VM from "@ethereumjs/vm";
import {Account, Address, pubToAddress, toBuffer, BN} from "ethereumjs-util";

export const privateKey = "0x3cd7232cd6f3fc66a57a6bedc1a8ed6c228fff0a327e169c2bcc5e869ed49511";
export const publicKey = "0x0406cc661590d48ee972944b35ad13ff03c7876eae3fd191e8a2f77311b0a3c661" +
                         "3407b5005e63d7d8d76b89d5f900cde691497688bb281e07a5052ff61edebdc0";

interface InsertOneResponse {
    account: Account
    address: Address
}

export const insertOne = async (vm: VM): Promise<InsertOneResponse> => {
    const publicKeyBuf = toBuffer(publicKey)
    const address = new Address(pubToAddress(publicKeyBuf, true))
    const accountData = {
        nonce: 0,
        balance: new BN(10).pow(new BN(19)), // 10 eth
    }

    const account = Account.fromAccountData(accountData);
    await vm.stateManager.putAccount(address, account);

    return {
        account,
        address
    };
}