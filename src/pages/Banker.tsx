import { useState } from 'react'
import '../App.css'

const softGreen = "#6FC276"
const softRed = "#FF6961"

interface Player {
  name: string,
  buyIn: number,
  balance: number,
  diff: number
}

interface Payout {
  from: string,
  to: string,
  amount: number
}

function App() {

  const [state, setState] = useState(0);

  const [pot, setPot] = useState(0);
  const [players, setPlayers] = useState<Record<string, Player>>({});

  const [newPlayerName, setNewPlayerName] = useState("");
  const [newBuyIn, setNewBuyIn] = useState(0);

  const [totalAccountedFor, setTotalAccountedFor] = useState(0);
  const [payouts, setPayouts] = useState<Payout[]>([]);

  const addPlayer = () => {
    let newPlayers = {...players}
    if (!Object.keys(newPlayers).includes(newPlayerName)) {
      newPlayers[newPlayerName] = {
        name: newPlayerName,
        buyIn: 0,
        balance: 0,
        diff: 0
      }
    }

    console.log("EDITING PLAYER")
    newPlayers[newPlayerName].buyIn += newBuyIn;
    setPlayers(newPlayers);
    setPot(pot + newBuyIn);
    (document.getElementById("newPlayerName") as HTMLInputElement).value = ""
    setNewPlayerName("")
  }

  const removePlayer = (name: string) => {
    let newPlayers = {...players}
    let buyIn = newPlayers[name].buyIn

    delete newPlayers[name]
    setPlayers(newPlayers)

    setPot(pot - buyIn)
  }

  const setPlayerBalance = (name: string, balance: number) => {
    let newPlayers = {...players}
    newPlayers[name].balance = balance;

    var total = 0;
    for (let player of Object.keys(newPlayers)) {
      total += newPlayers[player].balance;
    }
    setPlayers(newPlayers);
    setTotalAccountedFor(total);
    console.log(newPlayers)
  }

  // const calculatePayouts = () => {
  //   console.log("players", players)
  //   const newPlayers = {...players};
    
  //   let profit: Player[] = [];
  //   let loss: Player[] = [];

  //   console.log("HELLO")
  //   console.log(newPlayers)

  //   // separate players that lost or gained money
  //   for (let player of Object.keys(players)) {
  //     players[player].diff = Math.abs(players[player].balance - players[player].buyIn)
  //     if (players[player].balance > players[player].buyIn) {
  //       profit.push(players[player])
  //     } else if (players[player].balance < players[player].buyIn) {
  //       loss.push(players[player])
  //     }
  //   }

  //   // sort by most winnings/losings
  //   profit.sort((a, b) => (a.diff) - (b.diff))
  //   loss.sort((a, b) => (a.diff) - (b.diff))

  //   // work from the outside in

  //   var profitIndex = 0;
  //   var loserIndex = 0;

    
  //   var iters = 0;
  //   const payouts: Payout[] = [];
  //   while (profitIndex < profit.length && loserIndex < loss.length) {
  //     const p = profit[profitIndex].diff;
  //     const l = loss[loserIndex].diff; // positive number

  //     console.log("Profit", profit[profitIndex], "Loss", loss[loserIndex])

  //     var diff = p - l;

  //     console.log("diff", diff)
  //     if (diff > 0) {
  //         // current profit has exausted the current loss, move onto the next one
  //         payouts.push({
  //           from: loss[loserIndex].name,
  //           to: profit[profitIndex].name,
  //           amount: diff
  //         })
  //         // loss[loserIndex].diff -= diff;
  //         profit[profitIndex].diff -= diff;

  //         loserIndex++;
  //         console.log("Positive Diff", payouts[payouts.length - 1], profit, loss)
  //     } else if (diff < 0) { // 10 - 15 = -5
  //       // current profit is less than the current loss, so let's not send all of the loss money
  //       payouts.push({
  //         from: loss[loserIndex].name,
  //         to: profit[profitIndex].name,
  //         amount: p
  //       })
  //       console.log("Negative Diff", payouts[payouts.length - 1], loss[loserIndex].diff, loss);
  //       loss[loserIndex].diff -= p;
  //       // profit[profitIndex].diff -= p;

  //       console.log("LDelta", loss[loserIndex].diff + p, loss[loserIndex].diff)
  //       console.log("PDelta", profit[profitIndex].diff + p, profit[profitIndex].diff)

  //       profitIndex++;
  //     } else {
  //       // payout works out perfectly, progress both indices
  //       payouts.push({
  //         from: loss[loserIndex].name,
  //         to: profit[profitIndex].name,
  //         amount: diff
  //       });
  //       profitIndex++;
  //       loserIndex++;
  //       console.log("Even Diff", payouts[payouts.length - 1], profit, loss)
  //     }
  //     iters++;
  //   }

  //   console.log(payouts);
  //   setPayouts(payouts);
  //   setState(2);
  // }

  const calculatePayouts = () => {
    const newPlayers = { ...players };

    let profit: Player[] = [];
    let loss: Player[] = [];

    // Separate players that lost or gained money
    for (let player of Object.keys(newPlayers)) {
      newPlayers[player].diff = newPlayers[player].balance - newPlayers[player].buyIn;
      if (newPlayers[player].diff > 0) {
        profit.push(newPlayers[player]);
      } else if (newPlayers[player].diff < 0) {
        loss.push(newPlayers[player]);
      }
    }

    // Sort by most winnings/losings
    profit.sort((a, b) => b.diff - a.diff);
    loss.sort((a, b) => a.diff - b.diff);

    let profitIndex = 0;
    let lossIndex = 0;
    const payouts: Payout[] = [];

    while (profitIndex < profit.length && lossIndex < loss.length) {
      const p = profit[profitIndex];
      const l = loss[lossIndex];
      const amount = Math.min(p.diff, -l.diff);

      payouts.push({
        from: l.name,
        to: p.name,
        amount: amount
      });

      p.diff -= amount;
      l.diff += amount;

      if (p.diff === 0) {
        profitIndex++;
      }
      if (l.diff === 0) {
        lossIndex++;
      }
    }

    setPayouts(payouts);
    setState(2);
  }

  return (
    <>
      <h1>Poker Banker</h1>
      {
        state == 0 ? <h3>Current pot: ${pot}</h3> :
        <>
            <h3>Pot Accounted For: <span style={{color: totalAccountedFor == pot ? softGreen : softRed}} >${totalAccountedFor}</span> / ${pot}</h3>
        </>
      }

    { // list of players
      Object.keys(players).length > 0 &&
      <>
      <hr />
      <p>Players: </p>
      {
       state == 1 && <p>Enter the total amount each player ended with: </p> 
      }
        {
          Object.keys(players).map((name, i) => {
            return (
              <div key={i}>
                <input disabled={state == 2} style={{ width: "5rem", textAlign: "center"}} defaultValue={name}></input>
                <input 
                  style={{ width: state == 0 ? "2rem" : "4rem", textAlign: "center", color: state == 1 ? (players[name].balance - players[name].buyIn >= 0 ? softGreen : softRed) : "" }} 
                  disabled={state != 1} 
                  placeholder={state == 2 ? players[name].balance.toString() : players[name].buyIn.toString()}
                  onChange={(e) => setPlayerBalance(name, parseFloat(e.target.value))}
                ></input>
                {state == 0 && <button style={{color: softRed}} onClick={() => removePlayer(name)} >Remove</button>}
                {state == 2 && <input style={{ width: "4rem", textAlign: "center", color: state == 2 ? (players[name].balance - players[name].buyIn >= 0 ? softGreen : softRed) : "" }} defaultValue={(players[name].balance > players[name].buyIn ? "+" : "") + (players[name].balance - players[name].buyIn)} disabled></input> }
              </div>
            )
          })
        }
        </>
    }

    {
      // add new player menu
      state == 0 &&
      <>
          <hr />

          <p>Add a new player</p>

          <input id="newPlayerName" type="text" placeholder="Name" onChange={(e) => setNewPlayerName(e.target.value)}></input>
          <br />
          <input style={{ width: "8rem" }} type="number" placeholder="$$$" onChange={(e) => setNewBuyIn(parseInt(e.target.value))}></input>
          <button style={{color: softGreen}} onClick={addPlayer} >Buy {Object.keys(players).includes(newPlayerName) ? "Again" : "In"}</button>


      </>
    }
    
    { 
      // cash out button
      state == 0 && Object.keys(players).length > 0 &&
      <>
        <hr />
        <button onClick={() => setState(1)} >Cash Out</button>
      </>
    }

    {
      // confirm payout
      state == 1 && totalAccountedFor == pot &&
      <>
        <hr />
        <button onClick={() => calculatePayouts()}>Confirm Payouts</button>
      </>
    }

    {
      // payout summary
      state == 2 &&
      <>
        <hr />
        {
          payouts.map((payout, i) => {
            return (<p key={i}> <b>{payout.from}</b> pay <b>{payout.amount}</b> to <b>{payout.to}</b></p>)
          })
        }
      </>
    }


    </>
  )
}

export default App
