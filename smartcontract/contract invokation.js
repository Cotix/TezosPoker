// https://cryptonomic.github.io/ConseilJS/#/?id=invoke-a-contract
// Used in the firefox console of https://smartpy.io/demo/explore.html?address=KT1VMaVxby2ak8fNepFiv3NxLu8Sbjrv1mxX, it works.
// https://medium.com/the-cryptonomic-aperiodical/starting-with-smartpy-part-5-interacting-with-smart-contrats-a96368e508c7

const tezosNode = 'https://carthagenet.SmartPy.io';
const conseiljs = require('conseiljs');

// https://smartpy.io/demo/explore.html?address=KT1RQAmpiNAqRD2UZ9oSjHiWEXkrfzi6cCi6
const contractAddress = 'KT1RQAmpiNAqRD2UZ9oSjHiWEXkrfzi6cCi6';

const keyStore1 = {
        publicKey: 'edpktqSwdRMsYzL7snCfZeaGmrswPYKhMpqZ4nupopPnLU3Vx86WMW',
        privateKey: 'edskRf6SDjWY6QFg4tfb9BCEf964t2tEFwar1aocDFEfmofxiYuZT7RQt8Gn8a9feNycQ4toYrbjMGRhUtdiErXNn4zg4emZnD',
        publicKeyHash: 'tz1aTxH4JkTSoyWjCDFc1M5vAMFthTK4J8HB',
        seed: '',
        storeType: conseiljs.StoreType.Fundraiser
    };


const keyStore2 = {
        publicKey: "edpkvUKAYSAuSCYEQRGu5CoHewJkn2s7sd1Go8NP72rimJ2w5jjnGY",
        privateKey: "edskS83dagKogtJ4UBYf5g9epwnDtDDEBQAa7seSVDFZtQjrGvXNLkQiP3N65WH47vdYsd1QTCUr4dEA1qeKU7yH2nC5tkGqkJ",
        publicKeyHash: "tz1VUqBto3c1n6YhYPmR9cK1qfTh1mYZNCHN",
        seed: "",
        storeType: 1
    };

async function invokeContract(keyStore, party, bet, winner) {

    const operationFee = 100000;
    const storageLimit = 1000;
    const gasLimit = 750000;
    const playParams = `(Right (Right (Right (Pair ${party} (Pair ${bet} ${winner})))))`;
    const entryPoint = "play";

    const result = await conseiljs.TezosNodeWriter.sendContractInvocationOperation(tezosNode, keyStore, contractAddress, 0,
    operationFee, '', storageLimit, gasLimit, entryPoint, playParams, conseiljs.TezosParameterFormat.Michelson);

    console.log(`Injected operation group id ${result.operationGroupID}`);

}

invokeContract();




// Deploy contract, does not work because the contract ID is not given back, as far as tested.
async function deployContract() {

    const contract = `[
  {
    "prim": "storage",
    "args": [
      {
        "prim": "pair",
        "args": [
          {
            "prim": "pair",
            "args": [
              { "prim": "bool", "annots": [ "%active" ] },
              {
                "prim": "pair",
                "args": [
                  {
                    "prim": "pair",
                    "args": [
                      { "prim": "int", "annots": [ "%chips_player1" ] },
                      { "prim": "pair", "args": [ { "prim": "int", "annots": [ "%chips_player2" ] }, { "prim": "int", "annots": [ "%winner" ] } ] }
                    ],
                    "annots": [ "%baseState" ]
                  },
                  { "prim": "string", "annots": [ "%id" ] }
                ]
              }
            ]
          },
          {
            "prim": "pair",
            "args": [
              {
                "prim": "pair",
                "args": [
                  { "prim": "int", "annots": [ "%nextParty" ] },
                  {
                    "prim": "pair",
                    "args": [
                      { "prim": "pair", "args": [ { "prim": "address", "annots": [ "%address" ] }, { "prim": "mutez", "annots": [ "%bond" ] } ] },
                      {
                        "prim": "pair",
                        "args": [
                          { "prim": "bool", "annots": [ "%hasBond" ] },
                          { "prim": "pair", "args": [ { "prim": "mutez", "annots": [ "%looserClaim" ] }, { "prim": "key", "annots": [ "%pk" ] } ] }
                        ]
                      }
                    ],
                    "annots": [ "%party1" ]
                  }
                ]
              },
              {
                "prim": "pair",
                "args": [
                  {
                    "prim": "pair",
                    "args": [
                      { "prim": "pair", "args": [ { "prim": "address", "annots": [ "%address" ] }, { "prim": "mutez", "annots": [ "%bond" ] } ] },
                      {
                        "prim": "pair",
                        "args": [
                          { "prim": "bool", "annots": [ "%hasBond" ] },
                          { "prim": "pair", "args": [ { "prim": "mutez", "annots": [ "%looserClaim" ] }, { "prim": "key", "annots": [ "%pk" ] } ] }
                        ]
                      }
                    ],
                    "annots": [ "%party2" ]
                  },
                  { "prim": "int", "annots": [ "%seq" ] }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "prim": "parameter",
    "args": [
      {
        "prim": "or",
        "args": [
          {
            "prim": "or",
            "args": [
              {
                "prim": "pair",
                "args": [
                  {
                    "prim": "pair",
                    "args": [
                      {
                        "prim": "pair",
                        "args": [
                          { "prim": "int", "annots": [ "%seq" ] },
                          {
                            "prim": "pair",
                            "args": [
                              { "prim": "int", "annots": [ "%chips_player1" ] },
                              { "prim": "pair", "args": [ { "prim": "int", "annots": [ "%chips_player2" ] }, { "prim": "int", "annots": [ "%winner" ] } ] }
                            ],
                            "annots": [ "%state" ]
                          }
                        ],
                        "annots": [ "%msg1" ]
                      },
                      {
                        "prim": "pair",
                        "args": [
                          { "prim": "int", "annots": [ "%seq" ] },
                          {
                            "prim": "pair",
                            "args": [
                              { "prim": "int", "annots": [ "%chips_player1" ] },
                              { "prim": "pair", "args": [ { "prim": "int", "annots": [ "%chips_player2" ] }, { "prim": "int", "annots": [ "%winner" ] } ] }
                            ],
                            "annots": [ "%state" ]
                          }
                        ],
                        "annots": [ "%msg2" ]
                      }
                    ]
                  },
                  {
                    "prim": "pair",
                    "args": [
                      { "prim": "int", "annots": [ "%party" ] },
                      { "prim": "pair", "args": [ { "prim": "signature", "annots": [ "%sig1" ] }, { "prim": "signature", "annots": [ "%sig2" ] } ] }
                    ]
                  }
                ],
                "annots": [ "%channelAccuseDoubleMove" ]
              },
              {
                "prim": "pair",
                "args": [
                  {
                    "prim": "pair",
                    "args": [
                      { "prim": "int", "annots": [ "%seq" ] },
                      {
                        "prim": "pair",
                        "args": [
                          { "prim": "int", "annots": [ "%chips_player1" ] },
                          { "prim": "pair", "args": [ { "prim": "int", "annots": [ "%chips_player2" ] }, { "prim": "int", "annots": [ "%winner" ] } ] }
                        ],
                        "annots": [ "%state" ]
                      }
                    ],
                    "annots": [ "%msg" ]
                  },
                  { "prim": "pair", "args": [ { "prim": "signature", "annots": [ "%sig1" ] }, { "prim": "signature", "annots": [ "%sig2" ] } ] }
                ],
                "annots": [ "%channelNewState" ]
              }
            ]
          },
          {
            "prim": "or",
            "args": [
              { "prim": "pair", "args": [ { "prim": "int", "annots": [ "%party" ] }, { "prim": "signature", "annots": [ "%sig" ] } ], "annots": [ "%channelRenounce" ] },
              {
                "prim": "or",
                "args": [
                  { "prim": "int", "annots": [ "%channelSetBond" ] },
                  {
                    "prim": "pair",
                    "args": [
                      { "prim": "int", "annots": [ "%party" ] },
                      {
                        "prim": "pair",
                        "args": [
                          { "prim": "signature", "annots": [ "%sig" ] },
                          { "prim": "pair", "args": [ { "prim": "int", "annots": [ "%bet" ] }, { "prim": "int", "annots": [ "%winning_party" ] } ], "annots": [ "%sub" ] }
                        ]
                      }
                    ],
                    "annots": [ "%play" ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "prim": "code",
    "args": [
      [
        { "prim": "DUP" },
        { "prim": "CDR" },
        { "prim": "SWAP" },
        { "prim": "CAR" },
        {
          "prim": "IF_LEFT",
          "args": [
            [
              {
                "prim": "IF_LEFT",
                "args": [
                  [
                    [
                      { "prim": "SWAP" },
                      { "prim": "DUP" },
                      { "prim": "DUG", "args": [ { "int": "2" } ] },
                      { "prim": "CAR" },
                      { "prim": "CAR" },
                      {
                        "prim": "IF",
                        "args": [ [ [] ], [ [ { "prim": "PUSH", "args": [ { "prim": "string" }, { "string": "WrongCondition: self.data.active" } ] }, { "prim": "FAILWITH" } ] ] ]
                      },
                      { "prim": "SWAP" },
                      { "prim": "DUP" },
                      { "prim": "DUG", "args": [ { "int": "2" } ] },
                      { "prim": "DUP" },
                      { "prim": "CDR" },
                      { "prim": "SWAP" },
                      { "prim": "CAR" },
                      { "prim": "CDR" },
                      { "prim": "PUSH", "args": [ { "prim": "bool" }, { "prim": "False" } ] },
                      { "prim": "PAIR" },
                      { "prim": "PAIR" },
                      { "prim": "DUG", "args": [ { "int": "2" } ] },
                      { "prim": "SWAP" },
                      { "prim": "DROP" },
                      { "prim": "DUP" },
                      { "prim": "CAR" },
                      { "prim": "CDR" },
                      { "prim": "CAR" },
                      { "prim": "SWAP" },
                      { "prim": "DUP" },
                      { "prim": "DUG", "args": [ { "int": "2" } ] },
                      { "prim": "CAR" },
                      { "prim": "CAR" },
                      { "prim": "CAR" },
                      { "prim": "COMPARE" },
                      { "prim": "EQ" },
                      {
                        "prim": "IF",
                        "args": [
                          [ [] ],
                          [ [ { "prim": "PUSH", "args": [ { "prim": "string" }, { "string": "WrongCondition: params.msg1.seq == params.msg2.seq" } ] }, { "prim": "FAILWITH" } ] ]
                        ]
                      },
                      { "prim": "DUP" },
                      { "prim": "CAR" },
                      { "prim": "CDR" },
                      { "prim": "PACK" },
                      { "prim": "SWAP" },
                      { "prim": "DUP" },
                      { "prim": "DUG", "args": [ { "int": "2" } ] },
                      { "prim": "CAR" },
                      { "prim": "CAR" },
                      { "prim": "PACK" },
                      { "prim": "COMPARE" },
                      { "prim": "NEQ" },
                      {
                        "prim": "IF",
                        "args": [
                          [ [] ],
                          [
                            [
                              { "prim": "PUSH", "args": [ { "prim": "string" }, { "string": "WrongCondition: sp.pack(params.msg1) != sp.pack(params.msg2)" } ] },
                              { "prim": "FAILWITH" }
                            ]
                          ]
                        ]
                      },
                      { "prim": "DUP" },
                      { "prim": "CDR" },
                      { "prim": "CAR" },
                      { "prim": "PUSH", "args": [ { "prim": "int" }, { "int": "1" } ] },
                      { "prim": "COMPARE" },
                      { "prim": "EQ" },
                      {
                        "prim": "IF",
                        "args": [
                          [
                            [
                              { "prim": "DUP" },
                              { "prim": "CAR" },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "SWAP" },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "2" } ] },
                              { "prim": "CAR" },
                              { "prim": "CAR" },
                              { "prim": "CAR" },
                              { "prim": "PAIR", "annots": [ "%seq", "%state" ] },
                              { "prim": "PUSH", "args": [ { "prim": "string" }, { "string": "state" } ] },
                              { "prim": "DIG", "args": [ { "int": "3" } ] },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "4" } ] },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "PAIR", "annots": [ "%id", "%name" ] },
                              { "prim": "PAIR" },
                              { "prim": "PACK" },
                              { "prim": "SWAP" },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "2" } ] },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "DIG", "args": [ { "int": "3" } ] },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "4" } ] },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CHECK_SIGNATURE" },
                              {
                                "prim": "IF",
                                "args": [
                                  [ [] ],
                                  [
                                    [
                                      {
                                        "prim": "PUSH",
                                        "args": [
                                          { "prim": "string" },
                                          {
                                            "string":
                                              "WrongCondition: sp.check_signature(self.data.party1.pk, params.sig1, sp.pack(sp.record(id = self.data.id, name = 'state', seq = params.msg1.seq, state = params.msg1.state)))"
                                          }
                                        ]
                                      },
                                      { "prim": "FAILWITH" }
                                    ]
                                  ]
                                ]
                              },
                              { "prim": "DUP" },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "SWAP" },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "2" } ] },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "PAIR", "annots": [ "%seq", "%state" ] },
                              { "prim": "PUSH", "args": [ { "prim": "string" }, { "string": "state" } ] },
                              { "prim": "DIG", "args": [ { "int": "3" } ] },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "4" } ] },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "PAIR", "annots": [ "%id", "%name" ] },
                              { "prim": "PAIR" },
                              { "prim": "PACK" },
                              { "prim": "SWAP" },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "2" } ] },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "DIG", "args": [ { "int": "3" } ] },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "4" } ] },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CHECK_SIGNATURE" },
                              {
                                "prim": "IF",
                                "args": [
                                  [ [] ],
                                  [
                                    [
                                      {
                                        "prim": "PUSH",
                                        "args": [
                                          { "prim": "string" },
                                          {
                                            "string":
                                              "WrongCondition: sp.check_signature(self.data.party1.pk, params.sig2, sp.pack(sp.record(id = self.data.id, name = 'state', seq = params.msg2.seq, state = params.msg2.state)))"
                                          }
                                        ]
                                      },
                                      { "prim": "FAILWITH" }
                                    ]
                                  ]
                                ]
                              },
                              { "prim": "NIL", "args": [ { "prim": "operation" } ] },
                              { "prim": "DIG", "args": [ { "int": "2" } ] },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "3" } ] },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "CAR" },
                              { "prim": "CAR" },
                              { "prim": "CONTRACT", "args": [ { "prim": "unit" } ] },
                              { "prim": "IF_NONE", "args": [ [ [ { "prim": "PUSH", "args": [ { "prim": "unit" }, { "prim": "Unit" } ] }, { "prim": "FAILWITH" } ] ], [ [] ] ] },
                              { "prim": "DIG", "args": [ { "int": "3" } ] },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "4" } ] },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "DIG", "args": [ { "int": "4" } ] },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "5" } ] },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "ADD" },
                              { "prim": "PUSH", "args": [ { "prim": "unit" }, { "prim": "Unit" } ] },
                              { "prim": "TRANSFER_TOKENS" },
                              { "prim": "CONS" }
                            ]
                          ],
                          [
                            [
                              { "prim": "DUP" },
                              { "prim": "CAR" },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "SWAP" },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "2" } ] },
                              { "prim": "CAR" },
                              { "prim": "CAR" },
                              { "prim": "CAR" },
                              { "prim": "PAIR", "annots": [ "%seq", "%state" ] },
                              { "prim": "PUSH", "args": [ { "prim": "string" }, { "string": "state" } ] },
                              { "prim": "DIG", "args": [ { "int": "3" } ] },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "4" } ] },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "PAIR", "annots": [ "%id", "%name" ] },
                              { "prim": "PAIR" },
                              { "prim": "PACK" },
                              { "prim": "SWAP" },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "2" } ] },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "DIG", "args": [ { "int": "3" } ] },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "4" } ] },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CHECK_SIGNATURE" },
                              {
                                "prim": "IF",
                                "args": [
                                  [ [] ],
                                  [
                                    [
                                      {
                                        "prim": "PUSH",
                                        "args": [
                                          { "prim": "string" },
                                          {
                                            "string":
                                              "WrongCondition: sp.check_signature(self.data.party2.pk, params.sig1, sp.pack(sp.record(id = self.data.id, name = 'state', seq = params.msg1.seq, state = params.msg1.state)))"
                                          }
                                        ]
                                      },
                                      { "prim": "FAILWITH" }
                                    ]
                                  ]
                                ]
                              },
                              { "prim": "DUP" },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "SWAP" },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "2" } ] },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "PAIR", "annots": [ "%seq", "%state" ] },
                              { "prim": "PUSH", "args": [ { "prim": "string" }, { "string": "state" } ] },
                              { "prim": "DIG", "args": [ { "int": "3" } ] },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "4" } ] },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "PAIR", "annots": [ "%id", "%name" ] },
                              { "prim": "PAIR" },
                              { "prim": "PACK" },
                              { "prim": "SWAP" },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "2" } ] },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "DIG", "args": [ { "int": "3" } ] },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "4" } ] },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CHECK_SIGNATURE" },
                              {
                                "prim": "IF",
                                "args": [
                                  [ [] ],
                                  [
                                    [
                                      {
                                        "prim": "PUSH",
                                        "args": [
                                          { "prim": "string" },
                                          {
                                            "string":
                                              "WrongCondition: sp.check_signature(self.data.party2.pk, params.sig2, sp.pack(sp.record(id = self.data.id, name = 'state', seq = params.msg2.seq, state = params.msg2.state)))"
                                          }
                                        ]
                                      },
                                      { "prim": "FAILWITH" }
                                    ]
                                  ]
                                ]
                              },
                              { "prim": "NIL", "args": [ { "prim": "operation" } ] },
                              { "prim": "DIG", "args": [ { "int": "2" } ] },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "3" } ] },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "CAR" },
                              { "prim": "CONTRACT", "args": [ { "prim": "unit" } ] },
                              { "prim": "IF_NONE", "args": [ [ [ { "prim": "PUSH", "args": [ { "prim": "unit" }, { "prim": "Unit" } ] }, { "prim": "FAILWITH" } ] ], [ [] ] ] },
                              { "prim": "DIG", "args": [ { "int": "3" } ] },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "4" } ] },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "DIG", "args": [ { "int": "4" } ] },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "5" } ] },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "ADD" },
                              { "prim": "PUSH", "args": [ { "prim": "unit" }, { "prim": "Unit" } ] },
                              { "prim": "TRANSFER_TOKENS" },
                              { "prim": "CONS" }
                            ]
                          ]
                        ]
                      },
                      { "prim": "SWAP" },
                      { "prim": "DROP" }
                    ]
                  ],
                  [
                    [
                      { "prim": "SWAP" },
                      { "prim": "DUP" },
                      { "prim": "DUG", "args": [ { "int": "2" } ] },
                      { "prim": "CAR" },
                      { "prim": "CAR" },
                      {
                        "prim": "IF",
                        "args": [ [ [] ], [ [ { "prim": "PUSH", "args": [ { "prim": "string" }, { "string": "WrongCondition: self.data.active" } ] }, { "prim": "FAILWITH" } ] ] ]
                      },
                      { "prim": "DUP" },
                      { "prim": "CAR" },
                      { "prim": "CAR" },
                      { "prim": "DIG", "args": [ { "int": "2" } ] },
                      { "prim": "DUP" },
                      { "prim": "DUG", "args": [ { "int": "3" } ] },
                      { "prim": "CDR" },
                      { "prim": "CDR" },
                      { "prim": "CDR" },
                      { "prim": "COMPARE" },
                      { "prim": "LT" },
                      {
                        "prim": "IF",
                        "args": [
                          [ [] ],
                          [ [ { "prim": "PUSH", "args": [ { "prim": "string" }, { "string": "WrongCondition: self.data.seq < params.msg.seq" } ] }, { "prim": "FAILWITH" } ] ]
                        ]
                      },
                      { "prim": "SWAP" },
                      { "prim": "DUP" },
                      { "prim": "DUG", "args": [ { "int": "2" } ] },
                      { "prim": "DUP" },
                      { "prim": "CAR" },
                      { "prim": "SWAP" },
                      { "prim": "CDR" },
                      { "prim": "DUP" },
                      { "prim": "CAR" },
                      { "prim": "SWAP" },
                      { "prim": "CDR" },
                      { "prim": "CAR" },
                      { "prim": "DIG", "args": [ { "int": "3" } ] },
                      { "prim": "DUP" },
                      { "prim": "DUG", "args": [ { "int": "4" } ] },
                      { "prim": "CAR" },
                      { "prim": "CAR" },
                      { "prim": "SWAP" },
                      { "prim": "PAIR" },
                      { "prim": "SWAP" },
                      { "prim": "PAIR" },
                      { "prim": "SWAP" },
                      { "prim": "PAIR" },
                      { "prim": "DUG", "args": [ { "int": "2" } ] },
                      { "prim": "SWAP" },
                      { "prim": "DROP" },
                      { "prim": "DUP" },
                      { "prim": "CAR" },
                      { "prim": "CDR" },
                      { "prim": "SWAP" },
                      { "prim": "DUP" },
                      { "prim": "DUG", "args": [ { "int": "2" } ] },
                      { "prim": "CAR" },
                      { "prim": "CAR" },
                      { "prim": "PAIR", "annots": [ "%seq", "%state" ] },
                      { "prim": "PUSH", "args": [ { "prim": "string" }, { "string": "state" } ] },
                      { "prim": "DIG", "args": [ { "int": "3" } ] },
                      { "prim": "DUP" },
                      { "prim": "DUG", "args": [ { "int": "4" } ] },
                      { "prim": "CAR" },
                      { "prim": "CDR" },
                      { "prim": "CDR" },
                      { "prim": "PAIR", "annots": [ "%id", "%name" ] },
                      { "prim": "PAIR" },
                      { "prim": "PACK" },
                      { "prim": "SWAP" },
                      { "prim": "DUP" },
                      { "prim": "DUG", "args": [ { "int": "2" } ] },
                      { "prim": "CDR" },
                      { "prim": "CAR" },
                      { "prim": "DIG", "args": [ { "int": "3" } ] },
                      { "prim": "DUP" },
                      { "prim": "DUG", "args": [ { "int": "4" } ] },
                      { "prim": "CDR" },
                      { "prim": "CAR" },
                      { "prim": "CDR" },
                      { "prim": "CDR" },
                      { "prim": "CDR" },
                      { "prim": "CDR" },
                      { "prim": "CHECK_SIGNATURE" },
                      {
                        "prim": "IF",
                        "args": [
                          [ [] ],
                          [
                            [
                              {
                                "prim": "PUSH",
                                "args": [
                                  { "prim": "string" },
                                  {
                                    "string":
                                      "WrongCondition: sp.check_signature(self.data.party1.pk, params.sig1, sp.pack(sp.record(id = self.data.id, name = 'state', seq = params.msg.seq, state = params.msg.state)))"
                                  }
                                ]
                              },
                              { "prim": "FAILWITH" }
                            ]
                          ]
                        ]
                      },
                      { "prim": "DUP" },
                      { "prim": "CAR" },
                      { "prim": "CDR" },
                      { "prim": "SWAP" },
                      { "prim": "DUP" },
                      { "prim": "DUG", "args": [ { "int": "2" } ] },
                      { "prim": "CAR" },
                      { "prim": "CAR" },
                      { "prim": "PAIR", "annots": [ "%seq", "%state" ] },
                      { "prim": "PUSH", "args": [ { "prim": "string" }, { "string": "state" } ] },
                      { "prim": "DIG", "args": [ { "int": "3" } ] },
                      { "prim": "DUP" },
                      { "prim": "DUG", "args": [ { "int": "4" } ] },
                      { "prim": "CAR" },
                      { "prim": "CDR" },
                      { "prim": "CDR" },
                      { "prim": "PAIR", "annots": [ "%id", "%name" ] },
                      { "prim": "PAIR" },
                      { "prim": "PACK" },
                      { "prim": "SWAP" },
                      { "prim": "DUP" },
                      { "prim": "DUG", "args": [ { "int": "2" } ] },
                      { "prim": "CDR" },
                      { "prim": "CDR" },
                      { "prim": "DIG", "args": [ { "int": "3" } ] },
                      { "prim": "DUP" },
                      { "prim": "DUG", "args": [ { "int": "4" } ] },
                      { "prim": "CDR" },
                      { "prim": "CDR" },
                      { "prim": "CAR" },
                      { "prim": "CDR" },
                      { "prim": "CDR" },
                      { "prim": "CDR" },
                      { "prim": "CHECK_SIGNATURE" },
                      {
                        "prim": "IF",
                        "args": [
                          [ [] ],
                          [
                            [
                              {
                                "prim": "PUSH",
                                "args": [
                                  { "prim": "string" },
                                  {
                                    "string":
                                      "WrongCondition: sp.check_signature(self.data.party2.pk, params.sig2, sp.pack(sp.record(id = self.data.id, name = 'state', seq = params.msg.seq, state = params.msg.state)))"
                                  }
                                ]
                              },
                              { "prim": "FAILWITH" }
                            ]
                          ]
                        ]
                      },
                      { "prim": "SWAP" },
                      { "prim": "DUP" },
                      { "prim": "DUG", "args": [ { "int": "2" } ] },
                      { "prim": "DUP" },
                      { "prim": "CDR" },
                      { "prim": "SWAP" },
                      { "prim": "CAR" },
                      { "prim": "DUP" },
                      { "prim": "CAR" },
                      { "prim": "SWAP" },
                      { "prim": "CDR" },
                      { "prim": "CDR" },
                      { "prim": "DIG", "args": [ { "int": "3" } ] },
                      { "prim": "DUP" },
                      { "prim": "DUG", "args": [ { "int": "4" } ] },
                      { "prim": "CAR" },
                      { "prim": "CDR" },
                      { "prim": "PAIR" },
                      { "prim": "SWAP" },
                      { "prim": "PAIR" },
                      { "prim": "PAIR" },
                      { "prim": "DUG", "args": [ { "int": "2" } ] },
                      { "prim": "DROP", "args": [ { "int": "2" } ] },
                      { "prim": "NIL", "args": [ { "prim": "operation" } ] }
                    ]
                  ]
                ]
              }
            ],
            [
              {
                "prim": "IF_LEFT",
                "args": [
                  [
                    [
                      { "prim": "SWAP" },
                      { "prim": "DUP" },
                      { "prim": "DUG", "args": [ { "int": "2" } ] },
                      { "prim": "CAR" },
                      { "prim": "CAR" },
                      {
                        "prim": "IF",
                        "args": [ [ [] ], [ [ { "prim": "PUSH", "args": [ { "prim": "string" }, { "string": "WrongCondition: self.data.active" } ] }, { "prim": "FAILWITH" } ] ] ]
                      },
                      { "prim": "SWAP" },
                      { "prim": "DUP" },
                      { "prim": "DUG", "args": [ { "int": "2" } ] },
                      { "prim": "DUP" },
                      { "prim": "CDR" },
                      { "prim": "SWAP" },
                      { "prim": "CAR" },
                      { "prim": "CDR" },
                      { "prim": "PUSH", "args": [ { "prim": "bool" }, { "prim": "False" } ] },
                      { "prim": "PAIR" },
                      { "prim": "PAIR" },
                      { "prim": "DUG", "args": [ { "int": "2" } ] },
                      { "prim": "SWAP" },
                      { "prim": "DROP" },
                      { "prim": "DUP" },
                      { "prim": "CAR" },
                      { "prim": "PUSH", "args": [ { "prim": "int" }, { "int": "1" } ] },
                      { "prim": "COMPARE" },
                      { "prim": "EQ" },
                      {
                        "prim": "IF",
                        "args": [
                          [
                            [
                              { "prim": "PUSH", "args": [ { "prim": "string" }, { "string": "renounce" } ] },
                              { "prim": "DIG", "args": [ { "int": "2" } ] },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "3" } ] },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "PAIR", "annots": [ "%id", "%name" ] },
                              { "prim": "PACK" },
                              { "prim": "SWAP" },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "2" } ] },
                              { "prim": "CDR" },
                              { "prim": "DIG", "args": [ { "int": "3" } ] },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "4" } ] },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CHECK_SIGNATURE" },
                              {
                                "prim": "IF",
                                "args": [
                                  [ [] ],
                                  [
                                    [
                                      {
                                        "prim": "PUSH",
                                        "args": [
                                          { "prim": "string" },
                                          {
                                            "string":
                                              "WrongCondition: sp.check_signature(self.data.party1.pk, params.sig, sp.pack(sp.record(id = self.data.id, name = 'renounce')))"
                                          }
                                        ]
                                      },
                                      { "prim": "FAILWITH" }
                                    ]
                                  ]
                                ]
                              },
                              { "prim": "NIL", "args": [ { "prim": "operation" } ] },
                              { "prim": "DIG", "args": [ { "int": "2" } ] },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "3" } ] },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "CAR" },
                              { "prim": "CAR" },
                              { "prim": "CONTRACT", "args": [ { "prim": "unit" } ] },
                              { "prim": "IF_NONE", "args": [ [ [ { "prim": "PUSH", "args": [ { "prim": "unit" }, { "prim": "Unit" } ] }, { "prim": "FAILWITH" } ] ], [ [] ] ] },
                              { "prim": "DIG", "args": [ { "int": "3" } ] },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "4" } ] },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "DIG", "args": [ { "int": "4" } ] },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "5" } ] },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "SUB" },
                              { "prim": "DIG", "args": [ { "int": "4" } ] },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "5" } ] },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "ADD" },
                              { "prim": "PUSH", "args": [ { "prim": "unit" }, { "prim": "Unit" } ] },
                              { "prim": "TRANSFER_TOKENS" },
                              { "prim": "CONS" },
                              { "prim": "DUP" },
                              { "prim": "DIG", "args": [ { "int": "3" } ] },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "4" } ] },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "CAR" },
                              { "prim": "CONTRACT", "args": [ { "prim": "unit" } ] },
                              { "prim": "IF_NONE", "args": [ [ [ { "prim": "PUSH", "args": [ { "prim": "unit" }, { "prim": "Unit" } ] }, { "prim": "FAILWITH" } ] ], [ [] ] ] },
                              { "prim": "DIG", "args": [ { "int": "4" } ] },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "5" } ] },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "PUSH", "args": [ { "prim": "unit" }, { "prim": "Unit" } ] },
                              { "prim": "TRANSFER_TOKENS" },
                              { "prim": "CONS" },
                              { "prim": "SWAP" },
                              { "prim": "DROP" }
                            ]
                          ],
                          [
                            [
                              { "prim": "PUSH", "args": [ { "prim": "string" }, { "string": "renounce" } ] },
                              { "prim": "DIG", "args": [ { "int": "2" } ] },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "3" } ] },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "PAIR", "annots": [ "%id", "%name" ] },
                              { "prim": "PACK" },
                              { "prim": "SWAP" },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "2" } ] },
                              { "prim": "CDR" },
                              { "prim": "DIG", "args": [ { "int": "3" } ] },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "4" } ] },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CHECK_SIGNATURE" },
                              {
                                "prim": "IF",
                                "args": [
                                  [ [] ],
                                  [
                                    [
                                      {
                                        "prim": "PUSH",
                                        "args": [
                                          { "prim": "string" },
                                          {
                                            "string":
                                              "WrongCondition: sp.check_signature(self.data.party2.pk, params.sig, sp.pack(sp.record(id = self.data.id, name = 'renounce')))"
                                          }
                                        ]
                                      },
                                      { "prim": "FAILWITH" }
                                    ]
                                  ]
                                ]
                              },
                              { "prim": "NIL", "args": [ { "prim": "operation" } ] },
                              { "prim": "DIG", "args": [ { "int": "2" } ] },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "3" } ] },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "CAR" },
                              { "prim": "CONTRACT", "args": [ { "prim": "unit" } ] },
                              { "prim": "IF_NONE", "args": [ [ [ { "prim": "PUSH", "args": [ { "prim": "unit" }, { "prim": "Unit" } ] }, { "prim": "FAILWITH" } ] ], [ [] ] ] },
                              { "prim": "DIG", "args": [ { "int": "3" } ] },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "4" } ] },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "DIG", "args": [ { "int": "4" } ] },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "5" } ] },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "SUB" },
                              { "prim": "DIG", "args": [ { "int": "4" } ] },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "5" } ] },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "ADD" },
                              { "prim": "PUSH", "args": [ { "prim": "unit" }, { "prim": "Unit" } ] },
                              { "prim": "TRANSFER_TOKENS" },
                              { "prim": "CONS" },
                              { "prim": "DUP" },
                              { "prim": "DIG", "args": [ { "int": "3" } ] },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "4" } ] },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "CAR" },
                              { "prim": "CAR" },
                              { "prim": "CONTRACT", "args": [ { "prim": "unit" } ] },
                              { "prim": "IF_NONE", "args": [ [ [ { "prim": "PUSH", "args": [ { "prim": "unit" }, { "prim": "Unit" } ] }, { "prim": "FAILWITH" } ] ], [ [] ] ] },
                              { "prim": "DIG", "args": [ { "int": "4" } ] },
                              { "prim": "DUP" },
                              { "prim": "DUG", "args": [ { "int": "5" } ] },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "CDR" },
                              { "prim": "CDR" },
                              { "prim": "CAR" },
                              { "prim": "PUSH", "args": [ { "prim": "unit" }, { "prim": "Unit" } ] },
                              { "prim": "TRANSFER_TOKENS" },
                              { "prim": "CONS" },
                              { "prim": "SWAP" },
                              { "prim": "DROP" }
                            ]
                          ]
                        ]
                      },
                      { "prim": "SWAP" },
                      { "prim": "DROP" }
                    ]
                  ],
                  [
                    {
                      "prim": "IF_LEFT",
                      "args": [
                        [
                          [
                            { "prim": "SWAP" },
                            { "prim": "DUP" },
                            { "prim": "DUG", "args": [ { "int": "2" } ] },
                            { "prim": "CAR" },
                            { "prim": "CAR" },
                            {
                              "prim": "IF",
                              "args": [
                                [ [] ],
                                [ [ { "prim": "PUSH", "args": [ { "prim": "string" }, { "string": "WrongCondition: self.data.active" } ] }, { "prim": "FAILWITH" } ] ]
                              ]
                            },
                            { "prim": "DUP" },
                            { "prim": "PUSH", "args": [ { "prim": "int" }, { "int": "1" } ] },
                            { "prim": "COMPARE" },
                            { "prim": "EQ" },
                            {
                              "prim": "IF",
                              "args": [
                                [
                                  [
                                    { "prim": "SWAP" },
                                    { "prim": "DUP" },
                                    { "prim": "DUG", "args": [ { "int": "2" } ] },
                                    { "prim": "CDR" },
                                    { "prim": "CAR" },
                                    { "prim": "CDR" },
                                    { "prim": "CDR" },
                                    { "prim": "CAR" },
                                    {
                                      "prim": "IF",
                                      "args": [
                                        [
                                          [
                                            { "prim": "PUSH", "args": [ { "prim": "string" }, { "string": "WrongCondition: ~ self.data.party1.hasBond" } ] },
                                            { "prim": "FAILWITH" }
                                          ]
                                        ],
                                        [ [] ]
                                      ]
                                    },
                                    { "prim": "AMOUNT" },
                                    { "prim": "DIG", "args": [ { "int": "2" } ] },
                                    { "prim": "DUP" },
                                    { "prim": "DUG", "args": [ { "int": "3" } ] },
                                    { "prim": "CDR" },
                                    { "prim": "CAR" },
                                    { "prim": "CDR" },
                                    { "prim": "CAR" },
                                    { "prim": "CDR" },
                                    { "prim": "COMPARE" },
                                    { "prim": "EQ" },
                                    {
                                      "prim": "IF",
                                      "args": [
                                        [ [] ],
                                        [
                                          [
                                            { "prim": "PUSH", "args": [ { "prim": "string" }, { "string": "WrongCondition: self.data.party1.bond == sp.amount" } ] },
                                            { "prim": "FAILWITH" }
                                          ]
                                        ]
                                      ]
                                    },
                                    { "prim": "SWAP" },
                                    { "prim": "DUP" },
                                    { "prim": "DUG", "args": [ { "int": "2" } ] },
                                    { "prim": "DUP" },
                                    { "prim": "CAR" },
                                    { "prim": "SWAP" },
                                    { "prim": "CDR" },
                                    { "prim": "DUP" },
                                    { "prim": "CDR" },
                                    { "prim": "SWAP" },
                                    { "prim": "CAR" },
                                    { "prim": "DUP" },
                                    { "prim": "CAR" },
                                    { "prim": "SWAP" },
                                    { "prim": "CDR" },
                                    { "prim": "DUP" },
                                    { "prim": "CAR" },
                                    { "prim": "SWAP" },
                                    { "prim": "CDR" },
                                    { "prim": "CDR" },
                                    { "prim": "PUSH", "args": [ { "prim": "bool" }, { "prim": "True" } ] },
                                    { "prim": "PAIR" },
                                    { "prim": "SWAP" },
                                    { "prim": "PAIR" },
                                    { "prim": "SWAP" },
                                    { "prim": "PAIR" },
                                    { "prim": "PAIR" },
                                    { "prim": "SWAP" },
                                    { "prim": "PAIR" },
                                    { "prim": "DUG", "args": [ { "int": "2" } ] },
                                    { "prim": "SWAP" },
                                    { "prim": "DROP" }
                                  ]
                                ],
                                [
                                  [
                                    { "prim": "SWAP" },
                                    { "prim": "DUP" },
                                    { "prim": "DUG", "args": [ { "int": "2" } ] },
                                    { "prim": "CDR" },
                                    { "prim": "CDR" },
                                    { "prim": "CAR" },
                                    { "prim": "CDR" },
                                    { "prim": "CAR" },
                                    {
                                      "prim": "IF",
                                      "args": [
                                        [
                                          [
                                            { "prim": "PUSH", "args": [ { "prim": "string" }, { "string": "WrongCondition: ~ self.data.party2.hasBond" } ] },
                                            { "prim": "FAILWITH" }
                                          ]
                                        ],
                                        [ [] ]
                                      ]
                                    },
                                    { "prim": "AMOUNT" },
                                    { "prim": "DIG", "args": [ { "int": "2" } ] },
                                    { "prim": "DUP" },
                                    { "prim": "DUG", "args": [ { "int": "3" } ] },
                                    { "prim": "CDR" },
                                    { "prim": "CDR" },
                                    { "prim": "CAR" },
                                    { "prim": "CAR" },
                                    { "prim": "CDR" },
                                    { "prim": "COMPARE" },
                                    { "prim": "EQ" },
                                    {
                                      "prim": "IF",
                                      "args": [
                                        [ [] ],
                                        [
                                          [
                                            { "prim": "PUSH", "args": [ { "prim": "string" }, { "string": "WrongCondition: self.data.party2.bond == sp.amount" } ] },
                                            { "prim": "FAILWITH" }
                                          ]
                                        ]
                                      ]
                                    },
                                    { "prim": "SWAP" },
                                    { "prim": "DUP" },
                                    { "prim": "DUG", "args": [ { "int": "2" } ] },
                                    { "prim": "DUP" },
                                    { "prim": "CAR" },
                                    { "prim": "SWAP" },
                                    { "prim": "CDR" },
                                    { "prim": "DUP" },
                                    { "prim": "CAR" },
                                    { "prim": "SWAP" },
                                    { "prim": "CDR" },
                                    { "prim": "DUP" },
                                    { "prim": "CDR" },
                                    { "prim": "SWAP" },
                                    { "prim": "CAR" },
                                    { "prim": "DUP" },
                                    { "prim": "CAR" },
                                    { "prim": "SWAP" },
                                    { "prim": "CDR" },
                                    { "prim": "CDR" },
                                    { "prim": "PUSH", "args": [ { "prim": "bool" }, { "prim": "True" } ] },
                                    { "prim": "PAIR" },
                                    { "prim": "SWAP" },
                                    { "prim": "PAIR" },
                                    { "prim": "PAIR" },
                                    { "prim": "SWAP" },
                                    { "prim": "PAIR" },
                                    { "prim": "SWAP" },
                                    { "prim": "PAIR" },
                                    { "prim": "DUG", "args": [ { "int": "2" } ] },
                                    { "prim": "SWAP" },
                                    { "prim": "DROP" }
                                  ]
                                ]
                              ]
                            },
                            { "prim": "DROP" },
                            { "prim": "NIL", "args": [ { "prim": "operation" } ] }
                          ]
                        ],
                        [
                          [
                            { "prim": "SWAP" },
                            { "prim": "DUP" },
                            { "prim": "DUG", "args": [ { "int": "2" } ] },
                            { "prim": "CAR" },
                            { "prim": "CAR" },
                            {
                              "prim": "IF",
                              "args": [
                                [ [] ],
                                [ [ { "prim": "PUSH", "args": [ { "prim": "string" }, { "string": "WrongCondition: self.data.active" } ] }, { "prim": "FAILWITH" } ] ]
                              ]
                            },
                            { "prim": "DUP" },
                            { "prim": "CAR" },
                            { "prim": "DIG", "args": [ { "int": "2" } ] },
                            { "prim": "DUP" },
                            { "prim": "DUG", "args": [ { "int": "3" } ] },
                            { "prim": "CDR" },
                            { "prim": "CAR" },
                            { "prim": "CAR" },
                            { "prim": "COMPARE" },
                            { "prim": "EQ" },
                            {
                              "prim": "IF",
                              "args": [
                                [ [] ],
                                [
                                  [
                                    { "prim": "PUSH", "args": [ { "prim": "string" }, { "string": "WrongCondition: self.data.nextParty == params.party" } ] },
                                    { "prim": "FAILWITH" }
                                  ]
                                ]
                              ]
                            },
                            { "prim": "SWAP" },
                            { "prim": "DUP" },
                            { "prim": "DUG", "args": [ { "int": "2" } ] },
                            { "prim": "DUP" },
                            { "prim": "CAR" },
                            { "prim": "SWAP" },
                            { "prim": "CDR" },
                            { "prim": "DUP" },
                            { "prim": "CAR" },
                            { "prim": "SWAP" },
                            { "prim": "CDR" },
                            { "prim": "CAR" },
                            { "prim": "PUSH", "args": [ { "prim": "int" }, { "int": "1" } ] },
                            { "prim": "DIG", "args": [ { "int": "5" } ] },
                            { "prim": "DUP" },
                            { "prim": "DUG", "args": [ { "int": "6" } ] },
                            { "prim": "CDR" },
                            { "prim": "CDR" },
                            { "prim": "CDR" },
                            { "prim": "ADD" },
                            { "prim": "SWAP" },
                            { "prim": "PAIR" },
                            { "prim": "SWAP" },
                            { "prim": "PAIR" },
                            { "prim": "SWAP" },
                            { "prim": "PAIR" },
                            { "prim": "DUG", "args": [ { "int": "2" } ] },
                            { "prim": "SWAP" },
                            { "prim": "DROP" },
                            { "prim": "PUSH", "args": [ { "prim": "int" }, { "int": "0" } ] },
                            { "prim": "DIG", "args": [ { "int": "2" } ] },
                            { "prim": "DUP" },
                            { "prim": "DUG", "args": [ { "int": "3" } ] },
                            { "prim": "CAR" },
                            { "prim": "CDR" },
                            { "prim": "CAR" },
                            { "prim": "CDR" },
                            { "prim": "CDR" },
                            { "prim": "COMPARE" },
                            { "prim": "EQ" },
                            {
                              "prim": "IF",
                              "args": [
                                [ [] ],
                                [
                                  [ { "prim": "PUSH", "args": [ { "prim": "string" }, { "string": "WrongCondition: self.data.baseState.winner == 0" } ] }, { "prim": "FAILWITH" } ]
                                ]
                              ]
                            },
                            { "prim": "DUP" },
                            { "prim": "CDR" },
                            { "prim": "CDR" },
                            { "prim": "CDR" },
                            { "prim": "PUSH", "args": [ { "prim": "int" }, { "int": "1" } ] },
                            { "prim": "SWAP" },
                            { "prim": "COMPARE" },
                            { "prim": "GE" },
                            {
                              "prim": "IF",
                              "args": [
                                [ [] ],
                                [ [ { "prim": "PUSH", "args": [ { "prim": "string" }, { "string": "WrongCondition: params.sub.winning_party >= 1" } ] }, { "prim": "FAILWITH" } ] ]
                              ]
                            },
                            { "prim": "DUP" },
                            { "prim": "CDR" },
                            { "prim": "CDR" },
                            { "prim": "CDR" },
                            { "prim": "PUSH", "args": [ { "prim": "int" }, { "int": "2" } ] },
                            { "prim": "SWAP" },
                            { "prim": "COMPARE" },
                            { "prim": "LE" },
                            {
                              "prim": "IF",
                              "args": [
                                [ [] ],
                                [ [ { "prim": "PUSH", "args": [ { "prim": "string" }, { "string": "WrongCondition: params.sub.winning_party <= 2" } ] }, { "prim": "FAILWITH" } ] ]
                              ]
                            },
                            { "prim": "DUP" },
                            { "prim": "CDR" },
                            { "prim": "CDR" },
                            { "prim": "CAR" },
                            { "prim": "PUSH", "args": [ { "prim": "int" }, { "int": "0" } ] },
                            { "prim": "COMPARE" },
                            { "prim": "LT" },
                            {
                              "prim": "IF",
                              "args": [
                                [ [] ],
                                [ [ { "prim": "PUSH", "args": [ { "prim": "string" }, { "string": "WrongCondition: params.sub.bet > 0" } ] }, { "prim": "FAILWITH" } ] ]
                              ]
                            },
                            { "prim": "DUP" },
                            { "prim": "CDR" },
                            { "prim": "CDR" },
                            { "prim": "CDR" },
                            { "prim": "PUSH", "args": [ { "prim": "int" }, { "int": "1" } ] },
                            { "prim": "COMPARE" },
                            { "prim": "EQ" },
                            {
                              "prim": "IF",
                              "args": [
                                [
                                  [
                                    { "prim": "DUP" },
                                    { "prim": "CDR" },
                                    { "prim": "CDR" },
                                    { "prim": "CAR" },
                                    { "prim": "DIG", "args": [ { "int": "2" } ] },
                                    { "prim": "DUP" },
                                    { "prim": "DUG", "args": [ { "int": "3" } ] },
                                    { "prim": "CAR" },
                                    { "prim": "CDR" },
                                    { "prim": "CAR" },
                                    { "prim": "CDR" },
                                    { "prim": "CAR" },
                                    { "prim": "COMPARE" },
                                    { "prim": "GE" },
                                    {
                                      "prim": "IF",
                                      "args": [
                                        [ [] ],
                                        [
                                          [
                                            {
                                              "prim": "PUSH",
                                              "args": [ { "prim": "string" }, { "string": "WrongCondition: self.data.baseState.chips_player2 >= params.sub.bet" } ]
                                            },
                                            { "prim": "FAILWITH" }
                                          ]
                                        ]
                                      ]
                                    },
                                    { "prim": "SWAP" },
                                    { "prim": "DUP" },
                                    { "prim": "DUG", "args": [ { "int": "2" } ] },
                                    { "prim": "DUP" },
                                    { "prim": "CDR" },
                                    { "prim": "SWAP" },
                                    { "prim": "CAR" },
                                    { "prim": "DUP" },
                                    { "prim": "CAR" },
                                    { "prim": "SWAP" },
                                    { "prim": "CDR" },
                                    { "prim": "DUP" },
                                    { "prim": "CDR" },
                                    { "prim": "SWAP" },
                                    { "prim": "CAR" },
                                    { "prim": "CDR" },
                                    { "prim": "DIG", "args": [ { "int": "4" } ] },
                                    { "prim": "DUP" },
                                    { "prim": "DUG", "args": [ { "int": "5" } ] },
                                    { "prim": "CDR" },
                                    { "prim": "CDR" },
                                    { "prim": "CAR" },
                                    { "prim": "DIG", "args": [ { "int": "6" } ] },
                                    { "prim": "DUP" },
                                    { "prim": "DUG", "args": [ { "int": "7" } ] },
                                    { "prim": "CAR" },
                                    { "prim": "CDR" },
                                    { "prim": "CAR" },
                                    { "prim": "CAR" },
                                    { "prim": "ADD" },
                                    { "prim": "PAIR" },
                                    { "prim": "PAIR" },
                                    { "prim": "SWAP" },
                                    { "prim": "PAIR" },
                                    { "prim": "PAIR" },
                                    { "prim": "DUG", "args": [ { "int": "2" } ] },
                                    { "prim": "SWAP" },
                                    { "prim": "DROP" },
                                    { "prim": "SWAP" },
                                    { "prim": "DUP" },
                                    { "prim": "DUG", "args": [ { "int": "2" } ] },
                                    { "prim": "DUP" },
                                    { "prim": "CDR" },
                                    { "prim": "SWAP" },
                                    { "prim": "CAR" },
                                    { "prim": "DUP" },
                                    { "prim": "CAR" },
                                    { "prim": "SWAP" },
                                    { "prim": "CDR" },
                                    { "prim": "DUP" },
                                    { "prim": "CDR" },
                                    { "prim": "SWAP" },
                                    { "prim": "CAR" },
                                    { "prim": "DUP" },
                                    { "prim": "CAR" },
                                    { "prim": "SWAP" },
                                    { "prim": "CDR" },
                                    { "prim": "CDR" },
                                    { "prim": "DIG", "args": [ { "int": "5" } ] },
                                    { "prim": "DUP" },
                                    { "prim": "DUG", "args": [ { "int": "6" } ] },
                                    { "prim": "CDR" },
                                    { "prim": "CDR" },
                                    { "prim": "CAR" },
                                    { "prim": "DIG", "args": [ { "int": "7" } ] },
                                    { "prim": "DUP" },
                                    { "prim": "DUG", "args": [ { "int": "8" } ] },
                                    { "prim": "CAR" },
                                    { "prim": "CDR" },
                                    { "prim": "CAR" },
                                    { "prim": "CDR" },
                                    { "prim": "CAR" },
                                    { "prim": "SUB" },
                                    { "prim": "PAIR" },
                                    { "prim": "SWAP" },
                                    { "prim": "PAIR" },
                                    { "prim": "PAIR" },
                                    { "prim": "SWAP" },
                                    { "prim": "PAIR" },
                                    { "prim": "PAIR" },
                                    { "prim": "DUG", "args": [ { "int": "2" } ] },
                                    { "prim": "SWAP" },
                                    { "prim": "DROP" },
                                    { "prim": "PUSH", "args": [ { "prim": "int" }, { "int": "2000" } ] },
                                    { "prim": "DIG", "args": [ { "int": "2" } ] },
                                    { "prim": "DUP" },
                                    { "prim": "DUG", "args": [ { "int": "3" } ] },
                                    { "prim": "CAR" },
                                    { "prim": "CDR" },
                                    { "prim": "CAR" },
                                    { "prim": "CAR" },
                                    { "prim": "COMPARE" },
                                    { "prim": "EQ" },
                                    {
                                      "prim": "IF",
                                      "args": [
                                        [
                                          [
                                            { "prim": "SWAP" },
                                            { "prim": "DUP" },
                                            { "prim": "DUG", "args": [ { "int": "2" } ] },
                                            { "prim": "DUP" },
                                            { "prim": "CDR" },
                                            { "prim": "SWAP" },
                                            { "prim": "CAR" },
                                            { "prim": "DUP" },
                                            { "prim": "CAR" },
                                            { "prim": "SWAP" },
                                            { "prim": "CDR" },
                                            { "prim": "DUP" },
                                            { "prim": "CDR" },
                                            { "prim": "SWAP" },
                                            { "prim": "CAR" },
                                            { "prim": "DUP" },
                                            { "prim": "CAR" },
                                            { "prim": "SWAP" },
                                            { "prim": "CDR" },
                                            { "prim": "CAR" },
                                            { "prim": "PUSH", "args": [ { "prim": "int" }, { "int": "1" } ] },
                                            { "prim": "SWAP" },
                                            { "prim": "PAIR" },
                                            { "prim": "SWAP" },
                                            { "prim": "PAIR" },
                                            { "prim": "PAIR" },
                                            { "prim": "SWAP" },
                                            { "prim": "PAIR" },
                                            { "prim": "PAIR" },
                                            { "prim": "DUG", "args": [ { "int": "2" } ] },
                                            { "prim": "SWAP" },
                                            { "prim": "DROP" },
                                            { "prim": "PUSH", "args": [ { "prim": "int" }, { "int": "0" } ] },
                                            { "prim": "DIG", "args": [ { "int": "2" } ] },
                                            { "prim": "DUP" },
                                            { "prim": "DUG", "args": [ { "int": "3" } ] },
                                            { "prim": "CAR" },
                                            { "prim": "CDR" },
                                            { "prim": "CAR" },
                                            { "prim": "CDR" },
                                            { "prim": "CDR" },
                                            { "prim": "COMPARE" },
                                            { "prim": "NEQ" },
                                            {
                                              "prim": "IF",
                                              "args": [
                                                [
                                                  [
                                                    { "prim": "PUSH", "args": [ { "prim": "int" }, { "int": "1" } ] },
                                                    { "prim": "DIG", "args": [ { "int": "2" } ] },
                                                    { "prim": "DUP" },
                                                    { "prim": "DUG", "args": [ { "int": "3" } ] },
                                                    { "prim": "CAR" },
                                                    { "prim": "CDR" },
                                                    { "prim": "CAR" },
                                                    { "prim": "CDR" },
                                                    { "prim": "CDR" },
                                                    { "prim": "COMPARE" },
                                                    { "prim": "EQ" },
                                                    {
                                                      "prim": "IF",
                                                      "args": [
                                                        [
                                                          [
                                                            { "prim": "SWAP" },
                                                            { "prim": "DUP" },
                                                            { "prim": "DUG", "args": [ { "int": "2" } ] },
                                                            { "prim": "DUP" },
                                                            { "prim": "CDR" },
                                                            { "prim": "SWAP" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "PUSH", "args": [ { "prim": "bool" }, { "prim": "False" } ] },
                                                            { "prim": "PAIR" },
                                                            { "prim": "PAIR" },
                                                            { "prim": "DUG", "args": [ { "int": "2" } ] },
                                                            { "prim": "SWAP" },
                                                            { "prim": "DROP" },
                                                            { "prim": "NIL", "args": [ { "prim": "operation" } ] },
                                                            { "prim": "DIG", "args": [ { "int": "2" } ] },
                                                            { "prim": "DUP" },
                                                            { "prim": "DUG", "args": [ { "int": "3" } ] },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CONTRACT", "args": [ { "prim": "unit" } ] },
                                                            {
                                                              "prim": "IF_NONE",
                                                              "args": [
                                                                [ [ { "prim": "PUSH", "args": [ { "prim": "unit" }, { "prim": "Unit" } ] }, { "prim": "FAILWITH" } ] ],
                                                                [ [] ]
                                                              ]
                                                            },
                                                            { "prim": "DIG", "args": [ { "int": "3" } ] },
                                                            { "prim": "DUP" },
                                                            { "prim": "DUG", "args": [ { "int": "4" } ] },
                                                            { "prim": "CDR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "DIG", "args": [ { "int": "4" } ] },
                                                            { "prim": "DUP" },
                                                            { "prim": "DUG", "args": [ { "int": "5" } ] },
                                                            { "prim": "CDR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "SUB" },
                                                            { "prim": "DIG", "args": [ { "int": "4" } ] },
                                                            { "prim": "DUP" },
                                                            { "prim": "DUG", "args": [ { "int": "5" } ] },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "ADD" },
                                                            { "prim": "PUSH", "args": [ { "prim": "unit" }, { "prim": "Unit" } ] },
                                                            { "prim": "TRANSFER_TOKENS" },
                                                            { "prim": "CONS" },
                                                            { "prim": "DUP" },
                                                            { "prim": "DIG", "args": [ { "int": "3" } ] },
                                                            { "prim": "DUP" },
                                                            { "prim": "DUG", "args": [ { "int": "4" } ] },
                                                            { "prim": "CDR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CONTRACT", "args": [ { "prim": "unit" } ] },
                                                            {
                                                              "prim": "IF_NONE",
                                                              "args": [
                                                                [ [ { "prim": "PUSH", "args": [ { "prim": "unit" }, { "prim": "Unit" } ] }, { "prim": "FAILWITH" } ] ],
                                                                [ [] ]
                                                              ]
                                                            },
                                                            { "prim": "DIG", "args": [ { "int": "4" } ] },
                                                            { "prim": "DUP" },
                                                            { "prim": "DUG", "args": [ { "int": "5" } ] },
                                                            { "prim": "CDR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "PUSH", "args": [ { "prim": "unit" }, { "prim": "Unit" } ] },
                                                            { "prim": "TRANSFER_TOKENS" },
                                                            { "prim": "CONS" },
                                                            { "prim": "SWAP" },
                                                            { "prim": "DROP" }
                                                          ]
                                                        ],
                                                        [
                                                          [
                                                            { "prim": "SWAP" },
                                                            { "prim": "DUP" },
                                                            { "prim": "DUG", "args": [ { "int": "2" } ] },
                                                            { "prim": "DUP" },
                                                            { "prim": "CDR" },
                                                            { "prim": "SWAP" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "PUSH", "args": [ { "prim": "bool" }, { "prim": "False" } ] },
                                                            { "prim": "PAIR" },
                                                            { "prim": "PAIR" },
                                                            { "prim": "DUG", "args": [ { "int": "2" } ] },
                                                            { "prim": "SWAP" },
                                                            { "prim": "DROP" },
                                                            { "prim": "NIL", "args": [ { "prim": "operation" } ] },
                                                            { "prim": "DIG", "args": [ { "int": "2" } ] },
                                                            { "prim": "DUP" },
                                                            { "prim": "DUG", "args": [ { "int": "3" } ] },
                                                            { "prim": "CDR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CONTRACT", "args": [ { "prim": "unit" } ] },
                                                            {
                                                              "prim": "IF_NONE",
                                                              "args": [
                                                                [ [ { "prim": "PUSH", "args": [ { "prim": "unit" }, { "prim": "Unit" } ] }, { "prim": "FAILWITH" } ] ],
                                                                [ [] ]
                                                              ]
                                                            },
                                                            { "prim": "DIG", "args": [ { "int": "3" } ] },
                                                            { "prim": "DUP" },
                                                            { "prim": "DUG", "args": [ { "int": "4" } ] },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "DIG", "args": [ { "int": "4" } ] },
                                                            { "prim": "DUP" },
                                                            { "prim": "DUG", "args": [ { "int": "5" } ] },
                                                            { "prim": "CDR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "SUB" },
                                                            { "prim": "DIG", "args": [ { "int": "4" } ] },
                                                            { "prim": "DUP" },
                                                            { "prim": "DUG", "args": [ { "int": "5" } ] },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "ADD" },
                                                            { "prim": "PUSH", "args": [ { "prim": "unit" }, { "prim": "Unit" } ] },
                                                            { "prim": "TRANSFER_TOKENS" },
                                                            { "prim": "CONS" },
                                                            { "prim": "DUP" },
                                                            { "prim": "DIG", "args": [ { "int": "3" } ] },
                                                            { "prim": "DUP" },
                                                            { "prim": "DUG", "args": [ { "int": "4" } ] },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CONTRACT", "args": [ { "prim": "unit" } ] },
                                                            {
                                                              "prim": "IF_NONE",
                                                              "args": [
                                                                [ [ { "prim": "PUSH", "args": [ { "prim": "unit" }, { "prim": "Unit" } ] }, { "prim": "FAILWITH" } ] ],
                                                                [ [] ]
                                                              ]
                                                            },
                                                            { "prim": "DIG", "args": [ { "int": "4" } ] },
                                                            { "prim": "DUP" },
                                                            { "prim": "DUG", "args": [ { "int": "5" } ] },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "PUSH", "args": [ { "prim": "unit" }, { "prim": "Unit" } ] },
                                                            { "prim": "TRANSFER_TOKENS" },
                                                            { "prim": "CONS" },
                                                            { "prim": "SWAP" },
                                                            { "prim": "DROP" }
                                                          ]
                                                        ]
                                                      ]
                                                    }
                                                  ]
                                                ],
                                                [ { "prim": "NIL", "args": [ { "prim": "operation" } ] } ]
                                              ]
                                            }
                                          ]
                                        ],
                                        [ { "prim": "NIL", "args": [ { "prim": "operation" } ] } ]
                                      ]
                                    }
                                  ]
                                ],
                                [
                                  [
                                    { "prim": "DUP" },
                                    { "prim": "CDR" },
                                    { "prim": "CDR" },
                                    { "prim": "CAR" },
                                    { "prim": "DIG", "args": [ { "int": "2" } ] },
                                    { "prim": "DUP" },
                                    { "prim": "DUG", "args": [ { "int": "3" } ] },
                                    { "prim": "CAR" },
                                    { "prim": "CDR" },
                                    { "prim": "CAR" },
                                    { "prim": "CAR" },
                                    { "prim": "COMPARE" },
                                    { "prim": "GE" },
                                    {
                                      "prim": "IF",
                                      "args": [
                                        [ [] ],
                                        [
                                          [
                                            {
                                              "prim": "PUSH",
                                              "args": [ { "prim": "string" }, { "string": "WrongCondition: self.data.baseState.chips_player1 >= params.sub.bet" } ]
                                            },
                                            { "prim": "FAILWITH" }
                                          ]
                                        ]
                                      ]
                                    },
                                    { "prim": "SWAP" },
                                    { "prim": "DUP" },
                                    { "prim": "DUG", "args": [ { "int": "2" } ] },
                                    { "prim": "DUP" },
                                    { "prim": "CDR" },
                                    { "prim": "SWAP" },
                                    { "prim": "CAR" },
                                    { "prim": "DUP" },
                                    { "prim": "CAR" },
                                    { "prim": "SWAP" },
                                    { "prim": "CDR" },
                                    { "prim": "DUP" },
                                    { "prim": "CDR" },
                                    { "prim": "SWAP" },
                                    { "prim": "CAR" },
                                    { "prim": "DUP" },
                                    { "prim": "CAR" },
                                    { "prim": "SWAP" },
                                    { "prim": "CDR" },
                                    { "prim": "CDR" },
                                    { "prim": "DIG", "args": [ { "int": "5" } ] },
                                    { "prim": "DUP" },
                                    { "prim": "DUG", "args": [ { "int": "6" } ] },
                                    { "prim": "CDR" },
                                    { "prim": "CDR" },
                                    { "prim": "CAR" },
                                    { "prim": "DIG", "args": [ { "int": "7" } ] },
                                    { "prim": "DUP" },
                                    { "prim": "DUG", "args": [ { "int": "8" } ] },
                                    { "prim": "CAR" },
                                    { "prim": "CDR" },
                                    { "prim": "CAR" },
                                    { "prim": "CDR" },
                                    { "prim": "CAR" },
                                    { "prim": "ADD" },
                                    { "prim": "PAIR" },
                                    { "prim": "SWAP" },
                                    { "prim": "PAIR" },
                                    { "prim": "PAIR" },
                                    { "prim": "SWAP" },
                                    { "prim": "PAIR" },
                                    { "prim": "PAIR" },
                                    { "prim": "DUG", "args": [ { "int": "2" } ] },
                                    { "prim": "SWAP" },
                                    { "prim": "DROP" },
                                    { "prim": "SWAP" },
                                    { "prim": "DUP" },
                                    { "prim": "DUG", "args": [ { "int": "2" } ] },
                                    { "prim": "DUP" },
                                    { "prim": "CDR" },
                                    { "prim": "SWAP" },
                                    { "prim": "CAR" },
                                    { "prim": "DUP" },
                                    { "prim": "CAR" },
                                    { "prim": "SWAP" },
                                    { "prim": "CDR" },
                                    { "prim": "DUP" },
                                    { "prim": "CDR" },
                                    { "prim": "SWAP" },
                                    { "prim": "CAR" },
                                    { "prim": "CDR" },
                                    { "prim": "DIG", "args": [ { "int": "4" } ] },
                                    { "prim": "DUP" },
                                    { "prim": "DUG", "args": [ { "int": "5" } ] },
                                    { "prim": "CDR" },
                                    { "prim": "CDR" },
                                    { "prim": "CAR" },
                                    { "prim": "DIG", "args": [ { "int": "6" } ] },
                                    { "prim": "DUP" },
                                    { "prim": "DUG", "args": [ { "int": "7" } ] },
                                    { "prim": "CAR" },
                                    { "prim": "CDR" },
                                    { "prim": "CAR" },
                                    { "prim": "CAR" },
                                    { "prim": "SUB" },
                                    { "prim": "PAIR" },
                                    { "prim": "PAIR" },
                                    { "prim": "SWAP" },
                                    { "prim": "PAIR" },
                                    { "prim": "PAIR" },
                                    { "prim": "DUG", "args": [ { "int": "2" } ] },
                                    { "prim": "SWAP" },
                                    { "prim": "DROP" },
                                    { "prim": "PUSH", "args": [ { "prim": "int" }, { "int": "2000" } ] },
                                    { "prim": "DIG", "args": [ { "int": "2" } ] },
                                    { "prim": "DUP" },
                                    { "prim": "DUG", "args": [ { "int": "3" } ] },
                                    { "prim": "CAR" },
                                    { "prim": "CDR" },
                                    { "prim": "CAR" },
                                    { "prim": "CDR" },
                                    { "prim": "CAR" },
                                    { "prim": "COMPARE" },
                                    { "prim": "EQ" },
                                    {
                                      "prim": "IF",
                                      "args": [
                                        [
                                          [
                                            { "prim": "SWAP" },
                                            { "prim": "DUP" },
                                            { "prim": "DUG", "args": [ { "int": "2" } ] },
                                            { "prim": "DUP" },
                                            { "prim": "CDR" },
                                            { "prim": "SWAP" },
                                            { "prim": "CAR" },
                                            { "prim": "DUP" },
                                            { "prim": "CAR" },
                                            { "prim": "SWAP" },
                                            { "prim": "CDR" },
                                            { "prim": "DUP" },
                                            { "prim": "CDR" },
                                            { "prim": "SWAP" },
                                            { "prim": "CAR" },
                                            { "prim": "DUP" },
                                            { "prim": "CAR" },
                                            { "prim": "SWAP" },
                                            { "prim": "CDR" },
                                            { "prim": "CAR" },
                                            { "prim": "PUSH", "args": [ { "prim": "int" }, { "int": "2" } ] },
                                            { "prim": "SWAP" },
                                            { "prim": "PAIR" },
                                            { "prim": "SWAP" },
                                            { "prim": "PAIR" },
                                            { "prim": "PAIR" },
                                            { "prim": "SWAP" },
                                            { "prim": "PAIR" },
                                            { "prim": "PAIR" },
                                            { "prim": "DUG", "args": [ { "int": "2" } ] },
                                            { "prim": "SWAP" },
                                            { "prim": "DROP" },
                                            { "prim": "PUSH", "args": [ { "prim": "int" }, { "int": "0" } ] },
                                            { "prim": "DIG", "args": [ { "int": "2" } ] },
                                            { "prim": "DUP" },
                                            { "prim": "DUG", "args": [ { "int": "3" } ] },
                                            { "prim": "CAR" },
                                            { "prim": "CDR" },
                                            { "prim": "CAR" },
                                            { "prim": "CDR" },
                                            { "prim": "CDR" },
                                            { "prim": "COMPARE" },
                                            { "prim": "NEQ" },
                                            {
                                              "prim": "IF",
                                              "args": [
                                                [
                                                  [
                                                    { "prim": "PUSH", "args": [ { "prim": "int" }, { "int": "1" } ] },
                                                    { "prim": "DIG", "args": [ { "int": "2" } ] },
                                                    { "prim": "DUP" },
                                                    { "prim": "DUG", "args": [ { "int": "3" } ] },
                                                    { "prim": "CAR" },
                                                    { "prim": "CDR" },
                                                    { "prim": "CAR" },
                                                    { "prim": "CDR" },
                                                    { "prim": "CDR" },
                                                    { "prim": "COMPARE" },
                                                    { "prim": "EQ" },
                                                    {
                                                      "prim": "IF",
                                                      "args": [
                                                        [
                                                          [
                                                            { "prim": "SWAP" },
                                                            { "prim": "DUP" },
                                                            { "prim": "DUG", "args": [ { "int": "2" } ] },
                                                            { "prim": "DUP" },
                                                            { "prim": "CDR" },
                                                            { "prim": "SWAP" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "PUSH", "args": [ { "prim": "bool" }, { "prim": "False" } ] },
                                                            { "prim": "PAIR" },
                                                            { "prim": "PAIR" },
                                                            { "prim": "DUG", "args": [ { "int": "2" } ] },
                                                            { "prim": "SWAP" },
                                                            { "prim": "DROP" },
                                                            { "prim": "NIL", "args": [ { "prim": "operation" } ] },
                                                            { "prim": "DIG", "args": [ { "int": "2" } ] },
                                                            { "prim": "DUP" },
                                                            { "prim": "DUG", "args": [ { "int": "3" } ] },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CONTRACT", "args": [ { "prim": "unit" } ] },
                                                            {
                                                              "prim": "IF_NONE",
                                                              "args": [
                                                                [ [ { "prim": "PUSH", "args": [ { "prim": "unit" }, { "prim": "Unit" } ] }, { "prim": "FAILWITH" } ] ],
                                                                [ [] ]
                                                              ]
                                                            },
                                                            { "prim": "DIG", "args": [ { "int": "3" } ] },
                                                            { "prim": "DUP" },
                                                            { "prim": "DUG", "args": [ { "int": "4" } ] },
                                                            { "prim": "CDR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "DIG", "args": [ { "int": "4" } ] },
                                                            { "prim": "DUP" },
                                                            { "prim": "DUG", "args": [ { "int": "5" } ] },
                                                            { "prim": "CDR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "SUB" },
                                                            { "prim": "DIG", "args": [ { "int": "4" } ] },
                                                            { "prim": "DUP" },
                                                            { "prim": "DUG", "args": [ { "int": "5" } ] },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "ADD" },
                                                            { "prim": "PUSH", "args": [ { "prim": "unit" }, { "prim": "Unit" } ] },
                                                            { "prim": "TRANSFER_TOKENS" },
                                                            { "prim": "CONS" },
                                                            { "prim": "DUP" },
                                                            { "prim": "DIG", "args": [ { "int": "3" } ] },
                                                            { "prim": "DUP" },
                                                            { "prim": "DUG", "args": [ { "int": "4" } ] },
                                                            { "prim": "CDR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CONTRACT", "args": [ { "prim": "unit" } ] },
                                                            {
                                                              "prim": "IF_NONE",
                                                              "args": [
                                                                [ [ { "prim": "PUSH", "args": [ { "prim": "unit" }, { "prim": "Unit" } ] }, { "prim": "FAILWITH" } ] ],
                                                                [ [] ]
                                                              ]
                                                            },
                                                            { "prim": "DIG", "args": [ { "int": "4" } ] },
                                                            { "prim": "DUP" },
                                                            { "prim": "DUG", "args": [ { "int": "5" } ] },
                                                            { "prim": "CDR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "PUSH", "args": [ { "prim": "unit" }, { "prim": "Unit" } ] },
                                                            { "prim": "TRANSFER_TOKENS" },
                                                            { "prim": "CONS" },
                                                            { "prim": "SWAP" },
                                                            { "prim": "DROP" }
                                                          ]
                                                        ],
                                                        [
                                                          [
                                                            { "prim": "SWAP" },
                                                            { "prim": "DUP" },
                                                            { "prim": "DUG", "args": [ { "int": "2" } ] },
                                                            { "prim": "DUP" },
                                                            { "prim": "CDR" },
                                                            { "prim": "SWAP" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "PUSH", "args": [ { "prim": "bool" }, { "prim": "False" } ] },
                                                            { "prim": "PAIR" },
                                                            { "prim": "PAIR" },
                                                            { "prim": "DUG", "args": [ { "int": "2" } ] },
                                                            { "prim": "SWAP" },
                                                            { "prim": "DROP" },
                                                            { "prim": "NIL", "args": [ { "prim": "operation" } ] },
                                                            { "prim": "DIG", "args": [ { "int": "2" } ] },
                                                            { "prim": "DUP" },
                                                            { "prim": "DUG", "args": [ { "int": "3" } ] },
                                                            { "prim": "CDR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CONTRACT", "args": [ { "prim": "unit" } ] },
                                                            {
                                                              "prim": "IF_NONE",
                                                              "args": [
                                                                [ [ { "prim": "PUSH", "args": [ { "prim": "unit" }, { "prim": "Unit" } ] }, { "prim": "FAILWITH" } ] ],
                                                                [ [] ]
                                                              ]
                                                            },
                                                            { "prim": "DIG", "args": [ { "int": "3" } ] },
                                                            { "prim": "DUP" },
                                                            { "prim": "DUG", "args": [ { "int": "4" } ] },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "DIG", "args": [ { "int": "4" } ] },
                                                            { "prim": "DUP" },
                                                            { "prim": "DUG", "args": [ { "int": "5" } ] },
                                                            { "prim": "CDR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "SUB" },
                                                            { "prim": "DIG", "args": [ { "int": "4" } ] },
                                                            { "prim": "DUP" },
                                                            { "prim": "DUG", "args": [ { "int": "5" } ] },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "ADD" },
                                                            { "prim": "PUSH", "args": [ { "prim": "unit" }, { "prim": "Unit" } ] },
                                                            { "prim": "TRANSFER_TOKENS" },
                                                            { "prim": "CONS" },
                                                            { "prim": "DUP" },
                                                            { "prim": "DIG", "args": [ { "int": "3" } ] },
                                                            { "prim": "DUP" },
                                                            { "prim": "DUG", "args": [ { "int": "4" } ] },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CONTRACT", "args": [ { "prim": "unit" } ] },
                                                            {
                                                              "prim": "IF_NONE",
                                                              "args": [
                                                                [ [ { "prim": "PUSH", "args": [ { "prim": "unit" }, { "prim": "Unit" } ] }, { "prim": "FAILWITH" } ] ],
                                                                [ [] ]
                                                              ]
                                                            },
                                                            { "prim": "DIG", "args": [ { "int": "4" } ] },
                                                            { "prim": "DUP" },
                                                            { "prim": "DUG", "args": [ { "int": "5" } ] },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CDR" },
                                                            { "prim": "CAR" },
                                                            { "prim": "PUSH", "args": [ { "prim": "unit" }, { "prim": "Unit" } ] },
                                                            { "prim": "TRANSFER_TOKENS" },
                                                            { "prim": "CONS" },
                                                            { "prim": "SWAP" },
                                                            { "prim": "DROP" }
                                                          ]
                                                        ]
                                                      ]
                                                    }
                                                  ]
                                                ],
                                                [ { "prim": "NIL", "args": [ { "prim": "operation" } ] } ]
                                              ]
                                            }
                                          ]
                                        ],
                                        [ { "prim": "NIL", "args": [ { "prim": "operation" } ] } ]
                                      ]
                                    }
                                  ]
                                ]
                              ]
                            },
                            { "prim": "PUSH", "args": [ { "prim": "int" }, { "int": "1" } ] },
                            { "prim": "DIG", "args": [ { "int": "2" } ] },
                            { "prim": "DUP" },
                            { "prim": "DUG", "args": [ { "int": "3" } ] },
                            { "prim": "CAR" },
                            { "prim": "COMPARE" },
                            { "prim": "EQ" },
                            {
                              "prim": "IF",
                              "args": [
                                [
                                  [
                                    { "prim": "DIG", "args": [ { "int": "2" } ] },
                                    { "prim": "DUP" },
                                    { "prim": "DUG", "args": [ { "int": "3" } ] },
                                    { "prim": "CAR" },
                                    { "prim": "CDR" },
                                    { "prim": "CAR" },
                                    { "prim": "DIG", "args": [ { "int": "3" } ] },
                                    { "prim": "DUP" },
                                    { "prim": "DUG", "args": [ { "int": "4" } ] },
                                    { "prim": "CDR" },
                                    { "prim": "CDR" },
                                    { "prim": "CDR" },
                                    { "prim": "PAIR", "annots": [ "%seq", "%state" ] },
                                    { "prim": "PUSH", "args": [ { "prim": "string" }, { "string": "state" } ] },
                                    { "prim": "DIG", "args": [ { "int": "4" } ] },
                                    { "prim": "DUP" },
                                    { "prim": "DUG", "args": [ { "int": "5" } ] },
                                    { "prim": "CAR" },
                                    { "prim": "CDR" },
                                    { "prim": "CDR" },
                                    { "prim": "PAIR", "annots": [ "%id", "%name" ] },
                                    { "prim": "PAIR" },
                                    { "prim": "PACK" },
                                    { "prim": "DIG", "args": [ { "int": "2" } ] },
                                    { "prim": "DUP" },
                                    { "prim": "DUG", "args": [ { "int": "3" } ] },
                                    { "prim": "CDR" },
                                    { "prim": "CAR" },
                                    { "prim": "DIG", "args": [ { "int": "4" } ] },
                                    { "prim": "DUP" },
                                    { "prim": "DUG", "args": [ { "int": "5" } ] },
                                    { "prim": "CDR" },
                                    { "prim": "CAR" },
                                    { "prim": "CDR" },
                                    { "prim": "CDR" },
                                    { "prim": "CDR" },
                                    { "prim": "CDR" },
                                    { "prim": "CHECK_SIGNATURE" },
                                    {
                                      "prim": "IF",
                                      "args": [
                                        [ [] ],
                                        [
                                          [
                                            {
                                              "prim": "PUSH",
                                              "args": [
                                                { "prim": "string" },
                                                {
                                                  "string":
                                                    "WrongCondition: sp.check_signature(self.data.party1.pk, params.sig, sp.pack(sp.record(id = self.data.id, name = 'state', seq = self.data.seq, state = self.data.baseState)))"
                                                }
                                              ]
                                            },
                                            { "prim": "FAILWITH" }
                                          ]
                                        ]
                                      ]
                                    }
                                  ]
                                ],
                                [
                                  [
                                    { "prim": "DIG", "args": [ { "int": "2" } ] },
                                    { "prim": "DUP" },
                                    { "prim": "DUG", "args": [ { "int": "3" } ] },
                                    { "prim": "CAR" },
                                    { "prim": "CDR" },
                                    { "prim": "CAR" },
                                    { "prim": "DIG", "args": [ { "int": "3" } ] },
                                    { "prim": "DUP" },
                                    { "prim": "DUG", "args": [ { "int": "4" } ] },
                                    { "prim": "CDR" },
                                    { "prim": "CDR" },
                                    { "prim": "CDR" },
                                    { "prim": "PAIR", "annots": [ "%seq", "%state" ] },
                                    { "prim": "PUSH", "args": [ { "prim": "string" }, { "string": "state" } ] },
                                    { "prim": "DIG", "args": [ { "int": "4" } ] },
                                    { "prim": "DUP" },
                                    { "prim": "DUG", "args": [ { "int": "5" } ] },
                                    { "prim": "CAR" },
                                    { "prim": "CDR" },
                                    { "prim": "CDR" },
                                    { "prim": "PAIR", "annots": [ "%id", "%name" ] },
                                    { "prim": "PAIR" },
                                    { "prim": "PACK" },
                                    { "prim": "DIG", "args": [ { "int": "2" } ] },
                                    { "prim": "DUP" },
                                    { "prim": "DUG", "args": [ { "int": "3" } ] },
                                    { "prim": "CDR" },
                                    { "prim": "CAR" },
                                    { "prim": "DIG", "args": [ { "int": "4" } ] },
                                    { "prim": "DUP" },
                                    { "prim": "DUG", "args": [ { "int": "5" } ] },
                                    { "prim": "CDR" },
                                    { "prim": "CDR" },
                                    { "prim": "CAR" },
                                    { "prim": "CDR" },
                                    { "prim": "CDR" },
                                    { "prim": "CDR" },
                                    { "prim": "CHECK_SIGNATURE" },
                                    {
                                      "prim": "IF",
                                      "args": [
                                        [ [] ],
                                        [
                                          [
                                            {
                                              "prim": "PUSH",
                                              "args": [
                                                { "prim": "string" },
                                                {
                                                  "string":
                                                    "WrongCondition: sp.check_signature(self.data.party2.pk, params.sig, sp.pack(sp.record(id = self.data.id, name = 'state', seq = self.data.seq, state = self.data.baseState)))"
                                                }
                                              ]
                                            },
                                            { "prim": "FAILWITH" }
                                          ]
                                        ]
                                      ]
                                    }
                                  ]
                                ]
                              ]
                            },
                            { "prim": "DIG", "args": [ { "int": "2" } ] },
                            { "prim": "DUP" },
                            { "prim": "DUG", "args": [ { "int": "3" } ] },
                            { "prim": "DUP" },
                            { "prim": "CAR" },
                            { "prim": "SWAP" },
                            { "prim": "CDR" },
                            { "prim": "DUP" },
                            { "prim": "CDR" },
                            { "prim": "SWAP" },
                            { "prim": "CAR" },
                            { "prim": "CDR" },
                            { "prim": "DIG", "args": [ { "int": "5" } ] },
                            { "prim": "DUP" },
                            { "prim": "DUG", "args": [ { "int": "6" } ] },
                            { "prim": "CDR" },
                            { "prim": "CAR" },
                            { "prim": "CAR" },
                            { "prim": "PUSH", "args": [ { "prim": "int" }, { "int": "3" } ] },
                            { "prim": "SUB" },
                            { "prim": "PAIR" },
                            { "prim": "PAIR" },
                            { "prim": "SWAP" },
                            { "prim": "PAIR" },
                            { "prim": "DUG", "args": [ { "int": "3" } ] },
                            { "prim": "DIG", "args": [ { "int": "2" } ] },
                            { "prim": "DROP" },
                            { "prim": "SWAP" },
                            { "prim": "DROP" }
                          ]
                        ]
                      ]
                    }
                  ]
                ]
              }
            ]
          ]
        },
        { "prim": "PAIR" }
      ]
    ]
  }
]`;
    const storage = '{\n' +
        '  "prim": "Pair",\n' +
        '  "args": [\n' +
        '    {\n' +
        '      "prim": "Pair",\n' +
        '      "args": [\n' +
        '        { "prim": "True" },\n' +
        '        { "prim": "Pair", "args": [ { "prim": "Pair", "args": [ { "int": "1000" }, { "prim": "Pair", "args": [ { "int": "1000" }, { "int": "0" } ] } ] }, { "string": "1234" } ] }\n' +
        '      ]\n' +
        '    },\n' +
        '    {\n' +
        '      "prim": "Pair",\n' +
        '      "args": [\n' +
        '        {\n' +
        '          "prim": "Pair",\n' +
        '          "args": [\n' +
        '            { "int": "1" },\n' +
        '            {\n' +
        '              "prim": "Pair",\n' +
        '              "args": [\n' +
        '                { "prim": "Pair", "args": [ { "string": "tz1WxrQuZ4CK1MBUa2GqUWK1yJ4J6EtG1Gwi" }, { "int": "10000000" } ] },\n' +
        '                {\n' +
        '                  "prim": "Pair",\n' +
        '                  "args": [ { "prim": "False" }, { "prim": "Pair", "args": [ { "int": "0" }, { "string": "edpkuvNy6TuQ2z8o9wnoaTtTXkzQk7nhegCHfxBc4ecsd4qG71KYNG" } ] } ]\n' +
        '                }\n' +
        '              ]\n' +
        '            }\n' +
        '          ]\n' +
        '        },\n' +
        '        {\n' +
        '          "prim": "Pair",\n' +
        '          "args": [\n' +
        '            {\n' +
        '              "prim": "Pair",\n' +
        '              "args": [\n' +
        '                { "prim": "Pair", "args": [ { "string": "tz1Rp4Bv8iUhYnNoCryHQgNzN2D7i3L1LF9C" }, { "int": "10000000" } ] },\n' +
        '                {\n' +
        '                  "prim": "Pair",\n' +
        '                  "args": [ { "prim": "False" }, { "prim": "Pair", "args": [ { "int": "0" }, { "string": "edpkufVmvzkm4oFQ7WcF5NJbq9BFB2mWRsm4Dyh2spMDuDxWSQWHuT" } ] } ]\n' +
        '                }\n' +
        '              ]\n' +
        '            },\n' +
        '            { "int": "0" }\n' +
        '          ]\n' +
        '        }\n' +
        '      ]\n' +
        '    }\n' +
        '  ]\n' +
        '}';

    const result = await conseiljs.TezosNodeWriter.sendContractOriginationOperation(tezosNode, keyStore, 0, undefined,
        100000, '', 1000, 100000, contract, storage, conseiljs.TezosParameterFormat.Micheline);
    console.log(`Injected operation group id ${result.operationGroupID}`);
}

deployContract();


