
// 1등 : 3개의 릴에 모두 별모양이 나온 경우 배팅금액의 4배를 돌려받음
// 2등 : 3개의 릴에 모두 벨모양이 나온 경우 배팅금액의 3배를 돌려받음
// 3등 : 3개의 릴에 모두 체리모양이 나온 경우 배팅금액의 2배를 돌려받음,
//   4등 : 3개의 릴 중 하나에 별이 나온 경우 동일하게 나온 경우 배팅금액을 돌려받음

const slotGame = (() => {
  let userSlotMoney = 1000;
  let gameMoney;
  let resultSymbol = [];
  let target;

  const render = () => {
    target.render(resultSymbol, userSlotMoney, gameMoney);
  };
  const clear = () => {
    const removePoint = resultSymbol.length;
    resultSymbol = resultSymbol.slice(removePoint);
  };

  const slotSymbol = (symbol) => {
    if (!(Array.isArray(symbol))) throw 'symbol List는 배열 형태로만 셋팅할 수 있습니다.';
    let symbolList = [];

    const setRandomSymbol = () => {
      let randomCount = 0,
        i = 0,
        MAX = 3,
        tmp = [];
      for (i; i < MAX ; i++) {
        randomCount = Math.floor(Math.random() * symbolList.length);
        tmp.push(symbolList[randomCount]);
        if (tmp.length === MAX) return tmp;
      }
    };

    symbolList = symbol;
    return setRandomSymbol();
  };

  const changeGameMoney = (() => {
    const filterSlot = (pattern = [], slots = [], matchedCb) => {
      for (let i = 0; i < pattern.length; i++) {
        let cur;
        let resultSlot = [];
        for (let j = 0; j < slots.length; j++) {
          cur = pattern[i][j];
          if (cur === slots[j]) resultSlot.push(cur);
          if (resultSlot.length === 3) {
            return matchedCb(resultSlot, i);
          }
        }
      }
    };

    const checkAnswerSlot = () => {
      const slotPattern = [
        ['7', '7', '7'],
        ['7', '7', '6'],
        ['7', '6', '7'],
        ['7', 'ㅁ', '7'],
        ['7', '*', '7'],
        ['#', 'M', '#'],
        ['#', '#', '#']
      ];
      const getMatchSlotPattern = function(resultSlot, matchIndex) {
        return resultSlot;
      };
      let filterSlotSymbol = filterSlot(slotPattern, resultSymbol, getMatchSlotPattern);
      return filterSlotSymbol;
    };

    const getUserLank = () => {
      const filterSlotSymbol = checkAnswerSlot();

      if (!filterSlotSymbol) {
        render();
        throw '순위권에 없습니다!';
      }

      const lankSlotPattern = [
        ['별', '별', '별'],
        ['종', '종', '종'],
        ['체리', '체리', '체리'],
        ['7', 'ㅁ', '7'],
        ['#', '7', '#']
      ];
      const getUserLank = (resultSlot, matchIndex) => matchIndex;
      const userLank = filterSlot(lankSlotPattern, filterSlotSymbol, getUserLank);
      return userLank;
    };

    return () => {
      const userLank = getUserLank();

      switch (userLank) {
        case 1:
          userSlotMoney += gameMoney * 4;
          break;
        case 2:
          userSlotMoney += gameMoney * 3;
          break;
        case 3:
          userSlotMoney += gameMoney * 2;
          break;
        case 4 || 5:
          userSlotMoney += gameMoney * 1;
          break;
      }
      render();
      clear();
    }
  })();

  const setSlotSymbol = () => {

    const symbolList = ['별', '종', '체리', '초밥', '샵', '바나나'];
    resultSymbol = slotSymbol(symbolList);
    changeGameMoney();
  };

  const init = (money) => {
    target.init();
    gameMoney = money;
    userSlotMoney -= money;
    setSlotSymbol();
  };

  return {
    setRenderer: (renderer) => {
      target = renderer;
    },
    start: () => {
      let bettingMoney;
      if (!(confirm('슬롯머신 게임을 시작하겠습니까?'))) return;
      if (userSlotMoney === 0) throw '판돈이 부족합니다.';
      bettingMoney = prompt('판돈을 입력해주세요!');
      if (!bettingMoney) throw '판돈을 입력해주세요!';
      if (bettingMoney > userSlotMoney) {
        console.log('현재 보유 머니 ( ' + userSlotMoney + ' ) 보다 판돈 ( ' + bettingMoney + ' ) 이 큽니다.');
        return;
      }
      init(bettingMoney);
    }
  }
})();

const con = (() => {
  return {
    init: function() {
      console.clear();
    },
    render: (resultSymbol, userSlotMoney, gameMoney) => {
      console.log(resultSymbol);
      console.group('Slot의 결과!');
      console.log('사용자의 게임 머니는 --> ', userSlotMoney);
      console.log('사용자가 배팅한 머니는 --> ', gameMoney);
      resultSymbol.forEach((cur, index) => {
        console.log('사용자의 Slot값은 --> ' + index + ' : ' + cur );
      });
      console.groupEnd();
    }
  }
})();