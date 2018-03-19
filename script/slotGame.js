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

  const slotSymbol = (symbol = []) => {
    if (!symbol.length) throw '심볼은 최소 6가지로 채워주세요!';
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
    const getUserLank = () => {
      const lankSlotPattern = [
        ['별', '별', '별'], // 1
        ['종', '종', '종'], // 2
        ['체리', '체리', '체리'], // 3 -- 나머지 4
      ];

      let i, j;
      for (i = 0; i < lankSlotPattern.length; i++) {
        let current, tmp = [];
        for (j = 0; j < 3; j++) {
          current = lankSlotPattern[i][j];
          if (current === resultSymbol[j]) tmp.push(current);
          else if (resultSymbol[j] === '별') return 3;
          if (tmp.length === 3) return i;
        }
      }
    };

    return () => {
      const userLank = getUserLank();

      switch (userLank + 1) {
        case 1:
          userSlotMoney += gameMoney * 4;
          break;
        case 2:
          userSlotMoney += gameMoney * 3;
          break;
        case 3:
          userSlotMoney += gameMoney * 2;
          break;
        case 4:
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