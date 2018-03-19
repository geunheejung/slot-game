var game = (function () {
  var userSlotMoney = 1000;
  var gameMoney;
  var resultSymbol = [];
  var target;

  var clear = function() {
    var removePoint = resultSymbol.length;
    resultSymbol = resultSymbol.slice(removePoint);
  };

  var render = function() {
    target.render(resultSymbol, userSlotMoney, gameMoney);
  };
  
  var setLank = (function() {
    var resultArr = [];
    var userLank = 0;

    return function() {    
      var slotPattern = [
        [7, 7, 7],
        [7, 7, 6],
        [7, 6, 7],
        [7, 'ㅁ', 7],
        [7, '*', 7],
        ['#', 'M', '#'],
        ['#', '#', '#']
      ];
      var lankSlotPattern = [
        [7, 7, 7],
        [7, 6, 7],
        ['#', '#', '#'],
        [7, 'ㅁ', 7],
        ['#', 7, '#']
      ];


      var filterSlot = function(pattern, slots, matchedCb) {
        var i, j, patternLen = pattern.length;
        var resultSlot;
        var patternSlot;

        for (i = 0; i < patternLen; i++) {
          resultSlot = [];
          for (j = 0; j < pattern[i].length; j++) {
            patternSlot = pattern[i][j];
            if (patternSlot === slots[j]) resultSlot.push(patternSlot);
            if (resultSlot.length === pattern[i].length) {
              return matchedCb(resultSlot, i);
            }
          }
        }
      };

      var getMatchSlotPattern = function(resultSlot, matchIndex) {
        return resultSlot;
      };
      var getUserLank = function(resultSlot, matchIndex) {
        return matchIndex;
      };

      resultArr = filterSlot(slotPattern, resultSymbol, getMatchSlotPattern);
      // console.log('resultArr :', resultArr);
      userLank = filterSlot(lankSlotPattern, resultArr, getUserLank);

      switch (userLank) {
        case 0:
          console.log(userLank);
          userSlotMoney += gameMoney * 4;
          console.log(userSlotMoney);
          break;
        case 1:
          console.log(userLank);
          userSlotMoney += gameMoney * 3;
          console.log(userSlotMoney);
          break;
        case 2:
          console.log(userLank);
          userSlotMoney += gameMoney * 2;
          console.log(userSlotMoney);
          break;
        default:
          console.log(userLank);
          userSlotMoney += gameMoney;
          console.log(userSlotMoney);
          break;
      }
      render();
      clear();
    }
  })();

  var setSlotSymbol = function (slotWheelCount) {
    var testSymbol = ['7', '6', '*', 'ㅁ', '0', '#', 'M'];
    var randomSlotIndex;
    var i, j, symbolLen = testSymbol.length;

    for (i = 0; i < symbolLen; i++) {
      for (j = 0; j < slotWheelCount; j++) {
        randomSlotIndex = Math.floor(Math.random() * symbolLen);
      }
      resultSymbol.push(testSymbol[randomSlotIndex]);
    }
    setLank();
  };

  var init = function(money, wheel) {
    target.init();
    gameMoney = money;
    userSlotMoney -= money;
    setSlotSymbol(wheel);
  };
  
  return {
    start: function() {    
      var bettingMoney, userWheelCount;
      if (!(confirm('슬롯머신 게임을 시작하겠습니까?'))) return;    
      if (userSlotMoney === 0) return console.log('Money가 부족합니다.');
      bettingMoney = prompt('판돈을 걸어 주세요!');

      if (bettingMoney > userSlotMoney) {
        console.log('현재 보유 머니 ( ' + userSlotMoney + ' ) 보다 판돈 ( ' + bettingMoney + ' ) 이 큽니다.');
        return; 
      }
      userWheelCount = prompt('몇번 돌리실건가요?');                                     
      init(bettingMoney, userWheelCount);      
    },
    setRenderer: function(renderer) {      
      target = renderer;
    } 
  }
})();

var con = (function () {
  return {
    init: function() {
      console.clear();
    },
    render: function(resultSymbol, userSlotMoney, gameMoney) {
      console.group('Slot의 결과!');
      console.log('사용자의 게임 머니는 --> ', userSlotMoney);
      console.log('사용자가 배팅한 머니는 --> ', gameMoney);
      resultSymbol.forEach(function(cur, index) {
        console.log('사용자의 Slot값은 --> ' + index + ' : ' + cur );
      });
      console.groupEnd();        
    }
  }
})();

game.setRenderer(con);
document.getElementById('test-btn').onclick = game.start;