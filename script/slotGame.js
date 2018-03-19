const slotSymbol = (() => {
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

  return {
    setting: (symbol) => {
      if (!(Array.isArray(symbol))) throw 'symbol List는 배열 형태로만 셋팅할 수 있습니다.';
      symbolList = symbol;
      return setRandomSymbol();
    },
  }
})();

const game = (() => {
  let userSlotMoney = 1000;
  let gameMoney;
  let resultSymbol = [];
  let target;

  const clear = () => {
    const removePoint = resultSymbol.length;
    resultSymbol = resultSymbol.slice(removePoint);
  };

  const render = () => {
    target.render(resultSymbol, userSlotMoney, gameMoney);
  };

  const lank = (() => {
    let userLank;
    return {
      enrollment: () => {
        const slotPattern = [
          ['7', '7', '7'],
          ['7', '7', '6'],
          ['7', '6', '7'],
          ['7', 'ㅁ', '7'],
          ['7', '*', '7'],
          ['#', 'M', '#'],
          ['#', '#', '#']
        ];
        const lankSlotPattern = [
          ['7', '7', '7'],
          ['7', '6', '7'],
          ['#', '#', '#'],
          ['7', 'ㅁ', '7'],
          ['#', '7', '#']
        ];
        let filterSlotSymbol;

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

        const getMatchSlotPattern = function(resultSlot, matchIndex) {
          return resultSlot;
        };
        const getUserLank = function(resultSlot, matchIndex) {
          return matchIndex;
        };

        filterSlotSymbol = filterSlot(slotPattern, resultSymbol, getMatchSlotPattern);
        userLank = filterSlot(lankSlotPattern, filterSlotSymbol, getUserLank);
      },
      rewardMoney: () => {
        if (typeof userLank === 'undefined') {
          render();
          throw '순위권에 없습니다!';
        }
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
    }
  })();


  const setSlotSymbol = () => {
    const symbolList = ['7', '6', '7', 'ㅁ', '#', 'M'];
    resultSymbol = slotSymbol.setting(symbolList);
    lank.enrollment();
    lank.rewardMoney();
  };

  const init = (money) => {
    target.init();
    gameMoney = money;
    userSlotMoney -= money;
    setSlotSymbol();
  };

  return {
    start: () => {
      let bettingMoney;
      if (!(confirm('슬롯머신 게임을 시작하겠습니까?'))) return;
      if (userSlotMoney === 0) throw '판돈이 부족합니다.';
      bettingMoney = parseInt(prompt('판돈을 걸어 주세요!'));
      if (!bettingMoney) throw '판돈을 입력해주세요!';
      if (bettingMoney > userSlotMoney) {
        console.log('현재 보유 머니 ( ' + userSlotMoney + ' ) 보다 판돈 ( ' + bettingMoney + ' ) 이 큽니다.');
        return;
      }

      init(bettingMoney);
    },
    setRenderer: (renderer) => {
      target = renderer;
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

game.setRenderer(con);
document.getElementById('test-btn').onclick = game.start;