// スコアボード
const scoreBoardData = (scoreBoard: any) => {
  let scoreBoardData: any[] = [];
  playerRanks(scoreBoard).forEach((e: any) => {
    let first = e.first;
    let second = e.second;
    let third = e.third;
    let fourth = e.fourth;
    let total = (first + second + third + fourth)
    let avarage = (first * 1 + second * 2 + third * 3 + fourth * 4) / total;
    let firstRate = (first / total * 100);
    let secondRate = (second / total * 100);
    let thirdRate = (third / total * 100);
    let fourthRate = (fourth / total * 100);
    if (total == 0) {
      avarage = 0;
      firstRate = 0;
      secondRate = 0;
      thirdRate = 0;
      fourthRate = 0;
    }
    scoreBoardData.push({
      id: e.id,
      nickName: e.nickName,
      avarage: avarage.toFixed(2),
      first: first,
      second: second,
      third: third,
      fourth: fourth,
      firstRate: firstRate.toFixed(1),
      secondRate: secondRate.toFixed(1),
      thirdRate: thirdRate.toFixed(1),
      fourthRate: fourthRate.toFixed(1),
    })
  })
  return scoreBoardData;
}

const scoreBoardPersonalData = (scoreBoard: any, id: string) => {
  return scoreBoardData(scoreBoard).find((e: any) => {
    return e.id == id;
  })
}

// スコアボード計算用

const ranks = (scoreBoard: any) => {
  let ranks: any[] = [];
  scoreBoard.scores.forEach((scores: any) => {
    let gameRanks = [];
    const sortedScores = scores.sort((a: any, b: any) => b.score - a.score);
    for (let i = 0; i < scoreBoard.players.length; i++) {
      const rank = sortedScores.findIndex((score: any) => score.id == scoreBoard.players[i].id) + 1;
      gameRanks.push(
        { id: scoreBoard.players[i].id, rank: rank }
      )
    }
    ranks.push(gameRanks)
  })
  return ranks;
}

const playerRanks = (scoreBoard: any) => {
  let playerRanks = [];
  for (let i = 0; i < scoreBoard.players.length; i++) {
    let first = 0;
    let second = 0;
    let third = 0;
    let fourth= 0;
    ranks(scoreBoard).forEach((ranks: any) => {
      ranks.forEach((rank: any) => {
        if(rank.id === scoreBoard.players[i].id) {
          switch (rank.rank) {
            case 1:
              first += 1;
              break;
            case 2:
              second += 1;
              break;
            case 3:
              third += 1;
              break;
            case 4:
              fourth += 1;
              break;
          }
        } 
      })
    })
    playerRanks.push({
      id: scoreBoard.players[i].id,
      nickName: scoreBoard.players[i].nickName,
      first: first,
      second: second,
      third: third,
      fourth: fourth
    })
  }
  return playerRanks;
}


// フリー
const freeScorePersonalData = (freeScores: any) => {
  const ranks = freeScores.map((score: any) => {
    return score.rank;
  });
  let first = 0;
  let second = 0;
  let third = 0;
  let fourth = 0;
  for (let i = 0; i < ranks.length; i++) {
    switch (ranks[i]) {
      case 1:
        first += 1;
        break;
      case 2:
        second += 1;
        break;
      case 3:
        third += 1;
        break;
      case 4:
        fourth += 1;
        break;
    }
  }
  const total = ranks.reduce((currentTotal: number, score: number) => {
    return score + currentTotal;
  }, 0)
  let avarage: number = total / ranks.length;
  let firstRatio: string = (first / ranks.length * 100).toFixed(1);
  let secondRatio: string = (second/ ranks.length * 100).toFixed(1);
  let thirdRatio: string = (third/ ranks.length * 100).toFixed(1);
  let fourthRatio: string = (fourth/ ranks.length * 100).toFixed(1);
  if (total == 0) {
    avarage = 0;
    firstRatio = "0";
    secondRatio = "0";
    thirdRatio = "0";
    fourthRatio = "0";
  }
  return {
    length: ranks.length,
    avarage: avarage.toFixed(2),
    first: first,
    second: second,
    third: third,
    fourth: fourth,
    firstRatio: firstRatio,
    secondRatio: secondRatio,
    thirdRatio: thirdRatio,
    fourthRatio: fourthRatio
  }
}

export {
  scoreBoardData,
  scoreBoardPersonalData,
  freeScorePersonalData
}



