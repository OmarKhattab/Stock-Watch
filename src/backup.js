import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button, Divider, List } from "semantic-ui-react";
const Fragment = React.Fragment;
class App extends Component {
  state = {
    stockData: "",
    url:
      "https://api.robinhood.com/quotes/?symbols=MSFT,FB,TSLA,MDB,BABA,NVDA,AMD,PANW,WDAY,AAPL,TEAM,NFLX,SHOP,INTC,SYF",
    test: "",
    Loading: true
  };

 delay = (callback, time) => {
      return new Promise(function(resolve) {
        setTimeout(function() { callback(); resolve(); }, time);
      });
    }

 componentWillUpdate(nextProps, nextState) {
 const SymbolStyle = { color: "#e5e5e5" };
 if(nextState.stockData !== this.state.stockData) {
    fetch(this.state.url)
      .then(res => res.json())
      .then(this.delay(function() {}, 3000)) // waits 3s
      .then(
        res => {
          const sortedRes = res["results"].sort(function(a, b) {
            return b.ask_price - b.bid_price - (a.ask_price - a.bid_price);
          });
          console.log(sortedRes);
          this.setState(
            {
              stockData: (
                <List>
                  {" "}
                  {sortedRes.map(item => (
                    <List.Item key={item.symbol}>
                      <List.Content>
                        <List.Header style={SymbolStyle}>
                          {item.symbol}
                        </List.Header>
                        <List.List className="fontcolor">
                          <List.Item> Bid Price: {item.bid_price}</List.Item>
                          <List.Item> Ask Price: {item.ask_price}</List.Item>
                          <List.Item>
                            {" "}
                            Spread:{" "}
                            {(item.ask_price - item.bid_price).toFixed(2)}
                          </List.Item>
                          <List.Item> Last Trade Price: {(parseFloat(item.last_trade_price).toFixed(2))}</List.Item>
                        </List.List>
                      </List.Content>
                    </List.Item>
                  ))}{" "}
                </List>
              )
            },
            () => console.log(res["results"])
          );
        },
        res => this.setState({ stockData: <div> error </div> })
      );

    return true;
  } else {
    return false;
  }
  }

  componentDidMount() {
    const SymbolStyle = { color: "#e5e5e5" };

    fetch(this.state.url)
      .then(res => res.json())
      .then(
      res => {
        const sortedRes = res["results"].sort(function (a, b) {
          return b.ask_price - b.bid_price - (a.ask_price - a.bid_price);
        });
        this.setState(
          {
            stockData: (
              <List>
                {" "}
                {sortedRes.map(item => (
                  <List.Item key={item.symbol}>
                    <List.Content>
                      <List.Header style={SymbolStyle}>
                        {item.symbol}
                      </List.Header>
                      <List.List className="fontcolor">
                        <List.Item> Bid Price: {item.bid_price}</List.Item>
                        <List.Item> Ask Price: {item.ask_price}</List.Item>
                        <List.Item>
                          {" "}
                          Spread:{" "}
                          {(item.ask_price - item.bid_price).toFixed(2)}
                        </List.Item>
                      </List.List>
                    </List.Content>
                  </List.Item>
                ))}{" "}
              </List>
            )
          },
          () => console.log(res["results"])
        );
      },
      res => this.setState({ stockData: <div> error </div> })
      );
  }

  render() {
    return (
      <div className="App">
        {this.state.Loading ? <div className="fontcolor"> Loading </div> : null}
        <Button onClick={() => this.setState({ test: this.state.test + 1 })}>
          {" "}
          Test{" "}
        </Button>
        <div> {this.state.test} </div>
        <div> {this.state.stockData} </div>
      </div>
    );
  }
}

export default App;



// WITH DELAY INSIDE res

 componentWillUpdate(nextProps, nextState) {
 if(nextState.stockData !== this.state.stockData) {
    fetch(this.state.url)
      .then(res => res.json())
      .then(this.delay(function() {
              res => {
                const sortedRes = res["results"].sort(function(a, b) {
                  return b.ask_price - b.bid_price - (a.ask_price - a.bid_price);
                });
                console.log(sortedRes);
                this.setState(
                  {
                    stockData: sortedRes
                  },
                //  () => console.log("SORTED RES", sortedRes)
                );
              },
              res => this.setState({ error: true })
      }, 3000)) // waits 3s
      return true;
    }
    else {
      return false;
    }
  }

  //  get data from api func
   getDataFromApi = () => {
      fetch(this.state.url)
        .then(res => res.json())
        .then(
          res => {
            const sortedRes = res["results"].sort(function(a, b) {
              return b.ask_price - b.bid_price - (a.ask_price - a.bid_price);
            });
            this.setState(
              {
                stockData: sortedRes
              },
              function() {
                setTimeout(
                  function() {
                    this.setState({
                      Loading: false
                    });
                  }.bind(this),
                  3000
                );
              }.bind(this)
            );
          },
          res => this.setState({ error: true })
        );

    };


//

  componentWillUpdate(nextProps, nextState) {
    const SymbolStyle = { color: "#e5e5e5" };
    let sortedRes = ''
    fetch(this.state.url)
      .then(res => res.json())
      .then(
      res => {
        sortedRes = res["results"].sort(function (a, b) {
          return b.ask_price - b.bid_price - (a.ask_price - a.bid_price);
        });
        this.setState(
          {
            stockData: sortedRes
          },
          () => console.log(res["results"])
        )
      },
      res => this.setState({ error:true })
      );

    return true;
  }



// ORIGINAL WITH SET interval
import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button, Divider, List } from "semantic-ui-react";
const Fragment = React.Fragment;
class App extends Component {
  state = {
    stockData: [],
    url:
      "https://api.robinhood.com/quotes/?symbols=MSFT,FB,TSLA,MDB,BABA,NVDA,AMD,PANW,WDAY,AAPL,TEAM,NFLX,SHOP,INTC,SYF",
    test: "",
    Loading: true,
    error: false
  };

  delay = (callback, time) => {
    return new Promise(function(resolve) {
      setTimeout(function() {
        callback();
        resolve();
      }, time);
    });
  };

  getDataFromApi = () => {
    fetch(this.state.url)
      .then(res => res.json())
      .then(
        res => {
          const sortedRes = res["results"].sort(function(a, b) {
            return b.ask_price - b.bid_price - (a.ask_price - a.bid_price);
          });
          this.setState(
            {
              stockData: sortedRes
            },
            function() {
              setTimeout(
                function() {
                  this.setState({
                    Loading: false
                  });
                }.bind(this),
                3000
              );
            }.bind(this)
          );
        },
        res => this.setState({ error: true })
      );
  };


componentDidMount() {
  this.apiCall = setInterval(() => {
    this.setState({Loading: true})
    this.getDataFromApi();
  }, 3000)
}
componentWillUnmount() {
  clearInterval(this.apiCall);
}


  render() {
    const { stockData, Loading } = this.state;
    const SymbolStyle = { color: "#e5e5e5" };
    return (
      <div className="App">
        {Loading ? (
          <div className="fontcolor"> Loading </div>
        ) : (
          <Button onClick={() => this.setState({ test: this.state.test + 1 })}>
            {" "}
            Test{" "}
          </Button>
        )}

        <div> {this.state.test} </div>
        <Fragment>
          <List>
            {" "}
            {!Loading &&
              stockData &&
              stockData.map(item => (
                <List.Item key={item.symbol}>
                  <List.Content>
                    <List.Header style={SymbolStyle}>{item.symbol}</List.Header>
                    <List.List className="fontcolor">
                      <List.Item> Bid Price: {item.bid_price}</List.Item>
                      <List.Item> Ask Price: {item.ask_price}</List.Item>
                      <List.Item>
                        {" "}
                        Spread: {(item.ask_price - item.bid_price).toFixed(2)}
                      </List.Item>
                    </List.List>
                  </List.Content>
                </List.Item>
              ))}{" "}
          </List>
        </Fragment>
      </div>
    );
  }
}

export default App;


  <style> body{ background-color: black;} </style>
    <div style="color:blue;" id='time'></div>
  <script>
    var date = new Date();
    var n = date.toDateString();
    var time = date.toLocaleTimeString();
    document.getElementById('time').innerHTML = n + ' ' + time;
  </script> 
