// https://cryptonomic.github.io/ConseilJS/#/?id=invoke-a-contract
// Used in the firefox console of https://smartpy.io/demo/explore.html?address=KT1VMaVxby2ak8fNepFiv3NxLu8Sbjrv1mxX, it works.
// Not sure how to actually invoke the play method of the contract

const tezosNode = 'https://carthagenet.SmartPy.io ';

async function invokeContract() {
    const keystore = {
        publicKey: 'tz1aTxH4JkTSoyWjCDFc1M5vAMFthTK4J8HB',
        privateKey: 'edskRf6SDjWY6QFg4tfb9BCEf964t2tEFwar1aocDFEfmofxiYuZT7RQt8Gn8a9feNycQ4toYrbjMGRhUtdiErXNn4zg4emZnD',
        publicKeyHash: 'tz1aTxH4JkTSoyWjCDFc1M5vAMFthTK4J8HB',
        seed: '',
        storeType: conseiljs5.StoreType.Fundraiser
    };
    const contractAddress = 'KT1VMaVxby2ak8fNepFiv3NxLu8Sbjrv1mxX';

    const result = await conseiljs5.TezosNodeWriter.sendContractInvocationOperation(tezosNode, keystore, contractAddress, 10000, 100000, '', 1000, 100000, '', '{"string": "Cryptonomicon"}', conseiljs5.TezosParameterFormat.Micheline);
    console.log(`Injected operation group id ${result.operationGroupID}`);
}

invokeContract();