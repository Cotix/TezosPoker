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


def evaluate(hand1, hand2):
    tlist = []  # create a list to store total_point

    def point(hand):  # point()function to calculate partial score

        ranklist = []
        for card in hand:
            ranklist.append(card.rank)
        c_sum = ranklist[0] * 13 ** 4 + ranklist[1] * 13 ** 3 + ranklist[2] * 13 ** 2 + ranklist[3] * 13 + ranklist[4]
        return c_sum

    def isRoyal(
            hand):  # returns the total_point and prints out 'Royal Flush' if true, if false, pass down to isStraightFlush(hand)

        flag = True
        h = 10
        Cursuit = hand[0].suit
        Currank = 14
        total_point = h * 13 ** 5 + point(hand)
        for card in hand:
            if card.suit != Cursuit or card.rank != Currank:
                flag = False
                break
            else:
                Currank -= 1
        if flag:
            tlist.append(total_point)
        else:
            isStraightFlush(hand)

    def isStraightFlush(
            hand):  # returns the total_point and prints out 'Straight Flush' if true, if false, pass down to isFour(hand)

        flag = True
        h = 9
        Cursuit = hand[0].suit
        Currank = hand[0].rank
        total_point = h * 13 ** 5 + point(hand)
        for card in hand:
            if card.suit != Cursuit or card.rank != Currank:
                flag = False
                break
            else:
                Currank -= 1
        if flag:
            tlist.append(total_point)
        else:
            isFour(hand)

    def isFour(
            hand):  # returns the total_point and prints out 'Four of a Kind' if true, if false, pass down to isFull()
        h = 8
        Currank = hand[
            1].rank  # since it has 4 identical ranks,the 2nd one in the sorted listmust be the identical rank
        count = 0
        total_point = h * 13 ** 5 + point(hand)
        for card in hand:
            if card.rank == Currank:
                count += 1
        if not count < 4:
            tlist.append(total_point)
        else:
            isFull(hand)

    def isFull(hand):  # returns the total_point and prints out 'Full House' if true, if false, pass down to isFlush()

        h = 7
        total_point = h * 13 ** 5 + point(hand)
        mylist = []  # create a list to store ranks
        for card in hand:
            mylist.append(card.rank)
        rank1 = hand[0].rank  # The 1st rank and the last rank should be different in a sorted list
        rank2 = hand[-1].rank
        num_rank1 = mylist.count(rank1)
        num_rank2 = mylist.count(rank2)
        if (num_rank1 == 2 and num_rank2 == 3) or (num_rank1 == 3 and num_rank2 == 2):
            tlist.append(total_point)
        else:
            isFlush(hand)

    def isFlush(hand):  # returns the total_point and prints out 'Flush' if true, if false, pass down to isStraight()

        flag = True
        h = 6
        total_point = h * 13 ** 5 + point(hand)
        Cursuit = hand[0].suit
        for card in hand:
            if not (card.suit == Cursuit):
                flag = False
                break
        if flag:
            tlist.append(total_point)
        else:
            isStraight(hand)

    def isStraight(hand):

        flag = True
        h = 5
        total_point = h * 13 ** 5 + point(hand)
        Currank = hand[0].rank  # this should be the highest rank
        for card in hand:
            if card.rank != Currank:
                flag = False
                break
            else:
                Currank -= 1
        if flag:
            tlist.append(total_point)
        else:
            isThree(hand)

    def isThree(hand):
        h = 4
        total_point = h * 13 ** 5 + point(hand)
        Currank = hand[2].rank  # In a sorted rank, the middle one should have 3 counts if flag=True
        mylist = []
        for card in hand:
            mylist.append(card.rank)
        if mylist.count(Currank) == 3:
            tlist.append(total_point)
        else:
            isTwo(hand)

    def isTwo(hand):  # returns the total_point and prints out 'Two Pair' if true, if false, pass down to isOne()
        h = 3
        total_point = h * 13 ** 5 + point(hand)
        rank1 = hand[
            1].rank  # in a five cards sorted group, if isTwo(), the 2nd and 4th card should have another identical rank
        rank2 = hand[3].rank
        mylist = []
        for card in hand:
            mylist.append(card.rank)
        if mylist.count(rank1) == 2 and mylist.count(rank2) == 2:
            tlist.append(total_point)
        else:
            isOne(hand)

    def isOne(hand):  # returns the total_point and prints out 'One Pair' if true, if false, pass down to isHigh()
        h = 2
        total_point = h * 13 ** 5 + point(hand)
        mylist = []  # create an empty list to store ranks
        mycount = []  # create an empty list to store number of count of each rank
        for card in hand:
            mylist.append(card.rank)
        for each in mylist:
            count = mylist.count(each)
            mycount.append(count)
        if mycount.count(2) == 2 and mycount.count(
                1) == 3:  # There should be only 2 identical numbers and the rest are all different
            tlist.append(total_point)
        else:
            isHigh(hand)

    def isHigh(hand):  # returns the total_point and prints out 'High Card'

        h = 1
        total_point = h * 13 ** 5 + point(hand)

        tlist.append(total_point)

    hand1 = sorted(hand1, reverse=True)
    isRoyal(hand1)

    hand2 = sorted(hand2, reverse=True)
    isRoyal(hand2)

    return tlist[0], tlist[1]


def card_decrypt(card):
    dcard = card.decrypt()  # TODO
    rank = dcard % 13
    suit = dcard % 4
    return Card(rank, suit)


class PokerGame(sp.Contract):
    def __init__(self):
        self.init(winner=0,
                  chips_player1=1000,
                  chips_player2=1000)

    @sp.entry_point
    def play(self, params):
        sp.verify(self.data.winner == 0)
        # TODO more checks

        hand1 = [card_decrypt(params.cards1[0]),
                 card_decrypt(params.cards1[1]),
                 card_decrypt(params.cards1[2]),
                 card_decrypt(params.cards1[3]),
                 card_decrypt(params.cards1[4])]
        hand2 = [card_decrypt(params.cards2[0]),
                 card_decrypt(params.cards2[1]),
                 card_decrypt(params.cards2[2]),
                 card_decrypt(params.cards2[3]),
                 card_decrypt(params.cards2[4])]
        score1, score2 = 1, 2  # evaluate(hand1, hand2)
        if score1 > score2:
            self.data.chips_player1 += params.half_pot*2
            self.data.chips_player2 -= params.half_pot
        elif score2 > score1:
            self.data.chips_player2 += params.half_pot*2
            self.data.chips_player1 -= params.half_pot
