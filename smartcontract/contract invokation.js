// https://cryptonomic.github.io/ConseilJS/#/?id=invoke-a-contract
// Used in the firefox console of https://smartpy.io/demo/explore.html?address=KT1VMaVxby2ak8fNepFiv3NxLu8Sbjrv1mxX, it works.
// https://medium.com/the-cryptonomic-aperiodical/starting-with-smartpy-part-5-interacting-with-smart-contrats-a96368e508c7

const tezosNode = 'https://carthagenet.SmartPy.io';

async function invokeContract() {
    const keyStore = {
        publicKey: 'tz1aTxH4JkTSoyWjCDFc1M5vAMFthTK4J8HB',
        privateKey: 'edskRf6SDjWY6QFg4tfb9BCEf964t2tEFwar1aocDFEfmofxiYuZT7RQt8Gn8a9feNycQ4toYrbjMGRhUtdiErXNn4zg4emZnD',
        publicKeyHash: 'tz1aTxH4JkTSoyWjCDFc1M5vAMFthTK4J8HB',
        seed: '',
        storeType: conseiljs5.StoreType.Fundraiser
    };
    const contractAddress = 'KT1VMaVxby2ak8fNepFiv3NxLu8Sbjrv1mxX'; // https://smartpy.io/demo/explore.html?address=KT1VMaVxby2ak8fNepFiv3NxLu8Sbjrv1mxX
    const operationFee = 100000;
    const storageLimit = 1000;
    const gasLimit = 750000;
    const playParams = "(Right (Pair 1 (Pair \"123\" (Pair 333 2))))"
    const entryPoint = "play"

    const result = await conseiljs5.TezosNodeWriter.sendContractInvocationOperation(tezosNode, keyStore, contractAddress, 0,
    operationFee, '', storageLimit, gasLimit, entryPoint, playParams, conseiljs5.TezosParameterFormat.Michelson)

    console.log(`Injected operation group id ${result.operationGroupID}`);
    console.log(result);

}

invokeContract();

