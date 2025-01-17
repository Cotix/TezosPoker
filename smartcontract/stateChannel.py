import smartpy as sp


class Card(object):

    def __init__(self, rank, suit):
        self.rank = rank
        self.suit = suit

    def __eq__(self, other):
        return (self.rank == other.rank)

    def __ne__(self, other):
        return (self.rank != other.rank)

    def __lt__(self, other):
        return (self.rank < other.rank)

    def __le__(self, other):
        return (self.rank <= other.rank)

    def __gt__(self, other):
        return (self.rank > other.rank)

    def __ge__(self, other):
        return (self.rank >= other.rank)


class PokerGame(sp.Contract):
    def __init__(self):
        self.init(winner=0,
                  chips_player1=1000,
                  chips_player2=1000)

    def card_decrypt(card):
        dcard = card  # .decrypt()  # TODO
        rank = dcard % 13
        suit = dcard % 4
        return Card(rank, suit)

    @sp.entry_point
    def play(self, params):
        sp.verify(self.data.winner == 0)
        # TODO more checks

        hand1 = [params.card1]
        hand2 = [params.card2]

        # sp.for i in sp.range(0, 5):
        #     hand1.append(self.card_decrypt(params.cards1[i]))
        #     hand2.append(self.card_decrypt(params.cards2[i]))

        score1, score2 = max(hand1), max(hand2)  # evaluate(hand1, hand2)
        sp.
        if score1 > score2:
            self.data.chips_player1 += params.half_pot * 2
            self.data.chips_player2 -= params.half_pot
        sp.
        if score2 > score1:
            self.data.chips_player2 += params.half_pot * 2
            self.data.chips_player1 -= params.half_pot


# State Channels - Example for illustrative purposes only.

# This example demonstrates the automatic creation of State Channels
# from regular one-on-one Smart Contracts.
# Its use case is typically implementing state channels
# for games, bi-directionnal payments, etc.
# As demonstrated in the test, this process is fully automatic for two parties.

# We suppose the base contract has a winner field in its data:
# - winner == 0 -> no winner yet
# - winner == 1 -> party 1 wins
# - else        -> party 2 wins

class StateChannel(sp.Contract):
    # The StateChannel constructor takes:
    # - two parties party1 and party2;
    # - a unique id which needs to be chosen unique by party1 and party2;
    #   (the parties can simply concatenate two nonces they randomly choose)
    # - a base contract,
    # - no_alternation_moves to declare moves from the base contract
    #   that do not require alternative calls,
    # - and a parameter no_checks to remove signature checks for
    #   helper off-chain contracts.
    def __init__(self,
                 id,
                 party1,
                 party2,
                 baseContract,
                 no_alternation_moves=set(),
                 no_checks=set()
                 ):
        self.no_checks = no_checks
        self.no_alternation_moves = no_alternation_moves
        self.baseContract = baseContract
        state = {'id': id,
                 'party1': party1,
                 'party2': party2,
                 'baseState': baseContract.data,
                 'seq': 0,
                 'active': True,
                 'nextParty': 1}
        self.init(**state)

    # During the installment phase, they both place bonds on-chain.

    # Helper function to place a bond.
    def setBondInternal(self, party):
        sp.verify(~party.hasBond)
        sp.verify(party.bond == sp.amount)
        party.hasBond = True

    # Both parties need to call channelSetBond on-chain to start with.
    # It is checked that their bonds correspond to what they agreeded upon.
    @sp.entry_point
    def channelSetBond(self, params):
        sp.verify(self.data.active)
        sp.
        if params.party == 1:
            self.setBondInternal(self.data.party1)
        sp. else:
        self.setBondInternal(self.data.party2)


# At any point, a party can renounce.
# Doing so means that they keep their looserClaim.
@sp.entry_point
def channelRenounce(self, params):
    sp.verify(self.data.active)
    self.data.active = False
    sp.
    if params.party == 1:
        if 1 not in self.no_checks:
            sig = params.sig.open_some() if self.no_checks else params.sig
            sp.verify(
                sp.check_signature(self.data.party1.pk, sig, sp.pack(sp.record(id=self.data.id, name="renounce"))))
        sp.send(self.data.party2.address, self.data.party1.bond + self.data.party2.bond - self.data.party1.looserClaim)
        sp.send(self.data.party1.address, self.data.party1.looserClaim)
    sp. else:
    if 2 not in self.no_checks:
        sig = params.sig.open_some() if self.no_checks else params.sig
        sp.verify(sp.check_signature(self.data.party2.pk, sig, sp.pack(sp.record(id=self.data.id, name="renounce"))))
    sp.send(self.data.party1.address, self.data.party1.bond + self.data.party2.bond - self.data.party2.looserClaim)
    sp.send(self.data.party2.address, self.data.party2.looserClaim)


# When a party wants to come back on-chain from off-chain interactions,
# it can do two different things: renounce or call channelNewState.
# channelNewState is called with a state that has been agreed upon off-chain and
# two signatures to prove the agreement.
@sp.entry_point
def channelNewState(self, params):
    sp.verify(self.data.active)
    sp.verify(self.data.seq < params.msg.seq)
    self.data.seq = params.msg.seq
    self.checkSeqStateSignature(self.data.party1, params.sig1, params.msg.seq, params.msg.state)
    self.checkSeqStateSignature(self.data.party2, params.sig2, params.msg.seq, params.msg.state)
    self.data.baseState = params.msg.state


# Helper function, a state together with a sequence number seq is signed by a party.
def checkSeqStateSignature(self, party, sig, seq, state):
    sp.verify(
        sp.check_signature(party.pk, sig, sp.pack(sp.record(id=self.data.id, name="state", seq=seq, state=state))))


# Helper function checking that one party has double signed a message.
def checkHasDoubleSigned(self, party, params):
    self.checkSeqStateSignature(party, params.sig1, params.msg1.seq, params.msg1.state)
    self.checkSeqStateSignature(party, params.sig2, params.msg2.seq, params.msg2.state)


# channelAccuseDoubleMove is called on-chain when a party, or anyone,
# wishes to accuse another party of signing two different messages at a given stage.
@sp.entry_point
def channelAccuseDoubleMove(self, params):
    sp.verify(self.data.active)
    self.data.active = False
    sp.verify(params.msg1.seq == params.msg2.seq)
    sp.set_type(params.msg1.seq, sp.TInt)
    sp.set_type(params.msg1.state, sp.type_of(self.data.baseState))
    sp.set_type(params.msg2.state, sp.type_of(self.data.baseState))
    sp.verify(sp.pack(params.msg1) != sp.pack(params.msg2))
    sp.
    if params.party == 1:
        self.checkHasDoubleSigned(self.data.party1, params)
        sp.send(self.data.party2.address, self.data.party1.bond + self.data.party2.bond)
    sp. else:
    self.checkHasDoubleSigned(self.data.party2, params)
    sp.send(self.data.party1.address, self.data.party1.bond + self.data.party2.bond)


# buildExtraMessages is called during the contract creation.
# Its purpose is to enable the dynamic creation of messages.
# Its default implementation is to do nothing.
# Here, it iterates and calls nextState on each of the base contract messages.
def buildExtraMessages(self):
    for (name, f) in self.baseContract.messages.items():
        def message(self, params):
            formerBaseData = self.baseContract.data
            self.baseContract.data = self.data.baseState
            self.nextState(name, params, f.addedMessage.f)
            self.baseContract.data = formerBaseData

        self.addMessage(sp.entry_point(message, name))


# Helper function that transforms a message for the base contract
# into a new message for the State Channel.
def nextState(self, messageName, params, f):
    sp.verify(self.data.active)
    if messageName not in self.no_alternation_moves:
        sp.verify(self.data.nextParty == params.party)
    self.data.seq += 1
    self.baseContract.data = self.data.baseState

    ## We call winnerUpdated if/when the base contract updates its winner
    @self.data.baseState.winner.on_update
    def winnerUpdated(x, v):
        sp.
        if self.data.baseState.winner != 0:
            sp.
            if self.data.baseState.winner == 1:
                self.data.active = False
                sp.send(self.data.party1.address,
                        self.data.party1.bond + self.data.party2.bond - self.data.party2.looserClaim)
                sp.send(self.data.party2.address, self.data.party2.looserClaim)
            sp. else:
            self.data.active = False
            sp.send(self.data.party2.address,
                    self.data.party1.bond + self.data.party2.bond - self.data.party1.looserClaim)
            sp.send(self.data.party1.address, self.data.party1.looserClaim)


f(self.baseContract, params.sub)
sp.
if params.party == 1:
    if 1 not in self.no_checks:
        sig = params.sig.open_some() if len(self.no_checks) else params.sig
        self.checkSeqStateSignature(self.data.party1, sig, self.data.seq, self.data.baseState)
sp. else:
if 2 not in self.no_checks:
    sig = params.sig.open_some() if len(self.no_checks) else params.sig
    self.checkSeqStateSignature(self.data.party2, sig, self.data.seq, self.data.baseState)
self.data.nextParty = 3 - self.data.nextParty

if "templates" not in __name__:
    @sp.add_test(name="StateChannels", profile=True)
    def test():
        scenario = sp.test_scenario()

        def party(address, pk, bond, looserClaim):
            return sp.record(hasBond=False, pk=pk, bond=bond, address=address, looserClaim=looserClaim)

        alice = sp.test_account("Alice")
        bob = sp.test_account("Bob")

        scenario.table_of_contents()

        scenario.h2("Parties")
        scenario.p("We start with two accounts Alice and Bob:")
        scenario.show([alice, bob])
        scenario.p("We derive two parties for Alice and Bob to play Nim together.")
        party1 = party(alice.address, alice.public_key, sp.tez(12), sp.tez(2))
        party2 = party(bob.address, bob.public_key, sp.tez(15), sp.tez(3))
        scenario.show([party1, party2])
        scenario.p("These fields represent:")
        scenario.show(
            sp.record(hasBond="determination if a bond has been paid by the party", pk="public key of the party",
                      bond="bond posted by the party", address="address of the party",
                      looserClaim="claim received in case of renounce by the party"), stripStrings=True)

        scenario.h2("Game")
        baseGame = PokerGame()
        scenario.p(
            "They agree to play a Nim game in a state channel, according to the following base game, baseGame = nim.NimGame(size = 5, bound = 2).")
        scenario += baseGame

        scenario.h2("On-chain installment")
        scenario.h3("First the contract")
        scenario.p(
            'A contract StateChannel("1234", party1, party2, baseGame) is defined on the blockchain where "1234" is a unique id for both parties party1 and party2 (it has never been used for any of them).')
        c1 = StateChannel("1234",
                          party1,
                          party2,
                          baseGame,
                          no_alternation_moves=[])
        c1.title = ("On-chain interaction")
        scenario += c1

        scenario.h3("And then the bonds")
        scenario.p("Both parties send their bonds.")
        scenario += c1.channelSetBond(party=1).run(amount=sp.tez(12))
        scenario += c1.channelSetBond(party=2).run(amount=sp.tez(15))

        scenario.h2("Off-chain contracts")
        scenario.p("They're now ready to interact off-chain.")
        cAlice = StateChannel("1234",
                              party1,
                              party2,
                              baseGame,
                              no_checks=[1],
                              no_alternation_moves=[])
        cAlice.title = ("Alice private off-chain contract")
        cAlice.execMessageClass = "execMessageAlice"
        scenario += cAlice
        scenario += cAlice.channelSetBond(party=1).run(amount=sp.tez(12))
        scenario += cAlice.channelSetBond(party=2).run(amount=sp.tez(15))

        cBob = StateChannel("1234",
                            party1,
                            party2,
                            baseGame,
                            no_checks=[2],
                            no_alternation_moves=[])
        cBob.title = ("Bob private off-chain contract")
        scenario += cBob
        cBob.execMessageClass = "execMessageBob"
        scenario += cBob.channelSetBond(party=1).run(amount=sp.tez(12))
        scenario += cBob.channelSetBond(party=2).run(amount=sp.tez(15))

        def aliceSignsState():
            scenario.p("Alice signs the current state.")
            result = sp.make_signature(alice.secret_key, sp.pack(
                sp.record(id=c1.data.id, name="state", seq=cAlice.data.seq, state=cAlice.data.baseState)))
            result = scenario.compute(result)
            scenario.show(sp.record(seq=cAlice.data.seq, sig=result))
            return result

        def bobSignsState():
            scenario.p("Bob signs the current state.")
            result = sp.make_signature(bob.secret_key, sp.pack(
                sp.record(id=c1.data.id, name="state", seq=cBob.data.seq, state=cBob.data.baseState)))
            result = scenario.compute(result)
            scenario.show(sp.record(seq=cBob.data.seq, sig=result))
            return result

        scenario.h2("Off-chain interactions")
        scenario.h3("Alice")
        scenario += cAlice.play(party=1,
                                sub=sp.record(half_pot=50, card1=5, card2=10),
                                sig=sp.none)
        scenario.p("Alice sends data to Bob")
        sig1 = scenario.compute(aliceSignsState())
        scenario.show(sig1)
        scenario += cBob.play(party=1,
                              sub=sp.record(half_pot=50, card1=5, card2=10),
                              sig=sp.some(sig1))

        # scenario.h3("Bob")
        # scenario += cBob  .play(party = 2,
        #                           sub   = sp.record(half_pot = 50, card2 = 5, card1 = 10),
        #                           sig   = sp.none)
        # sig2 = bobSignsState()
        # scenario.p("Bob sends data to Alice")
        # scenario += cAlice.play(party = 2,
        #                           sub   = sp.record(half_pot = 50, card1 = 5, card2 = 10),
        #                           sig   = sp.some(sig2))

        # scenario.h3("Alice (wrong move example)")
        # scenario += cAlice.play(party = 1,
        #                           sub   = sp.record(half_pot = 50),
        #                           sig   = sp.none).run(valid = False)

        # scenario.h3("Alice")
        # scenario += cAlice.play(party = 1,
        #                           sub   = sp.record(half_pot = 50),
        #                           sig   = sp.none)
        # scenario.p("Alice sends data to Bob")
        # scenario += cBob  .play(party = 1,
        #                           sub   = sp.record(half_pot = 50),
        #                           sig   = sp.some(aliceSignsState()))

        # scenario.h3("Bob (wrong move example)")
        # scenario += cBob  .play(party = 2,
        #                           sub   = sp.record(half_pot = 50),
        #                           sig   = sp.none).run(valid = False)

        # scenario.h3("Bob")
        # scenario += cBob  .play(party = 2,
        #                           sub   = sp.record(half_pot = 50),
        #                           sig   = sp.none)
        # scenario.p("Bob sends data to Alice")
        # scenario += cAlice.play(party = 2,
        #                           sub   = sp.record(half_pot = 50),
        #                           sig   = sp.some(bobSignsState()))

        # scenario.h3("Alice")
        # scenario += cAlice.play(party = 1,
        #                           sub   = sp.record(half_pot = 50),
        #                           sig   = sp.none)
        # scenario.p("Alice sends data to Bob with a bad signature")
        # scenario += cBob  .play(party = 1,
        #                           sub   = sp.record(half_pot = 50),
        #                           sig   = sp.some(sp.make_signature(alice.secret_key, sp.bytes('0x0000')))).run(valid = False)

        # scenario.p("Alice sends data to Bob with a former signature")
        # scenario += cBob  .play(party = 1,
        #                           sub   = sp.record(half_pot = 50),
        #                           sig   = sp.some(sig1)).run(valid = False)
        # scenario.p("Alice sends data to Bob with proper signature")
        # scenario += cBob  .play(party = 1,
        #                           sub   = sp.record(half_pot = 50),
        #                           sig   = sp.some(aliceSignsState()))

        # scenario.h3("Bob")
        # scenario += cBob  .remove(party = 2,
        #                           sub   = sp.record(cell=4, k=2),
        #                           sig   = sp.none)
        # scenario.p("Bob sends data to Alice")
        # scenario += cAlice.remove(party = 2,
        #                           sub   = sp.record(cell=4, k=2),
        #                           sig   = sp.some(bobSignsState()))
        #
        # scenario.h2("Back On-chain")
        # scenario += c1.channelNewState(sig1 = aliceSignsState(), sig2 = bobSignsState(), msg = sp.record(seq = cBob.data.seq, state = cAlice.data.baseState))
        #
        # scenario.h3("Alice, on-chain")
        # scenario += cAlice.remove(party = 1,
        #                           sub   = sp.record(cell=4, k=1),
        #                           sig   = sp.none)
        # scenario += c1    .remove(party = 1,
        #                           sub   = sp.record(cell=4, k=1),
        #                           sig   = aliceSignsState())
        # scenario += cBob  .remove(party = 1,
        #                           sub   = sp.record(cell=4, k=1),
        #                           sig   = sp.some(aliceSignsState()))
        #
        # scenario.h3("Bob, on-chain")
        # scenario += cBob  .remove(party = 2,
        #                           sub   = sp.record(cell=3, k=1),
        #                           sig   = sp.none)
        # scenario += c1    .remove(party = 2,
        #                           sub   = sp.record(cell=3, k=1),
        #                           sig   = bobSignsState())
        # scenario += cAlice.remove(party = 2,
        #                           sub   = sp.record(cell=3, k=1),
        #                           sig   = sp.some(bobSignsState()))
        #
        # scenario.h3("Alice, on-chain")
        # scenario += cAlice.remove(party = 1,
        #                           sub   = sp.record(cell=1, k=2),
        #                           sig   = sp.none)
        # scenario += c1    .remove(party = 1,
        #                           sub   = sp.record(cell=1, k=2),
        #                           sig   = aliceSignsState())
        # scenario += cBob  .remove(party = 1,
        #                           sub   = sp.record(cell=1, k=2),
        #                           sig   = sp.some(aliceSignsState()))
        #
        # scenario.h3("Bob, on-chain")
        # scenario += cBob  .remove(party = 2,
        #                           sub   = sp.record(cell=3, k=1),
        #                           sig   = sp.none)
        # scenario += c1    .remove(party = 2,
        #                           sub   = sp.record(cell=3, k=1),
        #                           sig   = bobSignsState())
        # scenario += cAlice.remove(party = 2,
        #                           sub   = sp.record(cell=3, k=1),
        #                           sig   = sp.some(bobSignsState()))
        #
        # scenario.h3("Alice, on-chain")
        # scenario += cAlice.remove(party = 1,
        #                           sub   = sp.record(cell=0, k=1),
        #                           sig   = sp.none)
        # scenario += c1    .remove(party = 1,
        #                           sub   = sp.record(cell=0, k=1),
        #                           sig   = aliceSignsState())
        # scenario += cBob  .remove(party = 1,
        #                           sub   = sp.record(cell=0, k=1),
        #                           sig   = sp.some(aliceSignsState()))
        #
        # scenario.h3("Bob, on-chain")
        # scenario += cBob  .claim(party=2, sub=sp.record(winner=2), sig = sp.none)
        # scenario += c1    .claim(party=2, sub=sp.record(winner=2), sig = bobSignsState())
        #
        # scenario.table_of_contents()